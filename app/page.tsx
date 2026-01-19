import Image from 'next/image'
import styles from './page.module.css'

export default function Home() {
  return (
    <main className={styles.container}>
      <div className={styles.videoWrapper}>
        {/* Company Logo */}
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

        {/* Video */}
        <video
          className={styles.video}
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/houseofozo.MP4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Text Overlay */}
        <div className={styles.textOverlay}>
          <h1 className={styles.mainHeading}>
            A gift from memory returns
          </h1>
          <p className={styles.subHeading}>
            A trace of the familiar. A touch of the unknown.
          </p>
          <p className={styles.comingSoon}>Coming soon</p>
        </div>
      </div>
    </main>
  )
}
