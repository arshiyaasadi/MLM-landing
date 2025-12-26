'use client'

import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useEffect, useState } from 'react'

export function ScrollOrbitBlur() {
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 })

  // Motion values for offset from center
  const purpleOffsetX = useMotionValue(0)
  const purpleOffsetY = useMotionValue(0)
  const orangeOffsetX = useMotionValue(0)
  const orangeOffsetY = useMotionValue(0)

  // Update viewport size on mount and resize
  useEffect(() => {
    const updateSize = () => {
      setViewportSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  // Update positions based on scroll
  useEffect(() => {
    if (viewportSize.width === 0 || viewportSize.height === 0) return

    const rotationSpeed = 2 // Full rotations per page scroll
    // Smaller radius to keep elements close to center (200px max offset)
    const maxRadius = 200

    const updatePositions = () => {
      // Calculate scroll progress (0 to 1)
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = scrollHeight > 0 ? Math.min(scrollTop / scrollHeight, 1) : 0

      // Convert progress to angle in radians
      const angle = progress * rotationSpeed * Math.PI * 2

      // Calculate offsets from center for purple element (clockwise: positive angle)
      const purpleX = maxRadius * Math.cos(angle)
      const purpleY = maxRadius * Math.sin(angle)
      purpleOffsetX.set(purpleX)
      purpleOffsetY.set(purpleY)

      // Calculate offsets from center for orange element (counter-clockwise: negative angle)
      const orangeX = maxRadius * Math.cos(-angle)
      const orangeY = maxRadius * Math.sin(-angle)
      orangeOffsetX.set(orangeX)
      orangeOffsetY.set(orangeY)
    }

    // Set initial positions (at angle 0)
    purpleOffsetX.set(maxRadius)
    purpleOffsetY.set(0)
    orangeOffsetX.set(-maxRadius)
    orangeOffsetY.set(0)

    // Update on scroll
    window.addEventListener('scroll', updatePositions, { passive: true })
    
    // Also call once after a small delay to ensure proper positioning
    const timeoutId = setTimeout(updatePositions, 100)
    
    return () => {
      window.removeEventListener('scroll', updatePositions)
      clearTimeout(timeoutId)
    }
  }, [viewportSize.width, viewportSize.height, purpleOffsetX, purpleOffsetY, orangeOffsetX, orangeOffsetY])

  // Use spring for smooth animation
  const springConfig = { stiffness: 100, damping: 30 }
  const smoothPurpleX = useSpring(purpleOffsetX, springConfig)
  const smoothPurpleY = useSpring(purpleOffsetY, springConfig)
  const smoothOrangeX = useSpring(orangeOffsetX, springConfig)
  const smoothOrangeY = useSpring(orangeOffsetY, springConfig)

  // Don't render until viewport size is known
  if (viewportSize.width === 0 || viewportSize.height === 0) {
    return null
  }

  return (
    <>
      {/* Purple blur element - clockwise rotation */}
      <motion.div
        className="fixed left-1/2 top-1/2 z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#8B4AE8]/10 blur-[100px] pointer-events-none"
        style={{
          x: smoothPurpleX,
          y: smoothPurpleY,
        }}
      />

      {/* Orange blur element - counter-clockwise rotation */}
      <motion.div
        className="fixed left-1/2 top-1/2 z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FFA500]/10 blur-[100px] pointer-events-none"
        style={{
          x: smoothOrangeX,
          y: smoothOrangeY,
        }}
      />
    </>
  )
}
