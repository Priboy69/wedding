import React, { useEffect, useState } from 'react'
import { listPhotos, PhotoMeta } from '../api'

function isVideo(p: PhotoMeta) {
  if (p.kind) return p.kind === 'video'
  return (p.content_type || '').startsWith('video/')
}

export function PhotoGallery() {
  const [photos, setPhotos] = useState<PhotoMeta[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  if (loading) return <p>Загружаем галерею…</p>
  if (error) return <p className="error">{error}</p>

  return (
    <div className="gallery">
      {photos.length === 0 ? (
        <p className="muted">Пока нет загруженных файлов.</p>
      ) : (
        <div className="grid">
          {photos.map((p) => (
            <a key={p.filename} href={p.url} target="_blank" rel="noreferrer" className="card">
              {isVideo(p) ? (
                <video controls preload="metadata" src={p.url} style={{ width: '100%', height: '180px', objectFit: 'cover', display: 'block' }} />
              ) : (
                <img src={p.url} alt={p.filename} loading="lazy" />
              )}
            </a>
          ))}
        </div>
      )}
      <button onClick={load} className="refresh">Обновить галерею</button>
    </div>
  )
} 