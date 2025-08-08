import React, { useEffect, useRef } from 'react'

export function TelegramShareButton({ url, size = 'large', text }: { url: string; size?: 'small' | 'large'; text?: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    container.innerHTML = ''
    const script = document.createElement('script')
    script.async = true
    script.src = 'https://telegram.org/js/telegram-widget.js?22'
    script.setAttribute('data-telegram-share-url', url)
    script.setAttribute('data-size', size)
    if (text) script.setAttribute('data-comment', text)
    container.appendChild(script)
    return () => {
      container.innerHTML = ''
    }
  }, [url, size, text])

  return <div ref={containerRef} />
} 