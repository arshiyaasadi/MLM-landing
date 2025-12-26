'use client'

import { useId, useState } from 'react'
import { motion, useSpring } from 'framer-motion'
import { Button } from '@/components/Button'
import { Container } from '@/components/Container'
import { useTranslation } from '@/hooks/useTranslation'

interface CoinAnimationProps extends React.ComponentPropsWithoutRef<'div'> {
  mouseX: number
  mouseY: number
}

function CoinAnimation({ mouseX, mouseY, ...props }: CoinAnimationProps) {
  let id = useId()
  
  // Calculate tilt angles based on mouse position (-1 to 1 range)
  // Invert Y for natural tilt direction
  const tiltX = mouseY * -15 // -15deg to +15deg
  const tiltY = mouseX * 15   // -15deg to +15deg
  
  // Add subtle scale for depth perception
  const distance = Math.sqrt(mouseX * mouseX + mouseY * mouseY)
  const scale = 1 + (distance * 0.05) // Slightly larger when mouse is further from center
  
  // Use spring animation for smooth transitions
  const springTiltX = useSpring(tiltX, { stiffness: 150, damping: 20 })
  const springTiltY = useSpring(tiltY, { stiffness: 150, damping: 20 })
  const springScale = useSpring(scale, { stiffness: 150, damping: 20 })
  
  // Calculate sheen position (normalized 0-1)
  const sheenX = (mouseX + 1) * 50 // Convert -1,1 to 0,100
  const sheenY = (mouseY + 1) * 50
  
  // Calculate text offset for 3D effect (parallax with tilt)
  const textOffsetX = mouseX * 8  // Move text slightly with tilt
  const textOffsetY = mouseY * 8
  const springTextX = useSpring(textOffsetX, { stiffness: 150, damping: 20 })
  const springTextY = useSpring(textOffsetY, { stiffness: 150, damping: 20 })

  return (
    <div {...props} style={{ perspective: '1000px' }}>
      <motion.svg
        viewBox="0 0 400 400"
        fill="none"
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
        style={{
          rotateX: springTiltX,
          rotateY: springTiltY,
          scale: springScale,
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Outer ring - slow rotation */}
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "200px 200px" }}
        >
          <circle
            cx="200"
            cy="200"
            r="180"
            stroke={`url(#${id}-gradient-outer)`}
            strokeWidth="2"
            fill="none"
            strokeDasharray="4 4"
          />
        </motion.g>

        {/* Middle ring - medium rotation */}
        <motion.g
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "200px 200px" }}
        >
          <circle
            cx="200"
            cy="200"
            r="140"
            stroke={`url(#${id}-gradient-middle)`}
            strokeWidth="3"
            fill="none"
          />
        </motion.g>

        {/* Inner coin - main element with 3D tilt */}
        <g style={{ transformOrigin: "200px 200px" }}>
          {/* Coin body */}
          <ellipse
            cx="200"
            cy="200"
            rx="90"
            ry="90"
            fill={`url(#${id}-gradient-coin)`}
            className="drop-shadow-[0_0_30px_rgba(192,192,192,0.5)]"
          />
          
          {/* Metallic sheen effect */}
          <defs>
            <radialGradient id={`${id}-sheen`} cx={`${sheenX}%`} cy={`${sheenY}%`} r="50%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.6)" />
              <stop offset="50%" stopColor="rgba(255,255,255,0.2)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </radialGradient>
          </defs>
          <ellipse
            cx="200"
            cy="200"
            rx="90"
            ry="90"
            fill={`url(#${id}-sheen)`}
            style={{ mixBlendMode: 'overlay' }}
          />
          
          {/* Coin highlight */}
          <ellipse
            cx="180"
            cy="180"
            rx="30"
            ry="30"
            fill="rgba(255,255,255,0.3)"
            className="blur-sm"
          />

          {/* TWIN text with parallax */}
          <motion.g
            style={{
              x: springTextX,
              y: springTextY
            }}
          >
            <text
              x="200"
              y="210"
              textAnchor="middle"
              className="fill-gray-800 text-4xl font-bold"
              style={{ 
                fontFamily: 'IRANSans, sans-serif'
              }}
            >
              TWIN
            </text>
          </motion.g>
        </g>

        {/* Floating particles */}
        {[...Array(8)].map((_, i) => {
          const angle = (i * 45 * Math.PI) / 180
          const radius = 160
          const x = 200 + radius * Math.cos(angle)
          const y = 200 + radius * Math.sin(angle)
          
          return (
            <motion.circle
              key={i}
              cx={x}
              cy={y}
              r="3"
              fill={`url(#${id}-gradient-particle)`}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.8, 0.3]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
            />
          )
        })}

        <defs>
          <linearGradient
            id={`${id}-gradient-outer`}
            x1="0"
            y1="0"
            x2="1"
            y2="1"
          >
            <stop offset="0%" stopColor="#C0C0C0" />
            <stop offset="50%" stopColor="#E8E8E8" />
            <stop offset="100%" stopColor="#C0C0C0" />
          </linearGradient>

          <linearGradient
            id={`${id}-gradient-middle`}
            x1="0"
            y1="0"
            x2="1"
            y2="1"
          >
            <stop offset="0%" stopColor="#A8A8A8" />
            <stop offset="100%" stopColor="#D0D0D0" />
          </linearGradient>

          <radialGradient id={`${id}-gradient-coin`}>
            <stop offset="0%" stopColor="#F5F5F5" />
            <stop offset="50%" stopColor="#D4D4D4" />
            <stop offset="100%" stopColor="#A0A0A0" />
          </radialGradient>

          <radialGradient id={`${id}-gradient-particle`}>
            <stop offset="0%" stopColor="#E0E0E0" />
            <stop offset="100%" stopColor="#C0C0C0" />
          </radialGradient>
        </defs>
      </motion.svg>
    </div>
  )
}

