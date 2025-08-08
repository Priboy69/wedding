import React, { useEffect, useRef } from 'react'

export function TelegramJoinButton({ username, size = 'large' }: { username: string; size?: 'small' | 'large' }) {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.innerHTML = ''
    const script = document.createElement('script')
    script.async = true
    script.src = 'https://telegram.org/js/telegram-widget.js?22'
    script.setAttribute('data-telegram-login', username)
    script.setAttribute('data-size', size)
    script.setAttribute('data-request-access', 'write')
    el.appendChild(script)
    return () => { el.innerHTML = '' }
  }, [username, size])

  return <div ref={ref} />
} 