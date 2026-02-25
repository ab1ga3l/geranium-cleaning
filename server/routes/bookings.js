const express = require('express')
const router = express.Router()
const { getDb } = require('../config/firebase')
const { sendBookingConfirmation, sendAdminNewBookingAlert } = require('../services/emailService')

// POST /api/bookings - Create a new booking
router.post('/', async (req, res) => {
  try {
    const {
      name, email, phone, county, area, address,
      serviceType, seatType, seatCount, date, timeSlot, notes,
      paymentMethod, paymentIntentId, total, status,
    } = req.body

    // Basic validation
    if (!name || !email || !phone || !area || !seatType || !seatCount) {
      return res.status(400).json({ message: 'Missing required fields' })
    }

    const db = getDb()
    const bookingData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      county,
      area,
      address: address?.trim(),
      serviceType: serviceType || 'seats',
      seatType,
      seatCount: parseInt(seatCount),
      date: date ? new Date(date).toISOString() : null,
      timeSlot,
      notes: notes?.trim() || '',
      paymentMethod,
      paymentIntentId: paymentIntentId || null,
      total: parseFloat(total).toFixed(2),
      paymentStatus: status === 'paid' ? 'paid' : 'pending',
      bookingStatus: 'pending', // pending | accepted | declined | completed
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const docRef = await db.collection('bookings').add(bookingData)
    const booking = { ...bookingData, id: docRef.id }

    // Send emails (non-blocking)
    Promise.allSettled([
      sendBookingConfirmation(booking),
      sendAdminNewBookingAlert(booking),
    ]).then(results => {
      results.forEach((r, i) => {
        if (r.status === 'rejected') console.warn(`[Email ${i}] Failed:`, r.reason?.message)
      })
    })

    res.status(201).json({ bookingId: docRef.id, booking })
  } catch (err) {
    console.error('[POST /bookings]', err)
    res.status(500).json({ message: 'Failed to create booking' })
  }
})

// GET /api/bookings/:id/payment-status - Poll payment status
router.get('/:id/payment-status', async (req, res) => {
  try {
    const db = getDb()
    const doc = await db.collection('bookings').doc(req.params.id).get()
    if (!doc.exists) return res.status(404).json({ message: 'Booking not found' })

    const data = doc.data()
    res.json({ status: data.paymentStatus, booking: { ...data, id: doc.id } })
  } catch (err) {
    console.error('[GET /bookings/:id/payment-status]', err)
    res.status(500).json({ message: 'Server error' })
  }
})

// GET /api/bookings - List all (admin only checked by middleware)
router.get('/', async (req, res) => {
  try {
    const db = getDb()
    const snapshot = await db.collection('bookings').get()
    const bookings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    // Sort by createdAt descending
    bookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    res.json({ bookings })
  } catch (err) {
    console.error('[GET /bookings]', err)
    res.status(500).json({ message: 'Server error' })
  }
})

// PATCH /api/bookings/:id - Update booking status
router.patch('/:id', async (req, res) => {
  try {
    const { bookingStatus, paymentStatus, notes } = req.body
    const db = getDb()
    const updates = { updatedAt: new Date().toISOString() }
    if (bookingStatus) updates.bookingStatus = bookingStatus
    if (paymentStatus) updates.paymentStatus = paymentStatus
    if (notes !== undefined) updates.adminNotes = notes

    await db.collection('bookings').doc(req.params.id).update(updates)
    const doc = await db.collection('bookings').doc(req.params.id).get()
    res.json({ booking: { id: doc.id, ...doc.data() } })
  } catch (err) {
    console.error('[PATCH /bookings/:id]', err)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router
