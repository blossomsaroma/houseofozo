'use client'

import { useEffect, useId, useRef } from 'react'
import styles from './WaitlistModal.module.css'

type WaitlistModalProps = {
  isOpen: boolean
  onClose: () => void
}

export function WaitlistModal({ isOpen, onClose }: WaitlistModalProps) {
  const titleId = useId()
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!isOpen) {
      document.body.classList.remove('modal-open')
      return
    }
    document.body.classList.add('modal-open')
    const t = window.setTimeout(() => closeRef.current?.focus(), 0)

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.clearTimeout(t)
      document.body.classList.remove('modal-open')
      window.removeEventListener('keydown', onKey)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose()
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    e.currentTarget.reset()
  }

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onClick={handleBackdropClick}
    >
      <button
        ref={closeRef}
        type="button"
        className={styles.close}
        onClick={onClose}
        aria-label="Close waitlist"
      >
        ×
      </button>

      <div
        className={styles.column}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id={titleId} className={styles.title}>
          Join the waitlist
        </h2>
        <p className={styles.tagline}>
          An <span className={styles.hindi}>इंडियन</span> Contemporary Perfumery
        </p>

        <div className={styles.inner}>
          <p className={styles.introLead}>The first scents are almost ready.</p>
          <p className={styles.introFollow}>Be the first to know</p>

          <form className={styles.form} onSubmit={handleSubmit}>
            <label htmlFor="waitlist-name" className="sr-only">
              Full name
            </label>
            <input
              id="waitlist-name"
              className={styles.input}
              name="name"
              type="text"
              placeholder="Full name*"
              required
              autoComplete="name"
            />
            <label htmlFor="waitlist-phone" className="sr-only">
              Phone number
            </label>
            <input
              id="waitlist-phone"
              className={styles.input}
              name="phone"
              type="tel"
              placeholder="Phone number*"
              required
              autoComplete="tel"
            />
            <label htmlFor="waitlist-email" className="sr-only">
              Email
            </label>
            <input
              id="waitlist-email"
              className={styles.input}
              name="email"
              type="email"
              placeholder="Email*"
              required
              autoComplete="email"
            />
            <button type="submit" className={styles.submit}>
              Get early access
            </button>
          </form>

          <a className={styles.innerCircle} href="#inner-circle">
            Join the inner circle
          </a>

          <div className={styles.footer}>
            <p>Crafted slowly.</p>
            <p className={styles.footerEm}>Released in limited drops.</p>
            <p className={styles.footerEm}>Early access to our first drop.</p>
            <p>The first to experience House of Ozo.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
