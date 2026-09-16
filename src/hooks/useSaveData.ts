import { useSyncExternalStore } from 'react'

interface NetworkInformation extends EventTarget {
  saveData?: boolean
}

type NavigatorWithConnection = Navigator & {
  connection?: NetworkInformation
  mozConnection?: NetworkInformation
  webkitConnection?: NetworkInformation
}

const listeners = new Set<() => void>()
let connected = false
let dataPreference: MediaQueryList | null = null

const connection = () => {
  const browser = navigator as NavigatorWithConnection
  return browser.connection ?? browser.mozConnection ?? browser.webkitConnection
}

const preference = () => {
  if (!dataPreference) dataPreference = window.matchMedia('(prefers-reduced-data: reduce)')
  return dataPreference
}

function notify() {
  for (const listener of listeners) listener()
}

function connect() {
  if (connected) return
  connected = true
  connection()?.addEventListener('change', notify)
  preference().addEventListener('change', notify)
}

function subscribe(listener: () => void) {
  connect()
  listeners.add(listener)
  return () => listeners.delete(listener)
}

const getSnapshot = () => Boolean(connection()?.saveData || preference().matches)

/** True when the browser or operating system asks the page to conserve data. */
export function useSaveData() {
  return useSyncExternalStore(subscribe, getSnapshot, () => false)
}
