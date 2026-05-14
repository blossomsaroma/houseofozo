'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  DEFAULT_WAITLIST_COUNTRY_ISO,
  type WaitlistCountryOption,
  WAITLIST_COUNTRY_OPTIONS,
  flagForIso,
  isValidWaitlistCountryIso,
} from '@/lib/waitlistCountryCodes'
import styles from './WaitlistHero.module.css'

const INSTAGRAM_URL =
  'https://www.instagram.com/houseofozo.in?igsh=djI3N3hiajlwNDN5'

const WAITLIST_DRAFT_KEY = 'houseofozo:waitlist-draft'

/**
 * `next dev`: skip `/api/waitlist` and show the success modal (no Google env needed).
 * Set NEXT_PUBLIC_USE_REAL_WAITLIST_API=true in .env.local to hit the real API locally.
 */
const skipWaitlistApiInDev =
  process.env.NODE_ENV === 'development' &&
  process.env.NEXT_PUBLIC_USE_REAL_WAITLIST_API !== 'true'

type WaitlistDraft = {
  name: string
  countryIso: string
  phone: string
  email: string
}

const emptyDraft: WaitlistDraft = {
  name: '',
  countryIso: DEFAULT_WAITLIST_COUNTRY_ISO,
  phone: '',
  email: '',
}

function readDraftFromStorage(): WaitlistDraft {
  if (typeof window === 'undefined') return emptyDraft
  try {
    const raw = localStorage.getItem(WAITLIST_DRAFT_KEY)
    if (!raw) return emptyDraft
    const p = JSON.parse(raw) as Record<string, unknown>
    const iso =
      typeof p.countryIso === 'string' ? p.countryIso.trim().toLowerCase() : ''
    if (iso && isValidWaitlistCountryIso(iso)) {
      return {
        name: typeof p.name === 'string' ? p.name : '',
        countryIso: iso,
        phone: typeof p.phone === 'string' ? p.phone : '',
        email: typeof p.email === 'string' ? p.email : '',
      }
    }
    const legacyDial =
      typeof p.countryCode === 'string' ? p.countryCode.trim() : ''
    const fromDial = legacyDial.startsWith('+')
      ? WAITLIST_COUNTRY_OPTIONS.find((o) => o.dial === legacyDial)?.iso2
      : undefined
    return {
      name: typeof p.name === 'string' ? p.name : '',
      countryIso: fromDial ?? DEFAULT_WAITLIST_COUNTRY_ISO,
      phone: typeof p.phone === 'string' ? p.phone : '',
      email: typeof p.email === 'string' ? p.email : '',
    }
  } catch {
    return emptyDraft
  }
}

function countryMatchesQuery(c: WaitlistCountryOption, q: string): boolean {
  const s = q.trim().toLowerCase()
  if (!s) return true
  if (c.label.toLowerCase().includes(s)) return true
  if (c.iso2.includes(s)) return true
  if (c.dial.toLowerCase().includes(s)) return true
  const qDigits = s.replace(/\D/g, '')
  if (qDigits && c.dial.replace(/\D/g, '').includes(qDigits)) return true
  return false
}

function writeDraftToStorage(draft: WaitlistDraft) {
  try {
    if (!draft.name && !draft.phone && !draft.email) {
      localStorage.removeItem(WAITLIST_DRAFT_KEY)
    } else {
      localStorage.setItem(WAITLIST_DRAFT_KEY, JSON.stringify(draft))
    }
  } catch {
    // ignore quota / private mode
  }
}

function InstagramIcon() {
  return (
    <svg
      className={styles.instagramIcon}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 11-2.881.001 1.44 1.44 0 012.881-.001z" />
    </svg>
  )
}

