const express = require('express')
const router = express.Router()
const { requireAdmin, generateToken, validateCredentials } = require('../middleware/adminAuth')
const { getDb } = require('../config/firebase')
const { sendBookingStatusUpdate } = require('../services/emailService')

function roundCurrency(val) {
  return Math.round(parseFloat(val || 0) * 100) / 100
}

function isValidDate(str) {
  if (!str) return false
  const d = new Date(str)
  return !isNaN(d.getTime())
}

// POST /api/admin/login
router.post('/login', (req, res) => {
  const email = (req.body.email || '').trim()
  const password = (req.body.password || '').trim()
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' })
  }
  if (!validateCredentials(email, password)) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }
  const token = generateToken(email)
  res.json({ token, message: 'Login successful' })
})

// GET /api/admin/bookings — all bookings with optional filters + pagination
router.get('/bookings', requireAdmin, async (req, res) => {
  try {
    const db = getDb()
    const { status, from, to, search, page, limit } = req.query

    let snapshot = await db.collection('bookings').get()
    let bookings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))

    // Filter by status
    if (status && status !== 'all') {
      bookings = bookings.filter(b => b.bookingStatus === status)
    }

    // Filter by date range (validate dates first)
    if (from && isValidDate(from)) {
      const fromDate = new Date(from)
      bookings = bookings.filter(b => b.date && new Date(b.date) >= fromDate)
    }
    if (to && isValidDate(to)) {
      const toDate = new Date(to)
      bookings = bookings.filter(b => b.date && new Date(b.date) <= toDate)
    }

    // Search by name/email/phone/area
    if (search) {
      const q = search.toLowerCase().trim()
      bookings = bookings.filter(b =>
        b.name?.toLowerCase().includes(q) ||
        b.email?.toLowerCase().includes(q) ||
        b.phone?.includes(q) ||
        b.area?.toLowerCase().includes(q)
      )
    }

    // Sort newest first
    bookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    const total = bookings.length

    // Pagination
    const pageNum = Math.max(1, parseInt(page) || 1)
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 1000))
    const pages = Math.max(1, Math.ceil(total / limitNum))
    const paginated = limit ? bookings.slice((pageNum - 1) * limitNum, pageNum * limitNum) : bookings

    res.json({ bookings: paginated, total, page: pageNum, pages })
  } catch (err) {
    console.error('[Admin GET /bookings]', err)
    res.status(500).json({ message: 'Server error' })
  }
})

// PATCH /api/admin/bookings/:id/status — accept or decline
router.patch('/bookings/:id/status', requireAdmin, async (req, res) => {
  try {
    const { status, adminNotes } = req.body
    const validStatuses = ['pending', 'accepted', 'declined', 'completed']
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' })
    }

    const db = getDb()
    const updates = {
      bookingStatus: status,
      updatedAt: new Date().toISOString(),
    }
    if (adminNotes !== undefined) updates.adminNotes = adminNotes

    await db.collection('bookings').doc(req.params.id).update(updates)
    const doc = await db.collection('bookings').doc(req.params.id).get()
    const booking = { id: doc.id, ...doc.data() }

    // Email client on accept/decline
    if (status === 'accepted' || status === 'declined') {
      sendBookingStatusUpdate(booking, status).catch(console.warn)
    }

    res.json({ booking })
  } catch (err) {
    console.error('[Admin PATCH /status]', err)
    res.status(500).json({ message: 'Server error' })
  }
})

// GET /api/admin/stats - dashboard summary stats
router.get('/stats', requireAdmin, async (req, res) => {
  try {
    const db = getDb()
    const snapshot = await db.collection('bookings').get()
    const bookings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))

    const now = new Date()
    // Filter once for this month
    const thisMonthBookings = bookings.filter(b => {
      const d = new Date(b.createdAt)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })

    const totalRevenue = bookings
      .filter(b => b.paymentStatus === 'paid')
      .reduce((s, b) => s + roundCurrency(b.total), 0)

    const monthRevenue = thisMonthBookings
      .filter(b => b.paymentStatus === 'paid')
      .reduce((s, b) => s + roundCurrency(b.total), 0)

    res.json({
      total: bookings.length,
      thisMonth: thisMonthBookings.length,
      pending: bookings.filter(b => b.bookingStatus === 'pending').length,
      accepted: bookings.filter(b => b.bookingStatus === 'accepted').length,
      completed: bookings.filter(b => b.bookingStatus === 'completed').length,
      declined: bookings.filter(b => b.bookingStatus === 'declined').length,
      totalRevenue: (Math.round(totalRevenue * 100) / 100).toFixed(2),
      monthRevenue: (Math.round(monthRevenue * 100) / 100).toFixed(2),
      totalSeats: bookings.reduce((s, b) => s + parseInt(b.seatCount || 0), 0),
    })
  } catch (err) {
    console.error('[Admin GET /stats]', err)
    res.status(500).json({ message: 'Server error' })
  }
})

// GET /api/admin/clients - unique clients with optional pagination
router.get('/clients', requireAdmin, async (req, res) => {
  try {
    const db = getDb()
    const snapshot = await db.collection('bookings').get()
    const bookings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))

    const clientMap = {}
    bookings.forEach(b => {
      if (!b.email) return
      if (!clientMap[b.email]) {
        clientMap[b.email] = {
          name: b.name, email: b.email, phone: b.phone,
          county: b.county, area: b.area,
          bookings: 0, totalSpent: 0, lastBooking: null,
        }
      }
      clientMap[b.email].bookings++
      clientMap[b.email].totalSpent = Math.round(
        (clientMap[b.email].totalSpent + roundCurrency(b.total)) * 100
      ) / 100
      if (!clientMap[b.email].lastBooking || new Date(b.createdAt) > new Date(clientMap[b.email].lastBooking)) {
        clientMap[b.email].lastBooking = b.createdAt
      }
    })

    const clients = Object.values(clientMap)
      .sort((a, b) => new Date(b.lastBooking) - new Date(a.lastBooking))

    res.json({ clients })
  } catch (err) {
    console.error('[Admin GET /clients]', err)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router
