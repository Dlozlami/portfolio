import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import styles from './PostList.module.css'

export default function PostList({ defaultFilter }) {
  const [posts, setPosts] = useState([])
  const [filter, setFilter] = useState(defaultFilter || 'all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setFilter(defaultFilter || 'all')
  }, [defaultFilter])

  useEffect(() => {
    setLoading(true)
    let query = supabase
      .from('posts')
      .select('id, title, intro, type, created_at')
      .eq('status', 'published')
      .order('created_at', { ascending: false })

    if (filter !== 'all') {
      query = query.eq('type', filter)
    }

    query.then(({ data }) => {
      setPosts(data || [])
      setLoading(false)
    })
  }, [filter])

  const typeColors = {
    article: styles.tagArticle,
    project: styles.tagProject,
    resource: styles.tagResource,
  }

  return (
    <main className={styles.wrap}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          {defaultFilter === 'article' ? 'Writing' : defaultFilter === 'project' ? 'Projects' : 'All posts'}
        </h1>
        <p className={styles.sub}>
          {defaultFilter === 'article'
            ? 'Thoughts on tech, ecosystems, and building in Africa.'
            : defaultFilter === 'project'
            ? 'Things I have built — code, tools, and digital solutions.'
            : 'Everything.'}
        </p>
      </div>

      <div className={styles.filters}>
        {['all', 'article', 'project'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`${styles.filterBtn} ${filter === f ? styles.filterOn : ''}`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className={styles.loading}>Loading...</div>
      ) : posts.length === 0 ? (
        <div className={styles.empty}>Nothing here yet.</div>
      ) : (
        <div className={styles.grid}>
          {posts.map(post => (
            <Link
              key={post.id}
              to={post.type === 'project' ? `/projects/${post.id}` : `/blog/${post.id}`}
              className={styles.card}
            >
              <div className={`${styles.thumb} ${styles[`type_${post.type}`]}`}>
                <span className={`${styles.tag} ${typeColors[post.type]}`}>
                  {post.type.charAt(0).toUpperCase() + post.type.slice(1)}
                </span>
              </div>
              <div className={styles.body}>
                <h2>{post.title}</h2>
                {post.intro && <p>{post.intro}</p>}
                <span className={styles.date}>
                  {new Date(post.created_at).toLocaleDateString('en-ZA', { year: 'numeric', month: 'short', day: 'numeric' })}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}