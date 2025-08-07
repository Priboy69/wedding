export type PhotoMeta = {
  filename: string
  url: string
  size: number
  uploaded_at: string
  content_type?: string
  kind?: 'image' | 'video' | 'file'
}

function getApiBaseUrl() {
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
}

export async function listPhotos(): Promise<PhotoMeta[]> {
  const res = await fetch(`${getApiBaseUrl()}/photos`)
  if (!res.ok) throw new Error('Failed to fetch photos')
  return await res.json()
}

export async function uploadPhotos(files: File[]): Promise<PhotoMeta[]> {
  const form = new FormData()
  files.forEach((file) => form.append('files', file))
  const res = await fetch(`${getApiBaseUrl()}/photos`, {
    method: 'POST',
    body: form,
  })
  if (!res.ok) throw new Error('Failed to upload')
  return await res.json()
} 