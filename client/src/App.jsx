import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import LandingPage from './pages/LandingPage'
import BookingPage from './pages/BookingPage'
import BookingSuccess from './pages/BookingSuccess'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'

function App() {
  return (
    <Router>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#fff',
            color: '#60665a',
            borderRadius: '1rem',
            border: '1.5px solid #e8d5d2',
            fontFamily: 'Inter, sans-serif',
          },
          success: { iconTheme: { primary: '#96aca0', secondary: '#fff' } },
          error: { iconTheme: { primary: '#c69491', secondary: '#fff' } },
        }}
      />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/book" element={<BookingPage />} />
        <Route path="/booking-success" element={<BookingSuccess />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  )
}

export default App
