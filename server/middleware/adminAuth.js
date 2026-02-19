// Simple token-based admin auth middleware
// In production, use a proper JWT library with refresh tokens
const jwt = require('jsonwebtoken') // add: npm install jsonwebtoken

const JWT_SECRET = process.env.JWT_SECRET || 'geranium_dev_secret_change_in_prod'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'bookings@geraniumcleaning.co.ke'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'

function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
  const token = authHeader.slice(7)
  try {
    const payload = jwt.verify(token, JWT_SECRET)
    if (!payload.isAdmin) return res.status(403).json({ message: 'Forbidden' })
    req.admin = payload
    next()
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' })
  }
}

function generateToken(email) {
  return jwt.sign({ email, isAdmin: true }, JWT_SECRET, { expiresIn: '7d' })
}

function validateCredentials(email, password) {
  return email === ADMIN_EMAIL && password === ADMIN_PASSWORD
}

module.exports = { requireAdmin, generateToken, validateCredentials }
