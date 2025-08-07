import React, { useRef, useState } from 'react'
import { uploadPhotos } from '../api'

export function PhotoUploader() {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  async function handleSelectFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    setMessage(null)
    try {
      await uploadPhotos(Array.from(files))
      setMessage('Файлы загружены! Если не появились автоматически, обновите галерею ниже.')
      if (inputRef.current) inputRef.current.value = ''
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
      <input
        ref={inputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        capture
        onChange={handleSelectFiles}
        disabled={isUploading}
      />
      {isUploading && <p>Загружаем...</p>}
      <p className="muted">Поддерживаются фото и видео. Рекомендуем Wi‑Fi для длинных роликов.</p>
      {message && <p className="muted">{message}</p>}
    </div>
  )
} 