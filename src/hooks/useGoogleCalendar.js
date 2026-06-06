import { useState, useEffect, useCallback } from 'react'

const SCOPE = 'https://www.googleapis.com/auth/calendar.readonly'
const TOKEN_KEY = 'gcal_token'
const TOKEN_EXP_KEY = 'gcal_token_exp'

function loadToken() {
  try {
    const token = localStorage.getItem(TOKEN_KEY)
    const exp = Number(localStorage.getItem(TOKEN_EXP_KEY) || 0)
    if (token && Date.now() < exp) return token
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(TOKEN_EXP_KEY)
    return null
  } catch { return null }
}

function saveToken(token, expiresIn) {
  try {
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(TOKEN_EXP_KEY, String(Date.now() + (expiresIn - 120) * 1000))
  } catch {}
}

function clearToken() {
  try {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(TOKEN_EXP_KEY)
  } catch {}
}

function transformEvents(items) {
  return items
    .filter(item => item.status !== 'cancelled' && item.summary)
    .map(item => {
      const isAllDay = !item.start.dateTime
      const dateISO = isAllDay ? item.start.date : item.start.dateTime.split('T')[0]
      let time = null
      let timeMin = null
      if (!isAllDay) {
        const dt = new Date(item.start.dateTime)
        time = dt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
        timeMin = dt.getHours() * 60 + dt.getMinutes()
      }
      const rawDesc = item.description || null
      const sub = rawDesc ? rawDesc.replace(/<[^>]+>/g, '').trim().slice(0, 80) : null
      return {
        id: `gcal_${item.id}`,
        title: item.summary,
        dateISO,
        time,
        timeMin,
        cat: 'calendar',
        source: 'google',
        done: false,
        sub,
        flag: null,
        money: null,
        dueByEOD: isAllDay,
        offset: null,
      }
    })
}

export function useGoogleCalendar(clientId) {
  const [isSignedIn, setIsSignedIn] = useState(() => !!loadToken())
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [tokenClient, setTokenClient] = useState(null)

  useEffect(() => {
    if (!clientId) return
    let active = true

    function initClient() {
      if (!window.google?.accounts?.oauth2) return
      const tc = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: SCOPE,
        callback: (resp) => {
          if (!active) return
          if (resp.error) { setError(resp.error_description || resp.error); return }
          saveToken(resp.access_token, resp.expires_in)
          setIsSignedIn(true)
          doFetch(resp.access_token)
        },
      })
      if (active) setTokenClient(tc)
      const stored = loadToken()
      if (stored && active) {
        setIsSignedIn(true)
        doFetch(stored)
      }
    }

    if (window.google?.accounts?.oauth2) {
      initClient()
    } else {
      const existing = document.querySelector('script[src*="accounts.google.com/gsi"]')
      if (existing) {
        existing.addEventListener('load', initClient)
      } else {
        const s = document.createElement('script')
        s.src = 'https://accounts.google.com/gsi/client'
        s.async = true
        s.onload = initClient
        document.head.appendChild(s)
      }
    }

    return () => { active = false }
  }, [clientId])

  async function doFetch(token) {
    setLoading(true)
    setError(null)
    try {
      const now = new Date()
      const tMin = new Date(now); tMin.setDate(tMin.getDate() - 1)
      const tMax = new Date(now); tMax.setDate(tMax.getDate() + 14)

      const res = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events?` +
        new URLSearchParams({
          timeMin: tMin.toISOString(),
          timeMax: tMax.toISOString(),
          singleEvents: 'true',
          orderBy: 'startTime',
          maxResults: '100',
        }),
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (res.status === 401) {
        clearToken()
        setIsSignedIn(false)
        setEvents([])
        return
      }

      const data = await res.json()
      setEvents(transformEvents(data.items || []))
    } catch {
      setError('Could not load calendar')
    } finally {
      setLoading(false)
    }
  }

  const signIn = useCallback(() => {
    if (tokenClient) tokenClient.requestAccessToken()
  }, [tokenClient])

  const signOut = useCallback(() => {
    const token = loadToken()
    if (token && window.google?.accounts?.oauth2) {
      window.google.accounts.oauth2.revoke(token, () => {})
    }
    clearToken()
    setIsSignedIn(false)
    setEvents([])
  }, [])

  const refresh = useCallback(() => {
    const token = loadToken()
    if (token) doFetch(token)
    else if (tokenClient) tokenClient.requestAccessToken()
  }, [tokenClient])

  return { isSignedIn, events, loading, error, signIn, signOut, refresh }
}
