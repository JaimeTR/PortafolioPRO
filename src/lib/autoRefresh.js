/**
 * Auto-refresh del token de acceso.
 * Si /api/auth/me falla con 401, intenta refrescar el token.
 * Si el refresh también falla, redirige al login.
 */

let refreshPromise = null

export async function fetchWithAuth(url, options = {}) {
  const res = await fetch(url, options)

  if (res.status === 401) {
    // Intentar refrescar token (solo una vez para evitar loops)
    if (!refreshPromise) {
      refreshPromise = fetch('/api/auth/refresh', { method: 'POST' })
        .then(r => { refreshPromise = null; return r.ok })
        .catch(() => { refreshPromise = null; return false })
    }

    const refreshed = await refreshPromise

    if (refreshed) {
      return fetch(url, options)
    }

    // Refresh falló, redirigir al login
    if (typeof window !== 'undefined') {
      window.location.href = '/login'
    }
    return null
  }

  return res
}

export async function getCurrentUser() {
  const res = await fetchWithAuth('/api/auth/me')
  if (!res || !res.ok) return null
  const data = await res.json()
  return data.success ? data.user : null
}
