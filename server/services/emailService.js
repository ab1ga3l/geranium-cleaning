const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

const BRAND_COLOR = '#c69491'
const ACCENT = '#96aca0'
const DARK = '#60665a'

function baseTemplate(content) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Geranium Cleaning Services</title>
</head>
<body style="margin:0;padding:0;background:#fdf8f6;font-family:Inter,Segoe UI,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#f9c8c2,#c69491);border-radius:20px 20px 0 0;padding:32px;text-align:center;">
      <div style="width:48px;height:48px;background:white;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;margin-bottom:12px;font-size:22px;">🌸</div>
      <h1 style="margin:0;color:white;font-size:22px;font-weight:700;">Geranium Cleaning Services</h1>
      <p style="margin:6px 0 0;color:rgba(255,255,255,0.85);font-size:13px;">by Patience Wanja · Nairobi & Kiambu</p>
    </div>
    <!-- Body -->
    <div style="background:white;border-radius:0 0 20px 20px;padding:36px;box-shadow:0 4px 20px rgba(198,148,145,0.1);">
      ${content}
    </div>
    <!-- Footer -->
    <div style="text-align:center;padding:24px;color:#96aca0;font-size:12px;">
      <p>📞 +254 726 390610 &nbsp;·&nbsp; ✉️ bookings@geraniumcleaning.co.ke</p>
      <p>📍 Nairobi & Kiambu, Kenya</p>
      <p style="margin-top:12px;">© ${new Date().getFullYear()} Geranium Cleaning Services</p>
    </div>
  </div>
