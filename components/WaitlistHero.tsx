'use client'

import { useEffect } from 'react'
import styles from './WaitlistHero.module.css'

const INSTAGRAM_URL =
  'https://www.instagram.com/houseofozo.in?igsh=djI3N3hiajlwNDN5'

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
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    e.currentTarget.reset()
  }

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
              <span className={styles.submitLabel}>RESERVE MY PLACE</span>
              <span className={styles.submitBlobs} aria-hidden>
                <span className={styles.submitBlob} />
                <span className={styles.submitBlob} />
                <span className={styles.submitBlob} />
              </span>
            </button>
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
    </main>
  )
}
