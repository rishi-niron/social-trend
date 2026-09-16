import { useState, type FormEvent } from 'react'
import './App.css'

function App() {
  const [to, setTo] = useState('')
  const [subject, setSubject] = useState('Test email')
  const [message, setMessage] = useState('Hello from the React test app!')
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    setErrorMessage('')

    try {
      const res = await fetch('http://localhost:4000/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, subject, message }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to send email')
      }

      setStatus('success')
    } catch (err) {
      setStatus('error')
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  return (
    <section style={{ maxWidth: 480, margin: '4rem auto', textAlign: 'left' }}>
      <h1>Send test email</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <label>
          To
          <input
            type="email"
            required
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="recipient@example.com"
            style={{ width: '100%' }}
          />
        </label>
        <label>
          Subject
          <input
            type="text"
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            style={{ width: '100%' }}
          />
        </label>
        <label>
          Message
          <textarea
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            style={{ width: '100%' }}
          />
        </label>
        <button type="submit" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending...' : 'Send email'}
        </button>
      </form>
      {status === 'success' && <p style={{ color: 'green' }}>Email sent! Check your Mailtrap inbox.</p>}
      {status === 'error' && <p style={{ color: 'red' }}>Error: {errorMessage}</p>}
    </section>
  )
}

export default App
