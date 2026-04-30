import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase.js'
import styles from './AdminForm.module.css'

const empty = {
  org: '', role: '', location: '',
  start_date: '', end_date: '', is_current: false,
  bullets: [], sort_order: 0,
}

export default function AdminWorkHistory() {
  const [jobs, setJobs] = useState([])
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(empty)
  const [bulletInput, setBulletInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const load = () => {
    supabase
      .from('work_history')
      .select('*')
      .order('sort_order')
      .then(({ data }) => {
        setJobs(data || [])
        setLoading(false)
      })
  }

  useEffect(() => { load() }, [])

  const openNew = () => {
    setForm(empty)
    setEditing('new')
    setBulletInput('')
  }

  const openEdit = (job) => {
    setForm(job)
    setEditing(job.id)
    setBulletInput('')
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  const addBullet = () => {
    if (!bulletInput.trim()) return
    setForm(f => ({ ...f, bullets: [...f.bullets, bulletInput.trim()] }))
    setBulletInput('')
  }

  const removeBullet = (i) => {
    setForm(f => ({ ...f, bullets: f.bullets.filter((_, idx) => idx !== i) }))
  }

  const handleSave = async () => {
    setSaving(true)
    if (editing === 'new') {
      await supabase.from('work_history').insert([form])
    } else {
      await supabase.from('work_history').update(form).eq('id', editing)
    }
    setSaving(false)
    setEditing(null)
    load()
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this job?')) return
    await supabase.from('work_history').delete().eq('id', id)
    load()
  }

  if (loading) return <div className={styles.loading}>Loading...</div>

  return (
    <div className={styles.wrap}>
      <div className={styles.topBar}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Work History</h1>
          <p className={styles.pageSub}>Your experience shown on the CV page.</p>
        </div>
        <button onClick={openNew} className={styles.addBtn}>+ Add job</button>
      </div>

      {editing && (
        <div className={styles.card} style={{ marginBottom: '1.5rem' }}>
          <div className={styles.fieldGrid}>
            <div className={styles.field}>
              <label>Organisation</label>
              <input name="org" value={form.org} onChange={handleChange} placeholder="mLab Southern Africa" />
            </div>
            <div className={styles.field}>
              <label>Role</label>
              <input name="role" value={form.role} onChange={handleChange} placeholder="Provincial Lead" />
            </div>
            <div className={styles.field}>
              <label>Location</label>
              <input name="location" value={form.location} onChange={handleChange} placeholder="Pietermaritzburg, KZN" />
            </div>
            <div className={styles.field}>
              <label>Sort order</label>
              <input name="sort_order" type="number" value={form.sort_order} onChange={handleChange} />
            </div>
            <div className={styles.field}>
              <label>Start date</label>
              <input name="start_date" value={form.start_date} onChange={handleChange} placeholder="Apr 2026" />
            </div>
            <div className={styles.field}>
              <label>End date</label>
              <input name="end_date" value={form.end_date} onChange={handleChange} placeholder="Dec 2027" disabled={form.is_current} />
            </div>
            <div className={styles.field}>
              <label style={{ flexDirection: 'row', alignItems: 'center', gap: '8px' }}>
                <input name="is_current" type="checkbox" checked={form.is_current} onChange={handleChange} />
                Current role
              </label>
            </div>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <label className={styles.field} style={{ marginBottom: '6px' }}>
              <span style={{ fontSize: '12px', color: '#888', fontWeight: 500 }}>Bullets</span>
            </label>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <input
                value={bulletInput}
                onChange={e => setBulletInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addBullet()}
                placeholder="Type a bullet point and press Enter"
                style={{ flex: 1, padding: '8px 12px', border: '0.5px solid #ddd', borderRadius: '6px', fontSize: '13px' }}
              />
              <button onClick={addBullet} className={styles.addBtn}>Add</button>
            </div>
            {form.bullets.map((b, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '6px' }}>
                <span style={{ fontSize: '13px', color: '#444', flex: 1, lineHeight: 1.5 }}>– {b}</span>
                <button onClick={() => removeBullet(i)} className={styles.delLink}>Remove</button>
              </div>
            ))}
          </div>

          <div className={styles.actions}>
            <button onClick={handleSave} disabled={saving} className={styles.saveBtn}>
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button onClick={() => setEditing(null)} className={styles.deleteBtn}>Cancel</button>
          </div>
        </div>
      )}

      <div className={styles.card}>
        {jobs.length === 0 ? (
          <p className={styles.loading}>No jobs yet. Add your first one.</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Role</th>
                <th>Organisation</th>
                <th>Dates</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {jobs.map(job => (
                <tr key={job.id}>
                  <td>{job.role}</td>
                  <td>{job.org}</td>
                  <td>{job.start_date} – {job.is_current ? 'Present' : job.end_date}</td>
                  <td>
                    <div className={styles.rowActions}>
                      <button onClick={() => openEdit(job)} className={styles.editLink}>Edit</button>
                      <button onClick={() => handleDelete(job.id)} className={styles.delLink}>Delete</button>
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