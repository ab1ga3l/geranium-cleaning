# 🌸 Geranium Cleaning Services

Professional seat cleaning booking platform for **Geranium Cleaning Services** by Patience Wanja.

**Service:** Car seats, office chairs, dining chairs, sofas — KSh 5.40 per seat
**Location:** Nairobi & Kiambu, Kenya
**Contact:** +254 726 390610 | bookings@geraniumcleaning.co.ke

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 19 + Vite + Tailwind CSS v4 |
| Backend | Node.js + Express |
| Database | Firebase Firestore |
| Payments | M-Pesa (Daraja API) + Stripe |
| Email | Nodemailer (Gmail SMTP) |
| Auth | JWT (admin portal) |

---

## Project Structure

```
geranium-cleaning/
├── client/                  # React frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx      # Home page
│   │   │   ├── BookingPage.jsx      # 3-step booking form
│   │   │   ├── BookingSuccess.jsx   # Confirmation page
│   │   │   ├── AdminLogin.jsx       # Admin login
│   │   │   └── AdminDashboard.jsx   # Admin panel
│   │   ├── components/
│   │   │   ├── layout/              # Navbar, Footer
│   │   │   ├── booking/             # StripePayment
│   │   │   └── admin/               # BookingCard, StatsCard, CalendarView, ClientsTable
│   │   └── index.css                # Global styles + Tailwind
│   └── .env.example
├── server/                  # Node.js backend
│   ├── index.js             # Express app entry
│   ├── routes/
│   │   ├── bookings.js      # CRUD for bookings
│   │   ├── payments.js      # Stripe + M-Pesa endpoints
│   │   └── admin.js         # Admin-protected routes
│   ├── services/
│   │   ├── emailService.js  # Nodemailer templates
│   │   └── mpesaService.js  # Daraja API integration
│   ├── middleware/
│   │   └── adminAuth.js     # JWT middleware
│   ├── config/
│   │   └── firebase.js      # Firestore setup + mock fallback
│   └── .env.example
└── README.md
```

---

## Quick Start

### 1. Install Dependencies

```bash
# Install all
cd client && npm install
cd ../server && npm install
```

### 2. Configure Environment Variables

**Server** — copy and fill in:
```bash
cd server
cp .env.example .env
# Edit .env with your real credentials
```

**Client** — copy and fill in:
```bash
cd client
cp .env.example .env
# Add your Stripe publishable key
```

### 3. Start Development Servers

Open two terminals:

```bash
# Terminal 1 — Frontend (http://localhost:5173)
cd client
npm run dev

# Terminal 2 — Backend (http://localhost:5000)
cd server
npm run dev
```

---

## Setting Up Third-Party Services

### Firebase (Database)
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project → Enable **Firestore Database**
3. Go to Project Settings → Service Accounts → **Generate new private key**
4. Copy the JSON content into `FIREBASE_SERVICE_ACCOUNT_JSON` in `server/.env` (as a single line)

### M-Pesa (Daraja API)
1. Register at [Safaricom Developer Portal](https://developer.safaricom.co.ke)
2. Create an app → Get **Consumer Key** and **Consumer Secret**
3. For sandbox: use shortcode `174379` and the test passkey from the portal
4. For production: use your registered **Paybill/Till number**
5. Set `MPESA_ENV=production` in `.env` when going live
6. Expose your server with ngrok or deploy to get a public callback URL

### Stripe (Card Payments)
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Get **Publishable Key** → `client/.env` as `VITE_STRIPE_PUBLISHABLE_KEY`
3. Get **Secret Key** → `server/.env` as `STRIPE_SECRET_KEY`
4. Set up a webhook endpoint at `/api/payments/stripe/webhook`
5. Copy **Webhook Signing Secret** → `STRIPE_WEBHOOK_SECRET`

### Gmail SMTP (Email)
1. Enable 2-Factor Authentication on your Gmail account
2. Go to Google Account → Security → **App passwords**
3. Generate an app password for "Mail"
4. Use it as `SMTP_PASS` in `server/.env`

---

## Admin Dashboard

Access at: `http://localhost:5173/admin`

Default credentials (change in `.env`):
- **Email:** `bookings@geraniumcleaning.co.ke`
- **Password:** `admin123`

**Features:**
- Overview with live stats (total bookings, revenue, pending count)
- Bookings list with search & status filter
- Accept / Decline / Mark Complete actions (auto-emails client)
- Calendar view showing bookings per day
- Client management table

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/bookings` | Create booking |
| GET | `/api/bookings/:id/payment-status` | Poll payment status |
| POST | `/api/payments/stripe/create-intent` | Create Stripe PaymentIntent |
| POST | `/api/payments/mpesa/stk-push` | Initiate M-Pesa STK push |
| POST | `/api/payments/mpesa/callback` | Safaricom webhook |
| POST | `/api/admin/login` | Admin login |
| GET | `/api/admin/bookings` | List all bookings (auth) |
| PATCH | `/api/admin/bookings/:id/status` | Update status (auth) |
| GET | `/api/admin/stats` | Dashboard stats (auth) |
| GET | `/api/admin/clients` | Client list (auth) |

---

## Deployment

**Frontend** → Deploy `client/` to [Vercel](https://vercel.com) or Netlify
**Backend** → Deploy `server/` to [Railway](https://railway.app), Render, or VPS

Set `CLIENT_URL` and `SERVER_URL` in production env vars accordingly.

---

## Color Palette

| Name | Hex |
|------|-----|
| Primary (peachy pink) | `#f9c8c2` |
| Secondary (dusty rose) | `#c69491` |
| Accent (sage green) | `#96aca0` |
| Neutral (blue-gray) | `#7d9094` |
| Dark (muted olive) | `#60665a` |

---

*Built with care for Geranium Cleaning Services 🌸*
