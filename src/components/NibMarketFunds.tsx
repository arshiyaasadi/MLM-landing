'use client'

import { motion } from 'framer-motion'
import { Container } from '@/components/Container'
import { Button } from '@/components/Button'
import { useTranslation } from '@/hooks/useTranslation'

const funds = [
  {
    key: 'fixedIncome',
    icon: 'shield',
    tagColor: 'text-emerald-400',
    tagBg: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
    glowColor: 'shadow-emerald-500/20',
  },
  {
    key: 'equity',
    icon: 'chart',
    tagColor: 'text-red-400',
    tagBg: 'bg-red-500/10',
    borderColor: 'border-red-500/30',
    glowColor: 'shadow-red-500/20',
  },
  {
    key: 'gold',
    icon: 'gold',
    tagColor: 'text-yellow-400',
    tagBg: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/30',
    glowColor: 'shadow-yellow-500/20',
  },
]

const IconShield = () => (
  <svg className="h-16 w-16" fill="none" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M32 8L12 16v16c0 13.3 8.5 25.5 20 29.6 11.5-4.1 20-16.3 20-29.6V16L32 8z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      className="text-emerald-400"
    />
    <path
      d="M32 28v8l8-4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-emerald-400"
    />
  </svg>
)

const IconChart = () => (
  <svg className="h-16 w-16" fill="none" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 48h40"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className="text-red-400"
    />
    <path
      d="M16 36l8-12 8 8 16-20 8 12"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      className="text-red-400"
    />
    <circle cx="16" cy="36" r="2" fill="currentColor" className="text-red-400" />
    <circle cx="24" cy="24" r="2" fill="currentColor" className="text-red-400" />
    <circle cx="32" cy="32" r="2" fill="currentColor" className="text-red-400" />
    <circle cx="48" cy="12" r="2" fill="currentColor" className="text-red-400" />
    <circle cx="56" cy="24" r="2" fill="currentColor" className="text-red-400" />
  </svg>
)

const IconGold = () => (
  <svg className="h-16 w-16" fill="none" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <circle
      cx="32"
      cy="32"
      r="18"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      className="text-yellow-400"
    />
    <circle
      cx="32"
      cy="32"
      r="12"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
      className="text-yellow-500"
    />
    <circle cx="32" cy="32" r="6" fill="currentColor" className="text-yellow-400" />
    <path
      d="M32 14v6M32 44v6M50 32h-6M20 32h-6M45.66 18.34l-4.24 4.24M22.58 41.42l-4.24 4.24M45.66 45.66l-4.24-4.24M22.58 22.58l-4.24-4.24"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      className="text-yellow-500"
    />
  </svg>
)

export function NibMarketFunds() {
  const t = useTranslation()

  const renderIcon = (iconType: string) => {
    switch (iconType) {
      case 'shield':
        return <IconShield />
      case 'chart':
        return <IconChart />
      case 'gold':
        return <IconGold />
      default:
        return null
    }
  }

  return (
    <section className="relative bg-gray-900 py-20 sm:py-32" id="funds">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      <Container className="relative">
        <div className="mx-auto max-w-3xl text-center">
          <motion.h2
            className="text-3xl font-bold tracking-tight text-white sm:text-4xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {t('nibMarketFunds.title')}
          </motion.h2>
          <motion.p
            className="mt-4 text-lg text-gray-400"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {t('nibMarketFunds.subtitle')}
          </motion.p>
        </div>

        {/* Cards container with horizontal scroll on mobile */}
        <div className="mx-auto mt-16 max-w-7xl">
          <div className="flex gap-6 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] lg:grid lg:grid-cols-3 lg:overflow-visible lg:pb-0">
            {funds.map((fund, index) => {
              const fundsData = t('nibMarketFunds') as any
              const fundData = fundsData[fund.key]
              
              return (
                <motion.div
                  key={fund.key}
                  className={`group relative flex min-w-[320px] flex-col overflow-hidden rounded-3xl border ${fund.borderColor} bg-gradient-to-br from-gray-800/80 to-gray-900/80 p-8 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl ${fund.glowColor} lg:min-w-0`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                >
                  {/* Decorative gradient orb */}
                  <div className={`absolute -top-20 -right-20 h-40 w-40 rounded-full bg-gradient-to-br ${fund.icon === 'shield' ? 'from-emerald-500' : fund.icon === 'chart' ? 'from-red-500' : 'from-yellow-500'} to-transparent opacity-20 blur-3xl transition-opacity duration-300 group-hover:opacity-30`} />

                  <div className="relative flex flex-col">
                    {/* Icon */}
                    <div className="mb-6 flex justify-center">
                      <div className="rounded-2xl bg-gray-800/50 p-4 backdrop-blur-sm">
                        {renderIcon(fund.icon)}
                      </div>
                    </div>

                    {/* Tag */}
                    {fundData?.tag && (
                      <div className={`mb-4 inline-flex items-center justify-center self-center rounded-full ${fund.tagBg} px-4 py-1.5 text-sm font-medium ${fund.tagColor}`}>
                        {fundData.tag}
                      </div>
                    )}

                    {/* Title */}
                    <h3 className="text-center text-2xl font-bold text-white sm:text-3xl">
                      {fundData?.title || ''}
                    </h3>

                    {/* Description */}
                    <p className="mt-4 text-center text-base leading-7 text-gray-400">
                      {fundData?.description || ''}
                    </p>

                    {/* CTA Button */}
                    {fundData?.cta && (
                      <motion.a
                        href={fundData?.link || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gray-700/50 to-gray-800/50 px-6 py-3 text-sm font-semibold text-white transition-all hover:from-gray-600/50 hover:to-gray-700/50"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span>{fundData.cta}</span>
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </motion.a>
                    )}
                  </div>

                  {/* Decorative corner element */}
                  <div className="absolute bottom-0 left-0 h-32 w-32 opacity-10">
                    <svg viewBox="0 0 100 100" fill="none">
                      <circle cx="20" cy="80" r="40" fill="currentColor" className="text-white" />
                    </svg>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* CTA Section */}
        <motion.div
          className="mx-auto mt-16 max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="rounded-2xl border border-gray-700/50 bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-8 backdrop-blur-sm">
            <h3 className="text-xl font-bold text-white sm:text-2xl">
              {t('nibMarketFunds.cta.title')}
            </h3>
            <p className="mt-3 text-base text-gray-400">
              {t('nibMarketFunds.cta.description')}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button
                href="/login"
                variant="solid"
                color="cyan"
                className="min-w-[140px] bg-gradient-to-r from-cyan-500 to-emerald-500 text-white hover:from-cyan-600 hover:to-emerald-600"
              >
                {t('nibMarketFunds.cta.login')}
              </Button>
              
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  )
}

