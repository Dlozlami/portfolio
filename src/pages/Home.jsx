import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import styles from './Home.module.css'

export default function Home() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('posts')
      .select('id, title, intro, type, created_at')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(3)
      .then(({ data }) => {
        setPosts(data || [])
        setLoading(false)
      })
  }, [])

  const typeColors = {
    article: styles.tagArticle,
    project: styles.tagProject,
    resource: styles.tagResource,
  }

  return (
    <main>
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>Ecosystem Architect.<br />Digital Builder.</h1>
        <p className={styles.heroSub}>Provincial Lead at mLab Southern Africa. I build tech solutions and design experiences that move communities forward.</p>
        <div className={styles.heroCtas}>
          <Link to="/projects" className={styles.ctaPrimary}>View my work</Link>
          <Link to="/cv" className={styles.ctaGhost}>Download CV</Link>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Latest writing</h2>
          <Link to="/blog" className={styles.seeAll}>See all posts</Link>
        </div>

        {loading ? (
          <div className={styles.loading}>Loading...</div>
        ) : posts.length === 0 ? (
          <div className={styles.empty}>No posts yet.</div>
        ) : (
          <div className={styles.blogGrid}>
            {posts.map((post, i) => (
              <Link
                key={post.id}
                to={post.type === 'project' ? `/projects/${post.id}` : `/blog/${post.id}`}
                className={styles.blogCard}
              >
                <div className={`${styles.blogThumb} ${styles[`thumb${i}`]}`}>
                  <span className={`${styles.tag} ${typeColors[post.type]}`}>
                    {post.type.charAt(0).toUpperCase() + post.type.slice(1)}
                  </span>
                </div>
                <div className={styles.blogInfo}>
                  <h3>{post.title}</h3>
                  <p>{new Date(post.created_at).toLocaleDateString('en-ZA', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}