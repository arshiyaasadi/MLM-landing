'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { AreaChart, Area, ResponsiveContainer } from 'recharts'
import { Container } from '@/components/Container'
import { useTranslation } from '@/hooks/useTranslation'

// Mock data for chart - realistic silver price trend
// Using a seeded random function to ensure consistent data between server and client
const seededRandom = (seed: number, index: number) => {
  let value = seed + index
  for (let i = 0; i < index; i++) {
    value = (value * 9301 + 49297) % 233280
  }
  return value / 233280
}

const generateMockData = (points: number, seed: number = 12345) => {
  const data = []
  let basePrice = 11000000
  
  for (let i = 0; i < points; i++) {
    const variation = seededRandom(seed, i) * 800000 - 200000
    basePrice += variation * 0.1
    data.push({
      value: Math.max(basePrice, 10000000)
    })
  }
  
  return data
}

const timeframes = [
  { key: 'daily', label: 'روزانه', points: 24 },
  { key: 'weekly', label: 'هفتگی', points: 7 },
  { key: 'monthly', label: 'ماهانه', points: 30 },
  { key: 'yearly', label: 'سالانه', points: 12 },
]

export function LiveChart() {
  const t = useTranslation()
  const [selectedTimeframe, setSelectedTimeframe] = useState('monthly')
  const [showSilverPrice, setShowSilverPrice] = useState(true)
  
  const currentTimeframe = timeframes.find(tf => tf.key === selectedTimeframe) || timeframes[2]
  
  // Use useMemo with a fixed seed to ensure consistent data between server and client
  const chartData = useMemo(() => {
    const seed = currentTimeframe.points * 1000
    return generateMockData(currentTimeframe.points, seed)
  }, [currentTimeframe.points])
  
  const currentPrice = chartData[chartData.length - 1].value
  const previousPrice = chartData[0].value
  const priceChange = currentPrice - previousPrice
  const percentageChange = ((priceChange / previousPrice) * 100).toFixed(2)
  const isPositive = priceChange >= 0
  
  const minPrice = Math.min(...chartData.map(d => d.value))
  const maxPrice = Math.max(...chartData.map(d => d.value))

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(Math.round(price))
  }

  return (
    <section className="relative bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 py-20 sm:py-32" id="live-chart">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <motion.h2
            className="text-3xl font-bold tracking-tight text-white sm:text-4xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {t('liveChart.title')}
          </motion.h2>
          <motion.p
            className="mt-4 text-lg text-gray-400"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {t('liveChart.description')}
          </motion.p>
        </div>

        <motion.div
          className="mx-auto mt-12 max-w-4xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="overflow-hidden rounded-3xl border border-gray-700/50 bg-gradient-to-br from-gray-800/80 to-gray-900/80 p-6 backdrop-blur-sm sm:p-8">
            {/* Price header */}
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-400">
                {t('liveChart.priceLabel')}
              </p>
              <div className="mt-2 flex items-baseline justify-between">
                <div className="flex items-baseline gap-3">
                  <p className="text-3xl font-bold text-white sm:text-4xl">
                    {formatPrice(currentPrice)}
                  </p>
                  <div className={`flex items-center gap-1 ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      {isPositive ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                      )}
                    </svg>
                    <span className="text-lg font-bold">{Math.abs(Number(percentageChange))}%</span>
                  </div>
                </div>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                {t('liveChart.equivalent')}
              </p>
            </div>

            {/* Chart */}
            <div className="mb-6 h-[150px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorPv" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#FAB819" stopOpacity={1} />
                      <stop offset="100%" stopColor="#FFD88E" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#EFBD3B"
                    strokeWidth={2}
                    fill="url(#colorPv)"
                    fillOpacity={0.1}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Min/Max prices */}
            <div className="mb-6 flex items-center gap-4 border-t border-gray-700/50 pt-4">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-400">{formatPrice(minPrice)}</p>
                <p className="text-xs text-gray-500">{t('liveChart.lowest')}</p>
              </div>
              <div className="h-8 w-px bg-gray-700/50" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-400">{formatPrice(maxPrice)}</p>
                <p className="text-xs text-gray-500">{t('liveChart.highest')}</p>
              </div>
            </div>

            {/* Timeframe filters */}
            <div className="flex flex-wrap gap-2">
              {timeframes.map((timeframe) => {
                const isSelected = selectedTimeframe === timeframe.key
                return (
                  <button
                    key={timeframe.key}
                    onClick={() => setSelectedTimeframe(timeframe.key)}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                      isSelected
                        ? 'bg-gray-700 text-white shadow-lg'
                        : 'border border-gray-700 text-gray-400 hover:border-gray-600 hover:text-gray-300'
                    }`}
                  >
                    {timeframe.label}
                  </button>
                )
              })}
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  )
}

