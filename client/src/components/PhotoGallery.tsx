import React, { useEffect, useMemo, useState } from 'react'
import { listPhotos, PhotoMeta } from '../api'

function isVideo(p: PhotoMeta) {
  if (p.kind) return p.kind === 'video'
  return (p.content_type || '').startsWith('video/')
}

export function PhotoGallery() {
  const [photos, setPhotos] = useState<PhotoMeta[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState<Record<string, boolean>>({})
  const anySelected = useMemo(() => Object.values(selected).some(Boolean), [selected])

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const data = await listPhotos()
      setPhotos(data)
    } catch (err) {
      console.error(err)
      setError('Не удалось загрузить галерею.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    const handler = () => load()
    window.addEventListener('photos:uploaded', handler)
    return () => window.removeEventListener('photos:uploaded', handler)
  }, [])

  function toggle(filename: string) {
    setSelected((s) => ({ ...s, [filename]: !s[filename] }))
  }

  async function downloadSelected() {
    const files = Object.entries(selected).filter(([, v]) => v).map(([k]) => k)
    if (files.length === 0) return
    const params = new URLSearchParams()
    files.forEach((f) => params.append('files', f))
    const url = `${location.origin.replace(/\/$/, '')}/photos/download?${params.toString()}`
    const a = document.createElement('a')
    a.href = url
    a.download = 'wedding-photos.zip'
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  if (loading) return <p>Загружаем галерею…</p>
  if (error) return <p className="error">{error}</p>

  return (
    <div className="gallery">
      {anySelected && (
        <div className="toolbar">
          <span className="muted">Выбрано: {Object.values(selected).filter(Boolean).length}</span>
          <button className="refresh" onClick={downloadSelected}>Скачать выбранные (ZIP)</button>
          <button className="btn" onClick={() => setSelected({})}>Снять выделение</button>
        </div>
      )}

      {photos.length === 0 ? (
        <p className="muted">Пока нет загруженных файлов.</p>
      ) : (
        <div className="grid">
          {photos.map((p) => (
            <div key={p.filename} className={`card selectable ${selected[p.filename] ? 'selected' : ''}`} onClick={() => toggle(p.filename)}>
              {isVideo(p) ? (
                <video controls preload="metadata" src={p.url} style={{ width: '100%', height: '180px', objectFit: 'cover', display: 'block' }} />
              ) : (
                <img src={p.url} alt={p.filename} loading="lazy" />
              )}
              <div className="checkmark">✓</div>
            </div>
          ))}
        </div>
      )}
      <button onClick={load} className="refresh">Обновить галерею</button>
    </div>
  )
} 