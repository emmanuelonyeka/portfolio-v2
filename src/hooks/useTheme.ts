import { useCallback, useEffect, useState } from 'react'

export type Theme = 'dark' | 'light'

/**
 * The initial theme is applied by an inline script in index.html, before first
 * paint — this hook only reads what that script decided and toggles from there.
 * Reading localStorage in an effect is what caused the dark-then-light flash.
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() =>
    document.documentElement.classList.contains('theme-light') ? 'light' : 'dark',
  )

  useEffect(() => {
    document.documentElement.classList.toggle('theme-light', theme === 'light')
    try {
      localStorage.setItem('theme', theme)
    } catch {
      /* private mode — the toggle still works for this session */
    }
  }, [theme])

  useEffect(() => {
    const query = window.matchMedia('(prefers-color-scheme: light)')
    const onChange = (event: MediaQueryListEvent) => {
      // Only follow the system while the visitor has not chosen for themselves.
      if (localStorage.getItem('theme')) return
      setTheme(event.matches ? 'light' : 'dark')
    }
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  const toggle = useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), [])

  return { theme, toggle }
}
