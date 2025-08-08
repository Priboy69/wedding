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
  const [selectionMode, setSelectionMode] = useState(false)
  const selectedCount = useMemo(() => Object.values(selected).filter(Boolean).length, [selected])

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
    setSelected((s: Record<string, boolean>) => ({ ...s, [filename]: !s[filename] }))
  }

  function handlePrimaryAction() {
    if (!selectionMode) {
      setSelectionMode(true)
      return
    }
    downloadSelected()
  }

  async function downloadSelected() {
    const files = Object.entries(selected).filter(([, v]) => v).map(([k]) => k)
    if (files.length === 0) return
    for (const name of files) {
      const item = photos.find((p: PhotoMeta) => p.filename === name)
      if (!item) continue
      try {
        const res = await fetch(item.url, { mode: 'cors' })
        if (!res.ok) throw new Error('download failed')
        const blob = await res.blob()
        const objectUrl = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = objectUrl
        a.download = item.filename
        document.body.appendChild(a)
        a.click()
        a.remove()
        // give the browser a moment before revoking
        setTimeout(() => URL.revokeObjectURL(objectUrl), 2000)
      } catch (e) {
        console.error('Failed to download', item.filename, e)
        // fallback: open in new tab
        window.open(item.url, '_blank')
      }
    }
  }

  if (loading) return <p>Загружаем галерею…</p>
  if (error) return <p className="error">{error}</p>

  return (
    <div className="gallery">
      <div className="toolbar" style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
        <button className="refresh" onClick={handlePrimaryAction}>
          {selectionMode ? (selectedCount > 0 ? 'Скачать выбранные' : 'Выберите файлы') : 'Скачать выбранные'}
        </button>
        {selectionMode && (
          <>
            <button className="btn" onClick={() => setSelected({})}>Снять выделение</button>
            <button className="btn" onClick={() => { setSelectionMode(false); setSelected({}) }}>Готово</button>
            <span className="muted">Выбрано: {selectedCount}</span>
          </>
        )}
        <button onClick={load} className="btn">Обновить</button>
      </div>

      {photos.length === 0 ? (
        <p className="muted">Пока нет загруженных файлов.</p>
      ) : (
        <div className="grid">
          {photos.map((p) => (
            <div key={p.filename} className={`card selectable ${selectionMode && selected[p.filename] ? 'selected' : ''}`}>
              {selectionMode ? (
                <>
                  {isVideo(p) ? (
                    <video controls preload="metadata" src={p.url} style={{ width: '100%', height: '180px', objectFit: 'cover', display: 'block' }} />
                  ) : (
                    <img src={p.url} alt={p.filename} loading="lazy" />
                  )}
                  <label className="selector">
                    <input
                      type="checkbox"
                      checked={!!selected[p.filename]}
                      onChange={() => toggle(p.filename)}
                    />
                    <span>Выбрать</span>
                  </label>
                </>
              ) : (
                <a href={p.url} target="_blank" rel="noreferrer">
                  {isVideo(p) ? (
                    <video controls preload="metadata" src={p.url} style={{ width: '100%', height: '180px', objectFit: 'cover', display: 'block' }} />
                  ) : (
                    <img src={p.url} alt={p.filename} loading="lazy" />
                  )}
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 