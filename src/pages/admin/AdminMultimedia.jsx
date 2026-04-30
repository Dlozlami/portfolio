import React, { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase.js'
import styles from './AdminForm.module.css'
import mStyles from './AdminMultimedia.module.css'

export default function AdminMultimedia() {
  const [files, setFiles] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [bucket, setBucket] = useState('resources')
  const [selectedFile, setSelectedFile] = useState(null)
  const [expanded, setExpanded] = useState(null)
  const [latestCv, setLatestCv] = useState(null)
  const [copied, setCopied] = useState(null)

  const load = async () => {
    setLoading(true)
    const [res, cv] = await Promise.all([
      supabase.storage.from('resources').list('', { sortBy: { column: 'created_at', order: 'desc' } }),
      supabase.storage.from('cv').list('', { sortBy: { column: 'created_at', order: 'desc' } }),
    ])
    const resFiles = (res.data || []).map(f => ({ ...f, bucket: 'resources' }))
    const cvFiles = (cv.data || []).map(f => ({ ...f, bucket: 'cv' }))
    if (cvFiles.length > 0) {
      const { data } = supabase.storage.from('cv').getPublicUrl(cvFiles[0].name)
      setLatestCv({ ...cvFiles[0], url: data.publicUrl })
    }
    setFiles([...cvFiles, ...resFiles])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const getUrl = (file) => {
    const { data } = supabase.storage.from(file.bucket).getPublicUrl(file.name)
    return data.publicUrl
  }

  const handleUpload = async () => {
    if (!selectedFile) return
    setUploading(true)
    const ext = selectedFile.name.split('.').pop()
    const filename = `${Date.now()}.${ext}`
    const { error } = await supabase.storage
      .from(bucket)
      .upload(filename, selectedFile, { upsert: true })
    if (error) {
      alert(`Upload failed: ${error.message}`)
    }
    setUploading(false)
    setShowModal(false)
    setSelectedFile(null)
    load()
  }

  const handleDelete = async (file) => {
    if (!confirm(`Delete ${file.name}?`)) return
    await supabase.storage.from(file.bucket).remove([file.name])
    load()
  }

  const copyUrl = (file) => {
    const url = getUrl(file)
    navigator.clipboard.writeText(url)
    setCopied(file.name)
    setTimeout(() => setCopied(null), 2000)
  }

  const filtered = files.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase())
  )

  const formatSize = (bytes) => {
    if (!bytes) return '—'
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Multimedia</h1>
        <p className={styles.pageSub}>Upload and manage your CV and resource files. Copy URLs to use in posts.</p>
      </div>

      {latestCv && (
        <div className={mStyles.cvBanner}>
          <div>
            <p className={mStyles.cvBannerLabel}>Latest CV</p>
            <p className={mStyles.cvBannerName}>{latestCv.name}</p>
          </div>
          <a href={latestCv.url} download className={mStyles.cvDownloadBtn}>
            Download
          </a>
        </div>
      )}

      <div className={styles.topBar} style={{ marginTop: '1.5rem' }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search files..."
          className={mStyles.searchInput}
        />
        <button onClick={() => setShowModal(true)} className={styles.addBtn}>
          + Upload file
        </button>
      </div>

      {showModal && (
        <div className={mStyles.modalOverlay}>
          <div className={mStyles.modal}>
            <h3 className={mStyles.modalTitle}>Upload file</h3>
            <div className={styles.field} style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '12px', color: '#888', marginBottom: '4px', display: 'block' }}>Bucket</label>
              <select
                value={bucket}
                onChange={e => setBucket(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', border: '0.5px solid #ddd', borderRadius: '6px', fontSize: '14px' }}
              >
                <option value="resources">Resources</option>
                <option value="cv">CV</option>
              </select>
            </div>
            <div className={styles.field} style={{ marginBottom: '1.5rem' }}>
              <label style={{ fontSize: '12px', color: '#888', marginBottom: '4px', display: 'block' }}>File</label>
              <input
                type="file"
                onChange={e => setSelectedFile(e.target.files[0])}
                style={{ fontSize: '13px' }}
              />
            </div>
            <div className={styles.actions} style={{ marginTop: 0, paddingTop: 0, border: 'none' }}>
              <button onClick={handleUpload} disabled={uploading || !selectedFile} className={styles.saveBtn}>
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
              <button onClick={() => { setShowModal(false); setSelectedFile(null) }} className={styles.deleteBtn}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={styles.card} style={{ marginTop: '0' }}>
        {loading ? (
          <p className={styles.loading}>Loading files...</p>
        ) : filtered.length === 0 ? (
          <p className={styles.loading}>No files found.</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Bucket</th>
                <th>Size</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(file => (
                <React.Fragment key={file.name}>
                  <tr
                    onClick={() => setExpanded(expanded === file.name ? null : file.name)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td>{file.name}</td>
                    <td>
                      <span className={`${styles.badge} ${file.bucket === 'cv' ? styles.badgeProject : styles.badgeArticle}`}>
                        {file.bucket}
                      </span>
                    </td>
                    <td>{formatSize(file.metadata?.size)}</td>
                    <td>
                      <div className={styles.rowActions}>
                        <button
                          onClick={e => { e.stopPropagation(); copyUrl(file) }}
                          className={styles.editLink}
                        >
                          {copied === file.name ? 'Copied ✓' : 'Copy URL'}
                        </button>
                        <button
                          onClick={e => { e.stopPropagation(); handleDelete(file) }}
                          className={styles.delLink}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expanded === file.name && (
                    <tr>
                      <td colSpan={4} style={{ background: '#fafafa', padding: '1rem 1.5rem' }}>
                        <p style={{ fontSize: '11px', color: '#888', marginBottom: '6px', fontWeight: 500 }}>PUBLIC URL</p>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <code style={{ fontSize: '12px', color: '#333', background: '#f0f0f0', padding: '6px 10px', borderRadius: '4px', flex: 1, wordBreak: 'break-all' }}>
                            {getUrl(file)}
                          </code>
                          <button onClick={() => copyUrl(file)} className={styles.addBtn} style={{ whiteSpace: 'nowrap' }}>
                            {copied === file.name ? 'Copied ✓' : 'Copy'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}