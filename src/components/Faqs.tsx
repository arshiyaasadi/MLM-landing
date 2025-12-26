'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Container } from '@/components/Container'
import { useTranslation } from '@/hooks/useTranslation'

const faqs = [
  { key: 'whatIsTwin' },
  { key: 'howToCashOut' },
  { key: 'needReferrals' },
  { key: 'howRewardsWork' },
]

export function Faqs() {
  const t = useTranslation()
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  
  return (
    <section
      id="faqs"
      aria-labelledby="faqs-title"
      className="relative z-10 bg-gray-900 py-20 sm:py-32"
    >
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <motion.h2
            id="faqs-title"
            className="text-3xl font-bold tracking-tight text-white sm:text-4xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {t('faqs.title')}
          </motion.h2>
        </div>

        <div className="mx-auto mt-16 max-w-3xl space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index
            const faqsItems = t('faqs.items') as any
            const faqData = faqsItems[faq.key]
            
            return (
              <motion.div
                key={faq.key}
                className="overflow-hidden rounded-2xl border border-gray-700/50 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between p-6 text-right transition-colors hover:bg-gray-800/30"
                >
                  <h3 className="text-lg font-semibold text-white">
                    {faqData?.question || ''}
                  </h3>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="mr-4 flex-shrink-0"
                  >
                    <svg
                      className="h-6 w-6 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </motion.div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-gray-700/50 p-6 pt-4">
                        <p className="text-base leading-7 text-gray-400">
                          {faqData?.answer || ''}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
