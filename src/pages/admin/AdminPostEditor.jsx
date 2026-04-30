import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase.js'
import styles from './AdminForm.module.css'

const empty = {
  title: '',
  intro: '',
  main_image_url: '',
  body: '',
  link: '',
  link_type: 'external',
  gallery_images: [],
  type: 'article',
  status: 'draft',
}

export default function AdminPostEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isNew = !id
  const [form, setForm] = useState(empty)
  const [galleryInput, setGalleryInput] = useState('')
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isNew) {
      supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single()
        .then(({ data }) => {
          if (data) setForm(data)
          setLoading(false)
        })
    }
  }, [id])

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  const addGalleryImage = () => {
    if (!galleryInput.trim()) return
    if (form.gallery_images.length >= 6) return
    setForm(f => ({ ...f, gallery_images: [...f.gallery_images, galleryInput.trim()] }))
    setGalleryInput('')
  }

  const removeGalleryImage = (i) => {
    setForm(f => ({ ...f, gallery_images: f.gallery_images.filter((_, idx) => idx !== i) }))
  }

  const handleSave = async () => {
    if (!form.title.trim()) { setError('Title is required'); return }
    setSaving(true)
    setError('')
    if (isNew) {
      const { error } = await supabase.from('posts').insert([form])
      if (error) { setError(error.message); setSaving(false); return }
    } else {
      const { error } = await supabase.from('posts').update(form).eq('id', id)
      if (error) { setError(error.message); setSaving(false); return }
    }
    setSaving(false)
    navigate('/admin/posts')
  }

  if (loading) return <div className={styles.loading}>Loading...</div>

  return (
    <div className={styles.wrap} style={{ maxWidth: '860px' }}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>{isNew ? 'New post' : 'Edit post'}</h1>
        <p className={styles.pageSub}>Fills in on Blog, Projects or as a Resource depending on type.</p>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.card}>
        <div className={styles.fieldGrid}>

          <div className={`${styles.field} ${styles.fullWidth}`}>
            <label>Title</label>
            <input name="title" value={form.title} onChange={handleChange} placeholder="Post title" />
          </div>

          <div className={`${styles.field} ${styles.fullWidth}`}>
            <label>Intro / summary</label>
            <textarea name="intro" value={form.intro} onChange={handleChange} placeholder="Short description shown on listing pages..." rows={3} />
          </div>

          <div className={`${styles.field} ${styles.fullWidth}`}>
            <label>Main image URL</label>
            <input name="main_image_url" value={form.main_image_url} onChange={handleChange} placeholder="https://... (copy from Multimedia page)" />
          </div>

          {form.main_image_url && (
            <div className={`${styles.field} ${styles.fullWidth}`}>
              <img src={form.main_image_url} alt="preview" style={{ height: '160px', objectFit: 'cover', borderRadius: '8px', width: '100%' }} />
            </div>
          )}

          <div className={`${styles.field} ${styles.fullWidth}`}>
            <label>Body text</label>
            <textarea name="body" value={form.body} onChange={handleChange} placeholder="Write your post content here. Each new line becomes a paragraph." rows={10} />
          </div>

          <div className={styles.field}>
            <label>Link (optional)</label>
            <input name="link" value={form.link} onChange={handleChange} placeholder="https://..." />
          </div>

          <div className={styles.field}>
            <label>Link type</label>
            <select name="link_type" value={form.link_type} onChange={handleChange}>
              <option value="external">External — Visit site</option>
              <option value="github">GitHub — View on GitHub</option>
              <option value="file">File — Download file</option>
            </select>
          </div>

          <div className={styles.field}>
            <label>Type</label>
            <select name="type" value={form.type} onChange={handleChange}>
              <option value="article">Article</option>
              <option value="project">Project</option>
              <option value="resource">Resource</option>
            </select>
          </div>

          <div className={styles.field}>
            <label>Status</label>
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          <div className={`${styles.field} ${styles.fullWidth}`}>
            <label>Gallery images (max 6) — paste URLs from Multimedia page</label>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
              <input
                value={galleryInput}
                onChange={e => setGalleryInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addGalleryImage()}
                placeholder="Paste image URL and press Enter"
                style={{ flex: 1, padding: '9px 12px', border: '0.5px solid #ddd', borderRadius: '6px', fontSize: '14px' }}
                disabled={form.gallery_images.length >= 6}
              />
              <button
                onClick={addGalleryImage}
                className={styles.addBtn}
                disabled={form.gallery_images.length >= 6}
              >
                Add
              </button>
            </div>
            {form.gallery_images.length === 0 && (
              <p style={{ fontSize: '13px', color: '#aaa' }}>No gallery images yet.</p>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {form.gallery_images.map((img, i) => (
                <div key={i} style={{ position: 'relative' }}>
                  <img src={img} alt={`gallery ${i + 1}`} style={{ width: '100%', aspectRatio: '16/10', objectFit: 'cover', borderRadius: '6px' }} />
                  <button
                    onClick={() => removeGalleryImage(i)}
                    style={{
                      position: 'absolute', top: '4px', right: '4px',
                      background: 'rgba(0,0,0,0.6)', color: '#fff',
                      border: 'none', borderRadius: '50%',
                      width: '20px', height: '20px',
                      fontSize: '12px', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                  >×</button>
                </div>
              ))}
            </div>
          </div>

        </div>

        <div className={styles.actions}>
          <button onClick={handleSave} disabled={saving} className={styles.saveBtn}>
            {saving ? 'Saving...' : isNew ? 'Create post' : 'Save changes'}
          </button>
          <button onClick={() => navigate('/admin/posts')} className={styles.deleteBtn}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
