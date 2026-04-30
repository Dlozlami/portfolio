import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase.js'
import styles from './AdminForm.module.css'

const empty = { name: '', issuer: '', year: '', sort_order: 0 }

export default function AdminCertifications() {
  const [certs, setCerts] = useState([])
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(empty)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const load = () => {
    supabase
      .from('certifications')
      .select('*')
      .order('sort_order')
      .then(({ data }) => {
        setCerts(data || [])
        setLoading(false)
      })
  }

  useEffect(() => { load() }, [])

  const openNew = () => { setForm(empty); setEditing('new') }
  const openEdit = (cert) => { setForm(cert); setEditing(cert.id) }

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSave = async () => {
    setSaving(true)
    if (editing === 'new') {
      await supabase.from('certifications').insert([form])
    } else {
      await supabase.from('certifications').update(form).eq('id', editing)
    }
    setSaving(false)
    setEditing(null)
    load()
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this certification?')) return
    await supabase.from('certifications').delete().eq('id', id)
    load()
  }

  if (loading) return <div className={styles.loading}>Loading...</div>

  return (
    <div className={styles.wrap}>
      <div className={styles.topBar}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Certifications</h1>
          <p className={styles.pageSub}>Shown in the Certifications section of your CV.</p>
        </div>
        <button onClick={openNew} className={styles.addBtn}>+ Add certification</button>
      </div>

      {editing && (
        <div className={styles.card} style={{ marginBottom: '1.5rem' }}>
          <div className={styles.fieldGrid}>
            <div className={`${styles.field} ${styles.fullWidth}`}>
              <label>Certification name</label>
              <input name="name" value={form.name} onChange={handleChange} placeholder="Google Cloud Platform" />
            </div>
            <div className={styles.field}>
              <label>Issuer</label>
              <input name="issuer" value={form.issuer} onChange={handleChange} placeholder="Google Africa Developer Training Program" />
            </div>
            <div className={styles.field}>
              <label>Year</label>
              <input name="year" value={form.year} onChange={handleChange} placeholder="2023" />
            </div>
            <div className={styles.field}>
              <label>Sort order</label>
              <input name="sort_order" type="number" value={form.sort_order} onChange={handleChange} />
            </div>
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
        {certs.length === 0 ? (
          <p className={styles.loading}>No certifications yet.</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Issuer</th>
                <th>Year</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {certs.map(cert => (
                <tr key={cert.id}>
                  <td>{cert.name}</td>
                  <td>{cert.issuer}</td>
                  <td>{cert.year}</td>
                  <td>
                    <div className={styles.rowActions}>
                      <button onClick={() => openEdit(cert)} className={styles.editLink}>Edit</button>
                      <button onClick={() => handleDelete(cert.id)} className={styles.delLink}>Delete</button>
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