export function WaitlistHero() {
  const [draft, setDraft] = useState<WaitlistDraft>(emptyDraft)
  const draftRef = useRef(draft)
  draftRef.current = draft

  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [statusMessage, setStatusMessage] = useState('')
  const [successModalOpen, setSuccessModalOpen] = useState(false)
  const successCloseRef = useRef<HTMLButtonElement>(null)
  const [countryPickerOpen, setCountryPickerOpen] = useState(false)
  const [countrySearch, setCountrySearch] = useState('')
  const countryComboRef = useRef<HTMLDivElement>(null)
  const countrySearchRef = useRef<HTMLInputElement>(null)

  const filteredCountryOptions = useMemo(
    () => WAITLIST_COUNTRY_OPTIONS.filter((c) => countryMatchesQuery(c, countrySearch)),
    [countrySearch],
  )

  const selectedCountry =
    WAITLIST_COUNTRY_OPTIONS.find((o) => o.iso2 === draft.countryIso) ??
    WAITLIST_COUNTRY_OPTIONS[0]

  const persistDraft = (next: WaitlistDraft) => {
    setDraft(next)
    writeDraftToStorage(next)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const name = draft.name.trim()
    const countryIso = draft.countryIso.trim().toLowerCase()
    const phone = draft.phone.trim()
    const email = draft.email.trim()

    setStatusMessage('')

    if (skipWaitlistApiInDev) {
      persistDraft(emptyDraft)
      setStatus('idle')
      setSuccessModalOpen(true)
      return
    }

    setStatus('loading')

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, countryIso, phone, email }),
      })
      const data = (await res.json().catch(() => ({}))) as {
        error?: string
      }

      if (!res.ok) {
        setStatus('error')
        setStatusMessage(data.error || 'Something went wrong. Try again.')
        return
      }

      persistDraft(emptyDraft)
      setStatus('idle')
      setStatusMessage('')
      setSuccessModalOpen(true)
    } catch {
      setStatus('error')
      setStatusMessage('Network error. Try again.')
    }
  }

  useEffect(() => {
    setDraft(readDraftFromStorage())
  }, [])

  useEffect(() => {
    if (!countryPickerOpen) return
    countrySearchRef.current?.focus()
  }, [countryPickerOpen])

  useEffect(() => {
    if (!countryPickerOpen) return
    const onPointerDown = (e: PointerEvent) => {
      const el = countryComboRef.current
      if (el && !el.contains(e.target as Node)) {
        setCountryPickerOpen(false)
        setCountrySearch('')
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [countryPickerOpen])

  useEffect(() => {
    const flush = () => writeDraftToStorage(draftRef.current)
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') flush()
    }
    window.addEventListener('pagehide', flush)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      window.removeEventListener('pagehide', flush)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  useEffect(() => {
    if (!successModalOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSuccessModalOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    const id = window.requestAnimationFrame(() => {
      successCloseRef.current?.focus()
    })
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.cancelAnimationFrame(id)
    }
  }, [successModalOpen])

  useEffect(() => {
    const preventScroll = (e: Event) => {
      e.preventDefault()
    }
    window.addEventListener('wheel', preventScroll, { passive: false })
    window.addEventListener('touchmove', preventScroll, { passive: false })
    return () => {
      window.removeEventListener('wheel', preventScroll)
      window.removeEventListener('touchmove', preventScroll)
    }
  }, [])

  return (
    <main className={styles.hero}>
      <video
        className={styles.bgVideo}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden
      >
        <source src="/backgroundVideo.mp4" type="video/mp4" />
      </video>

      <svg
        className={styles.gooFilterSvg}
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
        focusable="false"
      >
        <defs>
          <filter
            id="goo-waitlist-submit"
            x="-40%"
            y="-40%"
            width="180%"
            height="180%"
          >
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="10"
              result="blur"
            />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      <div className={styles.column}>
        <h1 className={styles.title}>Join the waitlist</h1>
        <p className={styles.tagline}>
          An <span className={styles.hindi}>इंडियन</span> Contemporary Perfumery
        </p>

        <div className={styles.inner}>
          <p className={styles.introLead}>
            Those inside the house,
            <br />
            get more than just a scent.
          </p>

          <form
            className={styles.form}
            onSubmit={handleSubmit}
            suppressHydrationWarning
          >
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
              value={draft.name}
              onChange={(e) =>
                persistDraft({ ...draft, name: e.target.value })
              }
              suppressHydrationWarning
            />
            <div className={styles.phoneRow}>
              <input
                type="hidden"
                name="countryIso"
                value={draft.countryIso}
                readOnly
                suppressHydrationWarning
              />
              <div className={styles.countryCombo} ref={countryComboRef}>
                <label id="waitlist-country-label" className="sr-only">
                  Country code — search or choose
                </label>
                <button
                  type="button"
                  id="waitlist-country-trigger"
                  className={styles.countryTrigger}
                  aria-labelledby="waitlist-country-label"
                  aria-expanded={countryPickerOpen}
                  aria-haspopup="listbox"
                  onClick={() => {
                    setCountryPickerOpen((o) => {
                      if (!o) setCountrySearch('')
                      return !o
                    })
                  }}
                >
                  <span className={styles.countryFlag} aria-hidden>
                    {flagForIso(draft.countryIso)}
                  </span>
                  <span className={styles.countryTriggerText}>
                    {selectedCountry.dial} · {selectedCountry.label}
                  </span>
                  <span className={styles.countryChevron} aria-hidden>
                    ▾
                  </span>
                </button>
                {countryPickerOpen ? (
                  <div
                    className={styles.countryPopover}
                    role="presentation"
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') {
                        setCountryPickerOpen(false)
                        setCountrySearch('')
                      }
                    }}
                  >
                    <input
                      ref={countrySearchRef}
                      type="search"
                      className={styles.countrySearch}
                      value={countrySearch}
                      onChange={(e) => setCountrySearch(e.target.value)}
                      placeholder="Search country or +code"
                      aria-label="Search countries"
                      autoComplete="off"
                      suppressHydrationWarning
                    />
                    <ul className={styles.countryList} role="listbox">
                      {filteredCountryOptions.length === 0 ? (
                        <li className={styles.countryEmpty} role="presentation">
                          No matches
                        </li>
                      ) : (
                        filteredCountryOptions.map((c) => (
                          <li key={c.iso2} role="none">
                            <button
                              type="button"
                              role="option"
                              aria-selected={c.iso2 === draft.countryIso}
                              className={styles.countryOption}
                              onClick={() => {
                                persistDraft({ ...draft, countryIso: c.iso2 })
                                setCountryPickerOpen(false)
                                setCountrySearch('')
                              }}
                            >
                              {c.dial} · {c.label}
                            </button>
                          </li>
                        ))
                      )}
                    </ul>
                  </div>
                ) : null}
              </div>
              <div className={styles.phoneField}>
                <label htmlFor="waitlist-phone" className="sr-only">
                  Phone number (without country code)
                </label>
                <input
                  id="waitlist-phone"
                  className={`${styles.input} ${styles.phoneInput}`}
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  placeholder="Phone number*"
                  required
                  autoComplete="tel-national"
                  value={draft.phone}
                  onChange={(e) =>
                    persistDraft({ ...draft, phone: e.target.value })
                  }
                  suppressHydrationWarning
                />
              </div>
            </div>
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
              value={draft.email}
              onChange={(e) =>
                persistDraft({ ...draft, email: e.target.value })
              }
              suppressHydrationWarning
            />
            <button
              type="submit"
              className={styles.submit}
              disabled={status === 'loading'}
            >
              <span className={styles.submitLabel}>
                {status === 'loading' ? 'SENDING…' : 'RESERVE MY PLACE'}
              </span>
              <span className={styles.submitBlobs} aria-hidden>
                <span className={styles.submitBlob} />
                <span className={styles.submitBlob} />
                <span className={styles.submitBlob} />
              </span>
            </button>
            <p
              className={`${styles.formStatus} ${
                status === 'error' ? styles.formStatusError : ''
              }`}
              role="status"
              aria-live="polite"
            >
              {statusMessage}
            </p>
          </form>

          <div className={styles.footer}>
            <p className={styles.footerMain}>
              The first perk of being early?
              <br />
              Our debut drop, yours before anyone else.
            </p>
            <p>Crafted slowly | Released in limited drops</p>
          </div>
        </div>
      </div>

      <footer className={styles.bottomBar}>
        <a
          href={INSTAGRAM_URL}
          className={styles.instagramLink}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="House of Ozo on Instagram"
        >
          <InstagramIcon />
        </a>
        <a
          href="mailto:support@houseofozo.com"
          className={styles.supportEmail}
        >
          support@houseofozo.com
        </a>
      </footer>

      {successModalOpen ? (
        <div
          className={styles.successBackdrop}
          role="presentation"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSuccessModalOpen(false)
          }}
        >
          <div
            className={styles.successModal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="waitlist-success-title"
            aria-describedby="waitlist-success-desc"
          >
            <h2 id="waitlist-success-title" className={styles.successTitle}>
              You&apos;re on the list
            </h2>
            <p id="waitlist-success-desc" className={styles.successText}>
              We&apos;ll be in touch when the house opens for early access.
            </p>
            <button
              ref={successCloseRef}
              type="button"
              className={styles.successClose}
              onClick={() => setSuccessModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      ) : null}
    </main>
  )
}