</body>
</html>`
}

async function sendBookingConfirmation(booking) {
  const dateStr = booking.date
    ? new Date(booking.date).toLocaleDateString('en-KE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    : 'TBD'

  const content = `
    <h2 style="color:${DARK};margin:0 0 8px;">Booking Confirmed! ✨</h2>
    <p style="color:#7d9094;margin:0 0 24px;">Hi <strong>${booking.name}</strong>, your seat cleaning is booked. We'll see you soon!</p>

    <div style="background:#fef5f3;border-radius:14px;padding:24px;margin-bottom:24px;border:1.5px solid #f9c8c2;">
      <h3 style="color:${DARK};margin:0 0 16px;font-size:15px;">Booking Summary</h3>
      ${[
        ['Booking ID', `#${booking.id?.slice(-8).toUpperCase() || 'GCS-XXXX'}`],
        ['Date & Time', `${dateStr} at ${booking.timeSlot}`],
        ['Location', `${booking.address}, ${booking.area}, ${booking.county}`],
        ['Seat Type', booking.seatType],
        ['Number of Seats', `${booking.seatCount} seat${booking.seatCount > 1 ? 's' : ''}`],
        ['Payment Method', booking.paymentMethod === 'mpesa' ? 'M-Pesa' : 'Card'],
        ['Amount Paid', `KSh ${booking.total}`],
      ].map(([label, value]) => `
        <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f0e8e6;font-size:14px;">
          <span style="color:#96aca0;">${label}</span>
          <span style="color:${DARK};font-weight:600;">${value}</span>
        </div>
      `).join('')}
    </div>

    <div style="background:#f9c8c2;border-radius:12px;padding:16px;margin-bottom:24px;text-align:center;">
      <p style="margin:0;color:${DARK};font-size:14px;">
        🌸 Our cleaner will contact you before arrival.<br>
        For questions: <a href="tel:+254726390610" style="color:${BRAND_COLOR};font-weight:600;">+254 726 390610</a>
      </p>
    </div>

    <p style="color:#7d9094;font-size:13px;margin:0;">
      Thank you for choosing Geranium Cleaning Services. We look forward to making your seats sparkle!
    </p>
  `

  await transporter.sendMail({
    from: `"Geranium Cleaning 🌸" <${process.env.SMTP_USER}>`,
    to: booking.email,
    subject: `✅ Booking Confirmed – ${dateStr} · Geranium Cleaning`,
    html: baseTemplate(content),
  })
}

async function sendBookingStatusUpdate(booking, status) {
  const isAccepted = status === 'accepted'
  const content = `
    <h2 style="color:${DARK};margin:0 0 8px;">
      ${isAccepted ? '🎉 Booking Accepted!' : '❌ Booking Update'}
    </h2>
    <p style="color:#7d9094;margin:0 0 24px;">Hi <strong>${booking.name}</strong>,</p>
    ${isAccepted
      ? `<p style="color:#7d9094;">Great news! Your cleaning booking for <strong>${booking.date ? new Date(booking.date).toLocaleDateString('en-KE') : ''} at ${booking.timeSlot}</strong> has been confirmed by our team. We're looking forward to seeing you!</p>`
      : `<p style="color:#7d9094;">We're sorry, but we're unable to fulfill your booking for <strong>${booking.date ? new Date(booking.date).toLocaleDateString('en-KE') : ''} at ${booking.timeSlot}</strong>. Please contact us to reschedule.</p>`
    }
    <div style="text-align:center;margin-top:24px;">
      <a href="tel:+254726390610" style="background:${BRAND_COLOR};color:white;padding:12px 28px;border-radius:30px;text-decoration:none;font-weight:600;font-size:14px;">
        Contact Us
      </a>
    </div>
  `

  await transporter.sendMail({
    from: `"Geranium Cleaning 🌸" <${process.env.SMTP_USER}>`,
    to: booking.email,
    subject: `${isAccepted ? '✅ Confirmed' : '❌ Update'} – Your Geranium Cleaning Booking`,
    html: baseTemplate(content),
  })
}

async function sendAdminNewBookingAlert(booking) {
  const content = `
    <h2 style="color:${DARK};margin:0 0 8px;">New Booking Received! 🌸</h2>
    <p style="color:#7d9094;margin:0 0 20px;">A new cleaning booking has been submitted.</p>
    <div style="background:#fef5f3;border-radius:14px;padding:20px;border:1.5px solid #f9c8c2;">
      ${[
        ['Client', booking.name],
        ['Email', booking.email],
        ['Phone', booking.phone],
        ['Location', `${booking.address}, ${booking.area}, ${booking.county}`],
        ['Date & Time', `${booking.date ? new Date(booking.date).toLocaleDateString('en-KE') : ''} at ${booking.timeSlot}`],
        ['Seat Type', booking.seatType],
        ['Seats', booking.seatCount],
        ['Payment', booking.paymentMethod === 'mpesa' ? 'M-Pesa' : 'Card'],
        ['Amount', `KSh ${booking.total}`],
        ['Status', booking.paymentStatus || 'pending'],
      ].map(([label, value]) => `
        <div style="display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid #f0e8e6;font-size:14px;">
          <span style="color:#96aca0;">${label}</span>
          <span style="color:${DARK};font-weight:600;">${value}</span>
        </div>
      `).join('')}
    </div>
    <div style="text-align:center;margin-top:20px;">
      <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/admin/dashboard"
        style="background:${BRAND_COLOR};color:white;padding:12px 28px;border-radius:30px;text-decoration:none;font-weight:600;font-size:14px;">
        View in Dashboard
      </a>
    </div>
  `

  await transporter.sendMail({
    from: `"Geranium System" <${process.env.SMTP_USER}>`,
    to: process.env.ADMIN_EMAIL || 'bookings@geraniumcleaning.co.ke',
    subject: `🆕 New Booking – ${booking.name} · KSh ${booking.total}`,
    html: baseTemplate(content),
  })
}

async function sendInvoiceEmail(booking) {
  const dateStr = booking.date
    ? new Date(booking.date).toLocaleDateString('en-KE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    : 'N/A'

  const total = parseFloat(booking.total)
  const totalDisplay = !isNaN(total) ? `KSh ${total.toLocaleString('en-KE')}` : `KSh ${booking.total}`

  const content = `
    <h2 style="color:${DARK};margin:0 0 8px;">Service Complete! Here's Your Invoice 🧾</h2>
    <p style="color:#7d9094;margin:0 0 24px;">Hi <strong>${booking.name}</strong>, your seat cleaning is done. Thank you for choosing us!</p>

    <div style="background:#fef5f3;border-radius:14px;padding:24px;margin-bottom:24px;border:1.5px solid #f9c8c2;">
      <h3 style="color:${DARK};margin:0 0 16px;font-size:15px;">Invoice Summary</h3>
      ${[
        ['Booking ID', `#${booking.id?.slice(-8).toUpperCase() || 'GCS-XXXX'}`],
        ['Date & Time', `${dateStr} at ${booking.timeSlot || 'N/A'}`],
        ['Location', [booking.address, booking.area, booking.county].filter(Boolean).join(', ')],
        ['Seat Type', booking.seatType || 'N/A'],
        ['Seats Cleaned', `${booking.seatCount} seat${booking.seatCount > 1 ? 's' : ''}`],
        ['Payment Method', 'Pay on Service (Cash)'],
        ['Amount Due', totalDisplay],
      ].map(([label, value]) => `
        <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f0e8e6;font-size:14px;">
          <span style="color:#96aca0;">${label}</span>
          <span style="color:${DARK};font-weight:600;">${value}</span>
        </div>
      `).join('')}
      <div style="display:flex;justify-content:space-between;padding:12px 0 0;font-size:16px;font-weight:700;">
        <span style="color:${DARK};">Total</span>
        <span style="color:${BRAND_COLOR};">${totalDisplay}</span>
      </div>
    </div>

    <div style="background:#f9c8c2;border-radius:12px;padding:16px;margin-bottom:24px;text-align:center;">
      <p style="margin:0;color:${DARK};font-size:14px;">
        🌸 Thank you for using Geranium Cleaning Services!<br>
        We hope to see you again soon.
      </p>
    </div>

    <div style="text-align:center;margin-bottom:24px;">
      <a href="${process.env.CLIENT_URL || 'https://geranium-cleaning.vercel.app'}/book"
        style="background:${BRAND_COLOR};color:white;padding:12px 28px;border-radius:30px;text-decoration:none;font-weight:600;font-size:14px;">
        Book Again
      </a>
    </div>

    <p style="color:#7d9094;font-size:13px;margin:0;">
      Questions? Call <a href="tel:+254726390610" style="color:${BRAND_COLOR};font-weight:600;">+254 726 390610</a> or reply to this email.
    </p>
  `

  await transporter.sendMail({
    from: `"Geranium Cleaning 🌸" <${process.env.SMTP_USER}>`,
    to: booking.email,
    subject: `🧾 Service Complete – Invoice · Geranium Cleaning`,
    html: baseTemplate(content),
  })
}

module.exports = { sendBookingConfirmation, sendBookingStatusUpdate, sendAdminNewBookingAlert, sendInvoiceEmail }
