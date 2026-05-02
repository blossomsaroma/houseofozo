'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import styles from '@/app/page.module.css'
import { WaitlistModal } from '@/components/WaitlistModal'

export function LandingPage() {
  const [waitlistOpen, setWaitlistOpen] = useState(false)
  const waitlistOpenRef = useRef(false)
  waitlistOpenRef.current = waitlistOpen

  const openWaitlist = useCallback(() => setWaitlistOpen(true), [])
  const closeWaitlist = useCallback(() => setWaitlistOpen(false), [])

  useEffect(() => {
    const tryOpenFromGesture = () => {
      if (typeof window === 'undefined') return
      if (waitlistOpenRef.current) return
      setWaitlistOpen(true)
    }

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0 || e.deltaX !== 0) tryOpenFromGesture()
    }

    const onTouchMove = () => {
      tryOpenFromGesture()
    }

    window.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchmove', onTouchMove)
    }
  }, [])

  return (
    <>
      <main className={styles.container}>
        <div className={styles.videoWrapper}>
          <div className={styles.logoContainer}>
            <Image
              src="/houseofozologo.png"
              alt="House of Ozo Logo"
              width={180}
              height={180}
              className={styles.logo}
              priority
            />
          </div>

          <video className={styles.video} autoPlay loop muted playsInline>
            <source src="/houseofozo.MP4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          <div className={styles.textOverlay}>
            <h1 className={styles.mainHeading}>A gift from memory returns</h1>
            <p className={styles.subHeading}>
              A trace of the familiar. A touch of the unknown.
            </p>
            <p className={styles.comingSoon}>Coming soon</p>
            <button
              type="button"
              className={styles.waitlistButton}
              onClick={openWaitlist}
            >
              Join the waitlist
            </button>
          </div>
        </div>
      </main>

      <WaitlistModal isOpen={waitlistOpen} onClose={closeWaitlist} />
    </>
  )
}
