const axios = require('axios')

const MPESA_BASE_URL = process.env.MPESA_ENV === 'production'
  ? 'https://api.safaricom.co.ke'
  : 'https://sandbox.safaricom.co.ke'

async function getAccessToken() {
  const key = process.env.MPESA_CONSUMER_KEY
  const secret = process.env.MPESA_CONSUMER_SECRET

  if (!key || !secret) {
    throw new Error('M-Pesa credentials not configured')
  }

  const credentials = Buffer.from(`${key}:${secret}`).toString('base64')
  const res = await axios.get(`${MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: { Authorization: `Basic ${credentials}` },
  })
  return res.data.access_token
}

function getTimestamp() {
  const now = new Date()
  return [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
    String(now.getHours()).padStart(2, '0'),
    String(now.getMinutes()).padStart(2, '0'),
    String(now.getSeconds()).padStart(2, '0'),
  ].join('')
}

function formatPhone(phone) {
  // Normalize to 254XXXXXXXXX format
  const cleaned = phone.replace(/\s+/g, '').replace(/[^0-9+]/g, '')
  if (cleaned.startsWith('254')) return cleaned
  if (cleaned.startsWith('+254')) return cleaned.slice(1)
  if (cleaned.startsWith('0')) return '254' + cleaned.slice(1)
  return '254' + cleaned
}

async function initiateSTKPush({ phone, amount, bookingId, description }) {
  const token = await getAccessToken()
  const timestamp = getTimestamp()
  const shortcode = process.env.MPESA_SHORTCODE
  const passkey = process.env.MPESA_PASSKEY
  const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64')
  const callbackUrl = `${process.env.SERVER_URL || 'https://yourserver.com'}/api/payments/mpesa/callback`

  const amountInt = Math.ceil(parseFloat(amount))

  const payload = {
    BusinessShortCode: shortcode,
    Password: password,
    Timestamp: timestamp,
    TransactionType: 'CustomerPayBillOnline',
    Amount: amountInt,
    PartyA: formatPhone(phone),
    PartyB: shortcode,
    PhoneNumber: formatPhone(phone),
    CallBackURL: callbackUrl,
    AccountReference: `GCS-${bookingId.slice(-6).toUpperCase()}`,
    TransactionDesc: description || 'Geranium Cleaning Payment',
  }

  const res = await axios.post(`${MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`, payload, {
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  })

  return {
    checkoutRequestId: res.data.CheckoutRequestID,
    merchantRequestId: res.data.MerchantRequestID,
    responseCode: res.data.ResponseCode,
    responseDescription: res.data.ResponseDescription,
  }
}

async function querySTKStatus(checkoutRequestId) {
  const token = await getAccessToken()
  const timestamp = getTimestamp()
  const shortcode = process.env.MPESA_SHORTCODE
  const passkey = process.env.MPESA_PASSKEY
  const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64')

  const res = await axios.post(`${MPESA_BASE_URL}/mpesa/stkpushquery/v1/query`, {
    BusinessShortCode: shortcode,
    Password: password,
    Timestamp: timestamp,
    CheckoutRequestID: checkoutRequestId,
  }, {
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  })

  return res.data
}

module.exports = { initiateSTKPush, querySTKStatus, formatPhone }
