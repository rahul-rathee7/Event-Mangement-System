import { useState, useEffect, useRef } from 'react'

export function useIntersectionObserver({ threshold = 0, root = null, rootMargin = '0px', triggerOnce = false }) {
  const [entry, setEntry] = useState({ isIntersecting: false })
  const [node, setNode] = useState(null)
  const observer = useRef(null)

  useEffect(() => {
    if (observer.current) observer.current?.disconnect()

    observer.current = new IntersectionObserver(
      ([entry]) => {
        setEntry(entry)
        if (entry.isIntersecting && triggerOnce) {
          observer.current?.disconnect()
        }
      },
      { threshold, root, rootMargin }
    )

    const { current: currentObserver } = observer
    if (node) currentObserver.observe(node)

    return () => currentObserver.disconnect()
  }, [node, threshold, root, rootMargin, triggerOnce])

  return [setNode, entry?.isIntersecting ?? false]
}