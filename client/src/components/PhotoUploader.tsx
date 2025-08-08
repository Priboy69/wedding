import React, { useRef, useState } from 'react'
import { uploadPhotos } from '../api'

export function PhotoUploader() {
  const captureRef = useRef<HTMLInputElement | null>(null)
  const pickerRef = useRef<HTMLInputElement | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    setIsUploading(true)
    setMessage(null)
    try {
      await uploadPhotos(Array.from(files))
      setMessage('Файлы загружены! Если не появились автоматически, обновите галерею ниже.')
      if (captureRef.current) captureRef.current.value = ''
      if (pickerRef.current) pickerRef.current.value = ''
      window.dispatchEvent(new CustomEvent('photos:uploaded'))
    } catch (err) {
      console.error(err)
      setMessage('Не удалось загрузить. Попробуйте ещё раз.')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="uploader">
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button className="btn btn-primary" onClick={() => captureRef.current?.click()} disabled={isUploading}>Снять</button>
        <button className="btn" onClick={() => pickerRef.current?.click()} disabled={isUploading}>Выбрать из галереи</button>
      </div>

      {/* Hidden inputs */}
      <input
        ref={captureRef}
        type="file"
        accept="image/*,video/*"
        capture
        multiple
        onChange={(e) => handleFiles(e.target.files)}
        style={{ display: 'none' }}
      />
      <input
        ref={pickerRef}
        type="file"
        accept="image/*,video/*"
        multiple
        onChange={(e) => handleFiles(e.target.files)}
        style={{ display: 'none' }}
      />

      {isUploading && <p>Загружаем...</p>}
      <p className="muted">Поддерживаются фото и видео. Рекомендуем Wi‑Fi для длинных роликов.</p>
      {message && <p className="muted">{message}</p>}
    </div>
  )
} 