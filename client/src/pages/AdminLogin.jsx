import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Flower, Eye, EyeOff, LogIn } from 'lucide-react'
import api from '../lib/api'
import toast from 'react-hot-toast'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    const trimmedEmail = email.trim()
    const trimmedPassword = password.trim()
    if (!trimmedEmail || !trimmedPassword) { toast.error('Enter email and password'); return }
    setLoading(true)
    try {
      const res = await api.post('/admin/login', { email: trimmedEmail, password: trimmedPassword })
      localStorage.setItem('admin_token', res.data.token)
      toast.success('Welcome back!')
      navigate('/admin/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg, #fef5f3 0%, #fdf8f6 60%, #f0f4f2 100%)' }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
            style={{ background: 'linear-gradient(135deg, #f9c8c2, #c69491)' }}>
            <Flower size={28} color="white" />
          </div>
          <h1 className="text-2xl font-bold" style={{ color: '#60665a' }}>Admin Portal</h1>
          <p className="text-sm mt-1" style={{ color: '#96aca0' }}>Geranium Cleaning Services</p>
        </div>

        <form onSubmit={handleLogin} className="card shadow-2xl" style={{ pointerEvents: loading ? 'none' : 'auto' }}>
          <h2 className="font-bold text-xl mb-6 text-center" style={{ color: '#60665a' }}>Sign In</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#60665a' }}>Email</label>
              <input
                type="email"
                className="input-field"
                placeholder="bookings@geraniumcleaning.co.ke"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#60665a' }}>Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  className="input-field pr-12"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
                  style={{ color: '#96aca0', background: 'none', border: 'none', cursor: 'pointer' }}>
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 mt-2">
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Signing in…
                </>
              ) : (
                <><LogIn size={18} /> Sign In</>
              )}
            </button>
          </div>
        </form>

        <p className="text-center text-xs mt-6" style={{ color: '#96aca0' }}>
          Geranium Cleaning Services Admin · Nairobi, Kenya
        </p>
      </div>
    </div>
  )
}
