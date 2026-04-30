import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase.js'
import styles from './AdminForm.module.css'

export default function AdminPosts() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    supabase
      .from('posts')
      .select('id, title, type, status, created_at')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setPosts(data || [])
        setLoading(false)
      })
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id) => {
    if (!confirm('Delete this post?')) return
    await supabase.from('posts').delete().eq('id', id)
    load()
  }

  const toggleStatus = async (post) => {
    const newStatus = post.status === 'published' ? 'draft' : 'published'
    await supabase.from('posts').update({ status: newStatus }).eq('id', post.id)
    load()
  }

  if (loading) return <div className={styles.loading}>Loading...</div>

  return (
    <div className={styles.wrap}>
      <div className={styles.topBar}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Posts</h1>
          <p className={styles.pageSub}>All your articles, projects and resources.</p>
        </div>
        <Link to="/admin/posts/new" className={styles.addBtn}>+ New post</Link>
      </div>

      <div className={styles.card}>
        {posts.length === 0 ? (
          <p className={styles.loading}>No posts yet. Create your first one.</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Status</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {posts.map(post => (
                <tr key={post.id}>
                  <td>{post.title}</td>
                  <td>
                    <span className={`${styles.badge} ${styles[`badge${post.type.charAt(0).toUpperCase() + post.type.slice(1)}`]}`}>
                      {post.type}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => toggleStatus(post)}
                      className={`${styles.badge} ${post.status === 'published' ? styles.badgePublished : styles.badgeDraft}`}
                      style={{ border: 'none', cursor: 'pointer' }}
                    >
                      {post.status}
                    </button>
                  </td>
                  <td>{new Date(post.created_at).toLocaleDateString('en-ZA', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                  <td>
                    <div className={styles.rowActions}>
                      <Link to={`/admin/posts/${post.id}/edit`} className={styles.editLink}>Edit</Link>
                      <button onClick={() => handleDelete(post.id)} className={styles.delLink}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}