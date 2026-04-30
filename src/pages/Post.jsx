import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import LinkButton from '../components/ui/LinkButton.jsx'
import styles from './Post.module.css'

export default function Post() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .eq('status', 'published')
      .single()
      .then(({ data }) => {
        setPost(data)
        setLoading(false)
      })
  }, [id])

  if (loading) return <div className={styles.loading}>Loading...</div>
  if (!post) return <div className={styles.loading}>Post not found.</div>

  const backPath = post.type === 'project' ? '/projects' : '/blog'
  const backLabel = post.type === 'project' ? 'Back to projects' : 'Back to writing'

  const typeColors = {
    article: styles.tagArticle,
    project: styles.tagProject,
    resource: styles.tagResource,
  }

  return (
    <main className={styles.wrap}>
      <Link to={backPath} className={styles.back}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M10 4L6 8L10 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        {backLabel}
      </Link>

      {post.main_image_url ? (
        <img src={post.main_image_url} alt={post.title} className={styles.mainImage} />
      ) : (
        <div className={`${styles.mainImagePlaceholder} ${styles[`type_${post.type}`]}`} />
      )}

      <div className={styles.content}>
        <div className={styles.meta}>
          <span className={`${styles.tag} ${typeColors[post.type]}`}>
            {post.type.charAt(0).toUpperCase() + post.type.slice(1)}
          </span>
          <span className={styles.date}>
            {new Date(post.created_at).toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>

        <h1 className={styles.title}>{post.title}</h1>

        {post.intro && <p className={styles.intro}>{post.intro}</p>}

        {post.body && (
          <div className={styles.body}>
            {post.body.split('\n').map((para, i) =>
              para.trim() ? <p key={i}>{para}</p> : null
            )}
          </div>
        )}

        {post.link && (
          <div className={styles.linkWrap}>
            <LinkButton url={post.link} type={post.link_type || 'external'} />
          </div>
        )}

        {post.gallery_images && post.gallery_images.length > 0 && (
          <div className={styles.gallery}>
            {post.gallery_images.map((img, i) => (
              <img key={i} src={img} alt={`${post.title} image ${i + 1}`} className={styles.galleryImg} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}