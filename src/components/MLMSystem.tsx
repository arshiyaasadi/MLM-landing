'use client'

import { motion } from 'framer-motion'
import { Container } from '@/components/Container'
import { useTranslation } from '@/hooks/useTranslation'

const features = [
  {
    key: 'missionCenter',
    icon: (
      <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    key: 'assetManagement',
    icon: (
      <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    key: 'networkAccelerator',
    icon: (
      <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    ),
  },
]

export function MLMSystem() {
  const t = useTranslation()

  return (
    <section className="relative bg-gray-900 py-20 sm:py-32">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:14px_24px]" />
      
      <Container className="relative">
        <div className="mx-auto max-w-3xl text-center">
          <motion.h2
            className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {t('mlmSystem.title')}
          </motion.h2>
          <motion.p
            className="mt-6 text-lg leading-8 text-gray-400 sm:text-xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {t('mlmSystem.subtitle')}
          </motion.p>
        </div>

        <div className="mx-auto mt-16 grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-3">
          {features.map((feature, index) => {
            const translations = t('mlmSystem.features' as any) as any
            const featureData = translations[feature.key]
            
            return (
              <motion.div
                key={feature.key}
                className="group relative flex flex-col overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-gray-800/80 to-gray-900/80 p-8 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/20"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-emerald-500/10 blur-3xl" />
                </div>

                {/* Icon */}
                <motion.div
                  className="relative mb-6 inline-flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 text-emerald-400 shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <motion.div
                    animate={{
                      filter: [
                        'drop-shadow(0 0 8px rgba(16,185,129,0.3))',
                        'drop-shadow(0 0 16px rgba(16,185,129,0.5))',
                        'drop-shadow(0 0 8px rgba(16,185,129,0.3))',
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    {feature.icon}
                  </motion.div>
                </motion.div>

                {/* Content */}
                <div className="relative flex flex-col">
                  <h3 className="mb-4 text-xl font-bold text-white">
                    {featureData?.title || ''}
                  </h3>
                  <p className="mb-4 text-base leading-7 text-gray-400">
                    {featureData?.description || ''}
                  </p>
                  
                  {/* Features list */}
                  <ul className="space-y-2 text-sm text-gray-300">
                    {featureData?.items?.map((item: string, itemIndex: number) => (
                      <li key={itemIndex} className="flex items-start">
                        <span className="ml-2 mt-1 flex-shrink-0 text-emerald-400">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {/* Result text */}
                  {featureData?.result && (
                    <p className="mt-4 text-sm font-medium text-emerald-400">
                      {featureData.result}
                    </p>
                  )}
                </div>

                {/* Decorative corner element */}
                <div className="absolute bottom-0 left-0 h-24 w-24 opacity-20 transition-opacity duration-300 group-hover:opacity-40">
                  <svg viewBox="0 0 100 100" fill="none">
                    <path
                      d="M0 100L100 0"
                      stroke="url(#corner-gradient-emerald)"
                      strokeWidth="2"
                    />
                    <defs>
                      <linearGradient id="corner-gradient-emerald" x1="0" y1="100" x2="100" y2="0">
                        <stop offset="0%" stopColor="#10B981" />
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