export function MLMHero() {
  const t = useTranslation()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    
    // Convert to range -1 to 1
    setMousePosition({
      x: (x - 0.5) * 2,
      y: (y - 0.5) * 2
    })
  }
  
  return (
    <div 
      id="home" 
      className="relative overflow-hidden bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 py-20 sm:py-32 lg:pb-32 xl:pb-36"
      onMouseMove={handleMouseMove}
    >
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-[#8B4AE8]/15 blur-[100px]" />
      <div className="absolute bottom-0 right-1/4 h-[500px] w-[500px] rounded-full bg-[#FFA500]/10 blur-[100px]" />
      
      <Container>
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-8 lg:gap-y-20">
          {/* Text content - Right side */}
          <div className="relative z-10 mx-auto max-w-2xl lg:col-span-7 lg:max-w-none lg:pt-6 xl:col-span-6">
            <motion.h1 
              className="text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="block">MLM</div>
              <div className="block text-2xl sm:text-3xl lg:text-4xl mt-2">امتیاز نقره‌ای</div>
            </motion.h1>
            
            <motion.p 
              className="mt-6 text-lg leading-8 text-gray-300 sm:text-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {t('hero.subtitle')}
            </motion.p>
            
            <motion.div 
              className="mt-10 flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Button
                href="#mlm-engine"
                className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white hover:from-emerald-600 hover:to-cyan-600 shadow-lg shadow-emerald-500/50"
              >
                {t('hero.startEarning')}
              </Button>
              
              <Button
                href="#live-chart"
                variant="outline"
                className="border-gray-600 text-white hover:bg-white/10"
              >
                {t('hero.viewLivePrice')}
              </Button>
            </motion.div>
          </div>
          
          {/* Coin animation - Left side */}
          <div className="relative mt-10 sm:mt-20 lg:col-span-5 lg:row-span-2 lg:mt-0 xl:col-span-6">
            <div className="relative mx-auto h-[400px] w-[400px] lg:h-[500px] lg:w-[500px]">
              <CoinAnimation 
                className="h-full w-full" 
                mouseX={mousePosition.x}
                mouseY={mousePosition.y}
              />
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}

