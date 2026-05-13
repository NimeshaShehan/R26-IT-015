/**
 * useSilentRefresh.js
 * Calls the provided async fetch function on mount and then every `intervalMs` milliseconds.
 * Updates data silently — no loading state exposed, no re-render flash.
 * Uses a ref to store the latest data snapshot and only triggers re-render when
 * the data actually changes (deep-equality check via JSON.stringify).
 */
import { useState, useEffect, useRef, useCallback } from 'react'

export default function useSilentRefresh(fetchFn, intervalMs = 5000) {
  const [data,  setData]  = useState(null)
  const [error, setError] = useState(null)
  const prevJson = useRef(null)

  const refresh = useCallback(async () => {
    try {
      const result  = await fetchFn()
      const newJson = JSON.stringify(result)
      if (newJson !== prevJson.current) {
        prevJson.current = newJson
        setData(result)
        setError(null)
      }
    } catch (err) {
      setError(err)
      // Do NOT clear existing data on error — keep showing last known good data
    }
  }, [fetchFn])

  useEffect(() => {
    refresh()                                // initial fetch
    const id = setInterval(refresh, intervalMs)
    return () => clearInterval(id)
  }, [refresh, intervalMs])

  return { data, error }
}
