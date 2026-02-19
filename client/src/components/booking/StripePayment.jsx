import { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder')

function CheckoutForm({ total, formData, onSuccess }) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!stripe || !elements) return
    setLoading(true)
    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
      })
      if (error) {
        toast.error(error.message)
        setLoading(false)
        return
      }
      if (paymentIntent.status === 'succeeded') {
        // Save booking
        const res = await axios.post('/api/bookings', {
          ...formData,
          paymentMethod: 'card',
          paymentIntentId: paymentIntent.id,
          total,
          status: 'paid',
        })
        toast.success('Payment successful!')
        onSuccess(res.data.booking)
      }
    } catch (err) {
      toast.error('Payment failed. Please try again.')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement options={{ layout: 'tabs' }} />
      <button
        type="submit"
        disabled={!stripe || loading}
        className="btn-primary w-full flex items-center justify-center gap-2 mt-4">
        {loading ? (
          <>
            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Processing…
          </>
        ) : (
          `Pay KSh ${total} by Card`
        )}
      </button>
    </form>
  )
}

export default function StripePayment({ formData, total, onSuccess }) {
  const [clientSecret, setClientSecret] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    axios.post('/api/payments/stripe/create-intent', {
      amount: Math.round(parseFloat(total) * 100),
      currency: 'kes',
      customerEmail: formData.email,
      customerName: formData.name,
    })
      .then(res => setClientSecret(res.data.clientSecret))
      .catch(() => setError('Could not initialize payment. Please check your connection.'))
  }, [total, formData.email, formData.name])

  if (error) return (
    <div className="p-4 rounded-xl text-sm text-center" style={{ backgroundColor: '#fef5f3', color: '#c69491' }}>
      {error}
    </div>
  )

  if (!clientSecret) return (
    <div className="flex items-center justify-center py-8">
      <svg className="animate-spin h-8 w-8" style={{ color: '#c69491' }} fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
      </svg>
    </div>
  )

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: '#c69491',
            colorBackground: '#ffffff',
            colorText: '#60665a',
            colorDanger: '#e57373',
            fontFamily: 'Inter, system-ui, sans-serif',
            borderRadius: '12px',
          },
        },
      }}
    >
      <CheckoutForm total={total} formData={formData} onSuccess={onSuccess} />
    </Elements>
  )
}
