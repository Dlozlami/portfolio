import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase.js'
import styles from './AdminForm.module.css'

const LABELS = {
  frontend: 'Frontend',
  backend: 'Backend & Data',
  design: 'Design & Tools',
}

export default function AdminSkills({ category }) {
  const [tags, setTags] = useState([])
  const [input, setInput] = useState('')
  const [id, setId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setLoading(true)
    setSaved(false)
    supabase
      .from('skills')
      .select('*')
      .eq('category', category)
      .single()
      .then(({ data }) => {
        if (data) {
          setTags(data.tags || [])
          setId(data.id)
        }
        setLoading(false)
      })
  }, [category])

  const addTag = () => {
    if (!input.trim()) return
    setTags(t => [...t, input.trim()])
    setInput('')
    setSaved(false)
  }

  const removeTag = (i) => {
    setTags(t => t.filter((_, idx) => idx !== i))
    setSaved(false)
  }

  const handleSave = async () => {
    setSaving(true)
    await supabase
      .from('skills')
      .update({ tags })
      .eq('id', id)
    setSaving(false)
    setSaved(true)
  }

  if (loading) return <div className={styles.loading}>Loading...</div>

  return (
    <div className={styles.wrap}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>{LABELS[category]}</h1>
        <p className={styles.pageSub}>Manage skill tags shown in the Skills section of your CV.</p>
      </div>

      <div className={styles.card}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '1.25rem' }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addTag()}
            placeholder="Type a skill and press Enter"
            style={{ flex: 1, padding: '9px 12px', border: '0.5px solid #ddd', borderRadius: '6px', fontSize: '14px' }}
          />
          <button onClick={addTag} className={styles.addBtn}>Add</button>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', minHeight: '48px' }}>
          {tags.length === 0 && (
            <p style={{ fontSize: '13px', color: '#aaa' }}>No skills yet. Add your first one above.</p>
          )}
          {tags.map((tag, i) => (
            <div key={i} style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              background: '#f0f0f0', borderRadius: '99px',
              padding: '4px 12px', fontSize: '13px', color: '#333'
            }}>
              {tag}
              <button
                onClick={() => removeTag(i)}
                style={{ background: 'none', border: 'none', color: '#aaa', cursor: 'pointer', fontSize: '14px', lineHeight: 1, padding: 0 }}
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <div className={styles.actions}>
          <button onClick={handleSave} disabled={saving} className={styles.saveBtn}>
            {saving ? 'Saving...' : saved ? 'Saved ✓' : 'Save changes'}
          </button>
        </div>
      </div>
    </div>
  )
}