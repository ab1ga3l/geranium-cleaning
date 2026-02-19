const express = require('express')
const router = express.Router()
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder')
const { getDb } = require('../config/firebase')
const { initiateSTKPush, querySTKStatus } = require('../services/mpesaService')
const { sendBookingConfirmation } = require('../services/emailService')

// POST /api/payments/stripe/create-intent
router.post('/stripe/create-intent', async (req, res) => {
  try {
    const { amount, currency, customerEmail, customerName } = req.body
    if (!amount || amount < 50) {
      return res.status(400).json({ message: 'Invalid amount' })
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: parseInt(amount), // in cents/smallest unit
      currency: currency || 'kes',
      receipt_email: customerEmail,
      metadata: { customerName },
      automatic_payment_methods: { enabled: true },
    })

    res.json({ clientSecret: paymentIntent.client_secret })
  } catch (err) {
    console.error('[Stripe create-intent]', err)
    res.status(500).json({ message: err.message || 'Stripe error' })
  }
})

// POST /api/payments/stripe/webhook
router.post('/stripe/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature']
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  let event
  try {
    event = webhookSecret
      ? stripe.webhooks.constructEvent(req.body, sig, webhookSecret)
      : JSON.parse(req.body)
  } catch (err) {
    return res.status(400).json({ error: `Webhook error: ${err.message}` })
  }

  if (event.type === 'payment_intent.succeeded') {
    const pi = event.data.object
    // Update booking by paymentIntentId
    try {
      const db = getDb()
      const snapshot = await db.collection('bookings').where('paymentIntentId', '==', pi.id).get()
      if (!snapshot.empty) {
        const doc = snapshot.docs[0]
        await doc.ref.update({ paymentStatus: 'paid', updatedAt: new Date().toISOString() })
      }
    } catch (err) {
      console.error('[Stripe webhook] DB update failed:', err)
    }
  }

  res.json({ received: true })
})

// POST /api/payments/mpesa/stk-push
router.post('/mpesa/stk-push', async (req, res) => {
  try {
    const { bookingId, phone, amount } = req.body
    if (!bookingId || !phone || !amount) {
      return res.status(400).json({ message: 'bookingId, phone, and amount required' })
    }

    const result = await initiateSTKPush({
      phone,
      amount,
      bookingId,
      description: 'Geranium Seat Cleaning',
    })

    // Store checkoutRequestId for later querying
    const db = getDb()
    await db.collection('bookings').doc(bookingId).update({
      mpesaCheckoutRequestId: result.checkoutRequestId,
      mpesaMerchantRequestId: result.merchantRequestId,
      updatedAt: new Date().toISOString(),
    })

    res.json({ success: true, checkoutRequestId: result.checkoutRequestId })
  } catch (err) {
    console.error('[M-Pesa STK Push]', err)
    res.status(500).json({ message: err.message || 'M-Pesa error' })
  }
})

// POST /api/payments/mpesa/callback - Safaricom callback
router.post('/mpesa/callback', async (req, res) => {
  try {
    const callback = req.body?.Body?.stkCallback
    if (!callback) return res.json({ ResultCode: 0, ResultDesc: 'Accepted' })

    const { MerchantRequestID, CheckoutRequestID, ResultCode, ResultDesc } = callback

    const db = getDb()
    const snapshot = await db.collection('bookings')
      .where('mpesaCheckoutRequestId', '==', CheckoutRequestID)
      .get()

    if (!snapshot.empty) {
      const doc = snapshot.docs[0]
      const isSuccess = ResultCode === 0

      const updates = {
        paymentStatus: isSuccess ? 'paid' : 'failed',
        mpesaResultCode: ResultCode,
        mpesaResultDesc: ResultDesc,
        updatedAt: new Date().toISOString(),
      }

      if (isSuccess) {
        const items = callback.CallbackMetadata?.Item || []
        items.forEach(item => {
          if (item.Name === 'MpesaReceiptNumber') updates.mpesaReceiptNumber = item.Value
          if (item.Name === 'Amount') updates.mpesaAmount = item.Value
          if (item.Name === 'TransactionDate') updates.mpesaTransactionDate = item.Value
        })
        // Send confirmation email
        const bookingData = { ...doc.data(), id: doc.id, ...updates }
        sendBookingConfirmation(bookingData).catch(console.warn)
      }

      await doc.ref.update(updates)
    }

    res.json({ ResultCode: 0, ResultDesc: 'Accepted' })
  } catch (err) {
    console.error('[M-Pesa Callback]', err)
    res.json({ ResultCode: 0, ResultDesc: 'Accepted' })
  }
})

// GET /api/payments/mpesa/query/:checkoutRequestId
router.get('/mpesa/query/:checkoutRequestId', async (req, res) => {
  try {
    const result = await querySTKStatus(req.params.checkoutRequestId)
    res.json(result)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
