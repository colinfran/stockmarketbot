import { useState, useEffect } from "react"

/**
 * Hook to determine if a given media query matches.
 * @param query - The CSS media query string (e.g. "(min-width: 768px)")
 * @returns boolean indicating if the query matches
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia(query).matches
    }
    return false // Default for SSR
  })

  useEffect(() => {
    if (typeof window === "undefined") return

    const mediaQueryList = window.matchMedia(query)

    const listener = (event: MediaQueryListEvent): void => {
      setMatches(event.matches)
    }

    mediaQueryList.addEventListener("change", listener)

    // Initial check
    setMatches(mediaQueryList.matches)

    return () => {
      mediaQueryList.removeEventListener("change", listener)
    }
  }, [query])

  return matches
}
