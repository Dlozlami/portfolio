import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase.js'
import styles from './AdminForm.module.css'

export default function AdminProfile() {
  const [form, setForm] = useState({
    name: '',
    title: '',
    statement: '',
    email: '',
    phone: '',
    location: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    supabase
      .from('profile')
      .select('*')
      .single()
      .then(({ data }) => {
        if (data) setForm(data)
        setLoading(false)
      })
  }, [])

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setSaved(false)
  }

  const handleSave = async () => {
    setSaving(true)
    await supabase
      .from('profile')
      .update({
        name: form.name,
        title: form.title,
        statement: form.statement,
        email: form.email,
        phone: form.phone,
        location: form.location,
        updated_at: new Date().toISOString(),
      })
      .eq('id', form.id)
    setSaving(false)
    setSaved(true)
  }

  if (loading) return <div className={styles.loading}>Loading...</div>

  return (
    <div className={styles.wrap}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Profile</h1>
        <p className={styles.pageSub}>This populates your CV page and footer contact details.</p>
      </div>

      <div className={styles.card}>
        <div className={styles.fieldGrid}>
          <div className={styles.field}>
            <label>Full name</label>
            <input name="name" value={form.name} onChange={handleChange} placeholder="Dlozi Lloyd Mthethwa" />
          </div>
          <div className={styles.field}>
            <label>Title / subtitle</label>
            <input name="title" value={form.title} onChange={handleChange} placeholder="Ecosystem Architect · Software Developer" />
          </div>
          <div className={styles.field}>
            <label>Email</label>
            <input name="email" value={form.email} onChange={handleChange} placeholder="you@email.com" />
          </div>
          <div className={styles.field}>
            <label>Phone</label>
            <input name="phone" value={form.phone} onChange={handleChange} placeholder="076 350 9451" />
          </div>
          <div className={`${styles.field} ${styles.fullWidth}`}>
            <label>Location</label>
            <input name="location" value={form.location} onChange={handleChange} placeholder="Pietermaritzburg, KwaZulu-Natal, ZA" />
          </div>
          <div className={`${styles.field} ${styles.fullWidth}`}>
            <label>Profile statement</label>
            <textarea
              name="statement"
              value={form.statement}
              onChange={handleChange}
              placeholder="A short paragraph about who you are and what you do..."
              rows={5}
            />
          </div>
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