'use client'

import { motion } from 'framer-motion'
import { Container } from '@/components/Container'
import { useTranslation } from '@/hooks/useTranslation'

const cards = [
  {
    key: 'silverBacked',
    icon: (
      <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        {/* Outer circle - token shape */}
        <circle cx="12" cy="12" r="9" strokeWidth={1.5} fill="currentColor" fillOpacity="0.1" />
        <circle cx="12" cy="12" r="9" strokeWidth={1.5} />
        {/* Inner design - representing value/silver */}
        <circle cx="12" cy="12" r="5" strokeWidth={1} strokeDasharray="2 2" opacity="0.5" />
        <circle cx="12" cy="12" r="2.5" fill="currentColor" opacity="0.6" />
        {/* Decorative lines */}
        <path strokeLinecap="round" strokeWidth={1} d="M7 9h10M7 15h10" opacity="0.4" />
      </svg>
    ),
  },
  {
    key: 'shareholder',
    icon: (
      <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    key: 'deflationary',
    icon: (
      <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
  {
    key: 'liquidity',
    icon: (
      <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
      </svg>
    ),
  },
]

export function BentoGrid() {
  const t = useTranslation()

  return (
    <section className="relative bg-gray-900 py-20 sm:py-32" id="features">
      
      <Container className="relative">
        <div className="mx-auto max-w-2xl text-center">
          <motion.h2
            className="text-3xl font-bold tracking-tight text-white sm:text-4xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {t('bentoGrid.title')}
          </motion.h2>
        </div>

        <div className="mx-auto mt-16 grid max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 lg:gap-8">
          {cards.map((card, index) => {
            // Get card translations manually
            const translations = t('bentoGrid.cards' as any) as any
            const cardData = translations[card.key]
            
            return (
              <motion.div
                key={card.key}
                className="group relative overflow-hidden rounded-2xl border border-gray-700/50 bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-8 backdrop-blur-sm transition-all duration-300 hover:border-gray-500/50 hover:shadow-[0_0_30px_rgba(192,192,192,0.1)]"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-gray-400/10 blur-3xl" />
                </div>

                {/* Badge */}
                <div className="relative mb-4">
                  <span className="inline-flex items-center rounded-full bg-gray-700/50 px-3 py-1 text-xs font-medium text-gray-300">
                    {cardData?.badge || ''}
                  </span>
                </div>

                {/* Icon */}
                <motion.div
                  className="relative mb-6 inline-flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-gray-700 to-gray-800 text-gray-300 shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <motion.div
                    animate={{
                      filter: [
                        'drop-shadow(0 0 8px rgba(192,192,192,0.3))',
                        'drop-shadow(0 0 16px rgba(192,192,192,0.5))',
                        'drop-shadow(0 0 8px rgba(192,192,192,0.3))',
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    {card.icon}
                  </motion.div>
                </motion.div>

                {/* Content */}
                <h3 className="relative mb-3 text-xl font-bold text-white">
                  {cardData?.title || ''}
                </h3>
                <p className="relative text-base leading-7 text-gray-400">
                  {cardData?.description || ''}
                </p>

                {/* Decorative corner element */}
                <div className="absolute bottom-0 left-0 h-24 w-24 opacity-20 transition-opacity duration-300 group-hover:opacity-40">
                  <svg viewBox="0 0 100 100" fill="none">
                    <path
                      d="M0 100L100 0"
                      stroke="url(#corner-gradient)"
                      strokeWidth="2"
                    />
                    <defs>
                      <linearGradient id="corner-gradient" x1="0" y1="100" x2="100" y2="0">
                        <stop offset="0%" stopColor="#C0C0C0" />
                        <stop offset="100%" stopColor="transparent" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </motion.div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}

