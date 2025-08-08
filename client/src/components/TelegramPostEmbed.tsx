import React, { useEffect, useRef } from 'react'

function parsePostUrl(postUrl: string): { username: string; postId: string } | null {
  try {
    const url = new URL(postUrl)
    if (url.hostname !== 't.me') return null
    const parts = url.pathname.split('/').filter(Boolean)
    // t.me/username/123 or t.me/s/username/123
    if (parts.length === 2) {
      const [username, postId] = parts
      return { username, postId }
    }
    if (parts.length === 3 && parts[0] === 's') {
      const [, username, postId] = parts
      return { username, postId }
    }
    return null
  } catch {
    return null
  }
}

export function TelegramPostEmbed({ postUrl, width = '100%' }: { postUrl: string; width?: string }) {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const parsed = parsePostUrl(postUrl)
    const el = ref.current
    if (!el || !parsed) return
    el.innerHTML = ''
    const script = document.createElement('script')
    script.async = true
    script.src = 'https://telegram.org/js/telegram-widget.js?22'
    script.setAttribute('data-telegram-post', `${parsed.username}/${parsed.postId}`)
    script.setAttribute('data-width', width)
    el.appendChild(script)
    return () => { el.innerHTML = '' }
  }, [postUrl, width])

  return <div ref={ref} />
} 