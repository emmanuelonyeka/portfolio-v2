import { useSyncExternalStore } from 'react'

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'
const listeners = new Set<() => void>()
let query: MediaQueryList | null = null

function getQuery() {
  if (!query) {
    query = window.matchMedia(REDUCED_MOTION_QUERY)
    query.addEventListener('change', notify)
  }
  return query
}

function notify() {
  for (const listener of listeners) listener()
}

function subscribe(listener: () => void) {
  getQuery()
  listeners.add(listener)
  return () => listeners.delete(listener)
}

const getSnapshot = () => getQuery().matches

/** Tracks the live preference through one shared media-query listener. */
export function useReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, () => false)
}
