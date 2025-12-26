'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Container } from '@/components/Container'
import { Button } from '@/components/Button'
import { useTranslation } from '@/hooks/useTranslation'

function NetworkBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-20">
      <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id="network-pattern"
            x="0"
            y="0"
            width="100"
            height="100"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="50" cy="50" r="2" fill="#C0C0C0" />
            <line x1="50" y1="50" x2="100" y2="50" stroke="#C0C0C0" strokeWidth="0.5" />
            <line x1="50" y1="50" x2="75" y2="100" stroke="#C0C0C0" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#network-pattern)" />
      </svg>
    </div>
  )
}

const steps = [
  {
    number: '۱',
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    ),
  },
  {
    number: '۲',
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    number: '۳',
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
]

export function MLMEngine() {
  const t = useTranslation()
  const [phoneNumber, setPhoneNumber] = useState('')

  const handleInvite = () => {
    // Reset the input
    setPhoneNumber('')
  }

  return (
    <section className="relative bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 py-20 sm:py-32" id="mlm-engine">
      {/* Network background */}
      <NetworkBackground />
      
      {/* Glow effects */}
      <div className="absolute top-1/4 right-1/4 h-[400px] w-[400px] rounded-full bg-emerald-500/10 blur-[120px]" />
      <div className="absolute bottom-1/4 left-1/4 h-[400px] w-[400px] rounded-full bg-cyan-500/10 blur-[120px]" />
      
      <Container className="relative">
        <div className="mx-auto max-w-2xl text-center">
          <motion.h2
            className="text-3xl font-bold tracking-tight text-white sm:text-4xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {t('mlmEngine.title')}
          </motion.h2>
          <motion.p
            className="mt-4 text-lg text-gray-400"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {t('mlmEngine.description')}
          </motion.p>
        </div>

        {/* Steps */}
        <div className="mx-auto mt-16 max-w-5xl">
          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step, index) => {
              const mlmSteps = t('mlmEngine.steps') as any
              const stepData = mlmSteps[`step${index + 1}`]
              
              return (
                <motion.div
                  key={step.number}
                  className="relative"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                >
                  {/* Connecting line (not on last item) */}
                  {index < steps.length - 1 && (
                    <div className="absolute top-12 right-0 hidden h-0.5 w-full translate-x-1/2 md:block">
                      <div className="h-full w-full bg-gradient-to-l from-gray-600 to-transparent" />
                    </div>
                  )}

                  <div className="relative flex flex-col items-center text-center">
                    {/* Number badge */}
                    <motion.div
                      className="absolute -top-4 -right-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 text-xl font-bold text-white shadow-lg shadow-emerald-500/50"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {step.number}
                    </motion.div>

                    {/* Icon container */}
                    <motion.div
                      className="relative flex h-24 w-24 items-center justify-center rounded-2xl border border-gray-700/50 bg-gradient-to-br from-gray-800 to-gray-900 text-gray-300 shadow-lg"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <motion.div
                        animate={{
                          filter: [
                            'drop-shadow(0 0 8px rgba(16, 185, 129, 0.3))',
                            'drop-shadow(0 0 16px rgba(16, 185, 129, 0.5))',
                            'drop-shadow(0 0 8px rgba(16, 185, 129, 0.3))',
                          ]
                        }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: index * 0.3 }}
                      >
                        {step.icon}
                      </motion.div>

                      {/* Glow effect */}
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    </motion.div>

                    {/* Content */}
                    <h3 className="mt-6 text-xl font-bold text-white">
                      {stepData?.title || ''}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-gray-400">
                      {stepData?.description || ''}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Mission Card */}
        <motion.div
          className="mx-auto mt-16 max-w-4xl"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="relative overflow-hidden rounded-3xl border border-gray-700/50 bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-4">
                {t('mlmEngine.missionTitle')}
              </h3>
              
              <p className="text-gray-400 mb-6">
                {t('mlmEngine.missionDescription')}
              </p>
              
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center mb-6">
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder={t('mlmEngine.phonePlaceholder')}
                  className="text-right flex-1 rounded-lg border border-gray-600 bg-gray-800/50 px-4 py-3 text-white placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
                <Button
                  onClick={handleInvite}
                  className="bg-gradient-to-r from-emerald-500 to-cyan-500 px-8 py-3 text-lg font-bold text-white shadow-2xl shadow-emerald-500/50 hover:shadow-emerald-500/70 whitespace-nowrap"
                >
                  {t('mlmEngine.inviteButton')}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  )
}

