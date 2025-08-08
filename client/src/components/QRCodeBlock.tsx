import React, { useEffect, useRef } from 'react'
import QRCode from 'qrcode'

export function QRCodeBlock({ url, title }: { url: string; title?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    QRCode.toCanvas(canvas, url, {
      width: 220,
      margin: 2,
      color: { dark: '#3a2c2c', light: '#ffffff' },
    })
  }, [url])

  return (
    <div className="qr-block">
      {title && <h3>{title}</h3>}
      <canvas ref={canvasRef} />
      <a href={url} target="_blank" rel="noreferrer" className="btn btn-primary" style={{ marginTop: 12 }}>Перейти в Telegram</a>
    </div>
  )
} 