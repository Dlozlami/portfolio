import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase.js'
import styles from './AdminLayout.module.css'

const navItems = [
  { to: '/admin/profile', label: 'Profile' },
  { to: '/admin/work-history', label: 'Work History' },
  { to: '/admin/skills/frontend', label: 'Frontend' },
  { to: '/admin/skills/backend', label: 'Backend & Data' },
  { to: '/admin/skills/design', label: 'Design & Tools' },
  { to: '/admin/certifications', label: 'Certifications' },
  { to: '/admin/multimedia', label: 'Multimedia' },
  { to: '/admin/posts', label: 'Posts' },
]

export default function AdminLayout() {
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    navigate('/admin/login')
  }

  return (
    <div className={styles.wrap}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTop}>
          <p className={styles.sidebarLabel}>Admin</p>
          <nav className={styles.nav}>
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `${styles.navItem} ${isActive ? styles.navActive : ''}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
        <button onClick={handleSignOut} className={styles.signOut}>
          Sign out
        </button>
      </aside>

      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  )
}