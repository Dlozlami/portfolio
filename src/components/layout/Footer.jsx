import { useNavigate } from 'react-router-dom'
import styles from './Footer.module.css'

export default function Footer() {
  const navigate = useNavigate()

  return (
    <footer className={styles.footer}>
      <div className={styles.grid}>
        <div className={styles.col}>
          <p className={styles.colLabel}>Contact</p>
          <span>dlozi.mthethwa@gmail.com</span>
          <span>076 350 9451</span>
        </div>

        <div className={styles.col}>
          <p className={styles.colLabel}>Find me</p>
          <div className={styles.icons}>
            <a href="https://linkedin.com/in/dlozimthethwa" target="_blank" rel="noreferrer" className={styles.iconBtn} aria-label="LinkedIn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="3" stroke="#E7E900" strokeWidth="1.5"/><path d="M7 10v7M7 7v.5" stroke="#E7E900" strokeWidth="1.5" strokeLinecap="round"/><path d="M11 17v-4c0-1.1.9-2 2-2s2 .9 2 2v4M11 10v7" stroke="#E7E900" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </a>
            <a href="https://github.com/Dlozlami" target="_blank" rel="noreferrer" className={styles.iconBtn} aria-label="GitHub">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.5.5.09.68-.22.68-.48v-1.7C6.73 19.9 6.14 18 6.14 18c-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.56 9.56 0 0 1 12 6.8c.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10.01 10.01 0 0 0 22 12c0-5.52-4.48-10-10-10z" fill="#E7E900"/></svg>
            </a>
            <button onClick={() => navigate('/admin/login')} className={styles.iconBtn} aria-label="Admin settings">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="3" stroke="#E7E900" strokeWidth="1.5"/><path d="M12 13c-4 0-6 1.8-6 3v1h12v-1c0-1.2-2-3-6-3z" stroke="#E7E900" strokeWidth="1.5" strokeLinejoin="round"/><circle cx="19" cy="19" r="3" fill="#E7E900"/><path d="M19 17.5v1.5l1 1" stroke="#022200" strokeWidth="1" strokeLinecap="round"/></svg>
            </button>
          </div>
        </div>

        <div className={styles.col}>
          <p className={styles.colLabel}>Location</p>
          <span>Pietermaritzburg</span>
          <span>KwaZulu-Natal, ZA</span>
        </div>
      </div>

      <div className={styles.bottom}>
        <span>&copy; {new Date().getFullYear()} Dlozi Lloyd Mthethwa</span>
        <span className={styles.mantra}>The ALL is ALL that is in ALL</span>
      </div>
    </footer>
  )
}