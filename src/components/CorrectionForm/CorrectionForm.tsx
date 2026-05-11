import { useEffect, useState } from 'react'
import styles from './CorrectionForm.module.css'

const ENDPOINT = import.meta.env.VITE_FORMSPREE_ENDPOINT as string

interface CorrectionFormProps {
  isOpen: boolean
  onClose: () => void
}

type Status = 'idle' | 'submitting' | 'success' | 'error'

export function CorrectionForm({ isOpen, onClose }: CorrectionFormProps) {
  const [section, setSection] = useState('')
  const [whatIsWrong, setWhatIsWrong] = useState('')
  const [whatItShouldBe, setWhatItShouldBe] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')

  useEffect(() => {
    if (isOpen) {
      setSection('')
      setWhatIsWrong('')
      setWhatItShouldBe('')
      setStatus('idle')
    }
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('submitting')
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          section: section || '(not provided)',
          what_is_wrong: whatIsWrong,
          what_it_should_be: whatItShouldBe,
          email: email || 'anonymous@noreply.com',
        }),
      })
      setStatus(res.ok ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }

  if (!isOpen) return null

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Report a Correction</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>

        <div className={styles.content}>
          {status === 'success' ? (
            <div className={styles.success}>
              <span className={styles.successIcon}>✓</span>
              <p>Thanks for the correction! We'll look into it.</p>
              <button className={styles.doneButton} onClick={onClose}>Close</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="section">
                  What section / feature?
                </label>
                <input
                  id="section"
                  type="text"
                  className={styles.input}
                  value={section}
                  onChange={e => setSection(e.target.value)}
                  placeholder="e.g. Major scale, Minor 7th chord, Dorian mode…"
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="whatIsWrong">
                  What seems incorrect?
                </label>
                <textarea
                  id="whatIsWrong"
                  className={styles.textarea}
                  value={whatIsWrong}
                  onChange={e => setWhatIsWrong(e.target.value)}
                  placeholder="e.g. The 3rd degree shows as E but I think it should be Eb"
                  rows={3}
                  required
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="whatItShouldBe">
                  What should it be?
                </label>
                <textarea
                  id="whatItShouldBe"
                  className={styles.textarea}
                  value={whatItShouldBe}
                  onChange={e => setWhatItShouldBe(e.target.value)}
                  placeholder="e.g. The b3 should be Eb (D#), making it a minor scale"
                  rows={3}
                  required
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="email">
                  Email <span className={styles.optional}>(optional — if you'd like a reply)</span>
                </label>
                <input
                  id="email"
                  type="email"
                  className={styles.input}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>

              {status === 'error' && (
                <p className={styles.errorMsg}>Something went wrong. Please try again.</p>
              )}

              <div className={styles.actions}>
                <button type="button" className={styles.cancelButton} onClick={onClose}>
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={status === 'submitting'}
                >
                  {status === 'submitting' ? 'Sending…' : 'Send Correction'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
