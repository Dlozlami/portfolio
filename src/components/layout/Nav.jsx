import { NavLink } from 'react-router-dom'
import styles from './Nav.module.css'

export default function Nav() {
  return (
    <nav className={styles.nav}>
      <NavLink to="/" className={styles.logo}>DLM</NavLink>
      <div className={styles.links}>
        <NavLink to="/" end className={({ isActive }) => isActive ? styles.active : ''}>Home</NavLink>
        <NavLink to="/blog" className={({ isActive }) => isActive ? styles.active : ''}>Blog</NavLink>
        <NavLink to="/projects" className={({ isActive }) => isActive ? styles.active : ''}>Projects</NavLink>
        <NavLink to="/cv" className={({ isActive }) => isActive ? styles.active : ''}>CV</NavLink>
      </div>
    </nav>
  )
}