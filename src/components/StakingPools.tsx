'use client'

import { motion } from 'framer-motion'
import { Container } from '@/components/Container'
import { Button } from '@/components/Button'
import { useTranslation } from '@/hooks/useTranslation'

const pools = [
  {
    key: 'shortTerm',
    badge: 'پیشنهاد ویژه',
    badgeColor: 'from-blue-500 to-cyan-500',
    borderColor: 'border-blue-500/30',
    glowColor: 'shadow-blue-500/20',
  },
  {
    key: 'longTerm',
    badge: 'محبوب',
    badgeColor: 'from-emerald-500 to-green-500',
    borderColor: 'border-emerald-500/30',
    glowColor: 'shadow-emerald-500/20',
  },
]

export function StakingPools() {
  const t = useTranslation()

  return (
    <section className="relative bg-gray-900 py-20 sm:py-32" id="pools">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      <Container className="relative">
        <div className="mx-auto max-w-2xl text-center">
          <motion.h2
            className="text-3xl font-bold tracking-tight text-white sm:text-4xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {t('stakingPools.title')}
          </motion.h2>
          <motion.p
            className="mt-4 text-lg text-gray-400"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {t('stakingPools.description')}
          </motion.p>
        </div>

        <div className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-2">
          {pools.map((pool, index) => {
            const stakingPools = t('stakingPools') as any
            const poolData = stakingPools[pool.key]

            return (
              <motion.div
                key={pool.key}
                className={`group relative overflow-hidden rounded-3xl border ${pool.borderColor} bg-gradient-to-br from-gray-800/80 to-gray-900/80 p-8 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl ${pool.glowColor}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >


                {/* Decorative gradient orb */}
                <div className={`absolute -top-20 -left-20 h-40 w-40 rounded-full bg-gradient-to-br ${pool.badgeColor} opacity-20 blur-3xl transition-opacity duration-300 group-hover:opacity-30`} />

                <div className="relative mt-12">
                  {/* Title */}
                  <h3 className="text-2xl font-bold text-white sm:text-3xl">
                    {poolData?.title || ''}
                  </h3>

                  {/* Reward */}
                  <div className="mt-6 rounded-2xl border border-gray-700/50 bg-gray-800/50 p-6">
                    <p className="text-sm font-medium text-gray-400">پاداش</p>
                    <p className="mt-2 text-xl font-bold text-white sm:text-2xl">
                      {poolData?.reward || ''}
                    </p>
                  </div>

                  {/* Condition */}
                  <div className="mt-4 rounded-2xl border border-gray-700/50 bg-gray-800/50 p-6">
                    <p className="text-sm font-medium text-gray-400">شرایط</p>
                    <p className="mt-2 text-base text-gray-300">
                      {poolData?.condition || ''}
                    </p>
                  </div>

                  {/* Benefits list */}
                  <div className="mt-6 space-y-3">
                    <div className="flex items-start gap-3">
                      <svg className="mt-1 h-5 w-5 flex-shrink-0 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <p className="text-sm text-gray-400">سود تضمینی بر اساس قیمت نقره</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <svg className="mt-1 h-5 w-5 flex-shrink-0 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <p className="text-sm text-gray-400">مدیریت حرفه‌ای توسط متخصصین تامین سرمایه نوین</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <svg className="mt-1 h-5 w-5 flex-shrink-0 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <p className="text-sm text-gray-400">امکان ترکیب با درآمد شبکه‌ای</p>
                    </div>
                  </div>
                </div>

                {/* Decorative corner element */}
                <div className="absolute bottom-0 right-0 h-32 w-32 opacity-10">
                  <svg viewBox="0 0 100 100" fill="none">
                    <circle cx="80" cy="80" r="40" fill={`url(#pool-gradient-${index})`} />
                    <defs>
                      <radialGradient id={`pool-gradient-${index}`}>
                        <stop offset="0%" stopColor="white" />
                        <stop offset="100%" stopColor="transparent" />
                      </radialGradient>
                    </defs>
                  </svg>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Info note */}
        <motion.div
          className="mx-auto mt-12 max-w-3xl rounded-2xl border border-gray-700/50 bg-gray-800/30 p-6 text-center backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <p className="text-sm text-gray-400">
            💡 نکته: سود استخرها علاوه بر رشد طبیعی قیمت نقره محاسبه می‌شود. با ترکیب استخر و دعوت دوستان، درآمد خود را چندین برابر کنید.
          </p>
        </motion.div>
      </Container>
    </section>
  )
}

