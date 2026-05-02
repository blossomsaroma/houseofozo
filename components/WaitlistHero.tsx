'use client'

import styles from './WaitlistHero.module.css'

export function WaitlistHero() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    e.currentTarget.reset()
  }

  return (
    <main className={styles.hero}>
      <div className={styles.column}>
        <h1 className={styles.title}>Join the waitlist</h1>
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
    </main>
  )
}
