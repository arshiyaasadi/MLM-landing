'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Popover,
  PopoverButton,
  PopoverBackdrop,
  PopoverPanel,
} from '@headlessui/react'
import { AnimatePresence, motion } from 'framer-motion'

import { Button } from '@/components/Button'
import { Container } from '@/components/Container'
import { useTranslation } from '@/hooks/useTranslation'

function MenuIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M5 6h14M5 18h14M5 12h14"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ChevronUpIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M17 14l-5-5-5 5"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function MobileNavLink(
  props: Omit<
    React.ComponentPropsWithoutRef<typeof PopoverButton<typeof Link>>,
    'as' | 'className'
  >,
) {
  return (
    <PopoverButton
      as={Link}
      className="block text-base/7 tracking-tight text-white hover:text-gray-300"
      {...props}
    />
  )
}

export function Header() {
  const t = useTranslation()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav
        className={`transition-all duration-300 ${
          isScrolled
            ? 'bg-gray-900/80 backdrop-blur-lg shadow-lg shadow-black/10'
            : 'bg-transparent'
        }`}
      >
        <Container className="relative z-50 flex justify-between py-4">
          {/* Logo - Right side */}
          <div className="relative z-10 flex items-center">
            <Link href="/" aria-label="Home" className="flex items-center gap-2">
              <span className="text-xl font-bold text-white">MLM</span>
            </Link>
          </div>

          {/* Center menu - Desktop */}
          <div className="hidden items-center lg:flex lg:gap-8">
            <Link
              href="#home"
              className="text-sm font-medium text-white transition-colors hover:text-gray-300"
            >
              {t('header.home')}
            </Link>
            <Link
              href="#features"
              className="text-sm font-medium text-white transition-colors hover:text-gray-300"
            >
              {t('header.features')}
            </Link>
            <Link
              href="#live-chart"
              className="text-sm font-medium text-white transition-colors hover:text-gray-300"
            >
              {t('header.chart')}
            </Link>
            <Link
              href="#mlm-engine"
              className="text-sm font-medium text-white transition-colors hover:text-gray-300"
            >
              {t('header.mlmEngine')}
            </Link>
            <Link
              href="#pools"
              className="text-sm font-medium text-white transition-colors hover:text-gray-300"
            >
              {t('header.pools')}
            </Link>
            <Link
              href="#funds"
              className="text-sm font-medium text-white transition-colors hover:text-gray-300"
            >
              {t('header.funds')}
            </Link>
            <Link
              href="#faqs"
              className="text-sm font-medium text-white transition-colors hover:text-gray-300"
            >
              {t('header.faqs')}
            </Link>
          </div>

          {/* CTA Button - Left side */}
          <div className="flex items-center gap-6">
            <Popover className="lg:hidden">
              {({ open }) => (
                <>
                  <PopoverButton
                    className="relative z-10 -m-2 inline-flex items-center rounded-lg stroke-white p-2 hover:bg-white/10 focus:not-data-focus:outline-hidden"
                    aria-label="Toggle navigation"
                  >
                    {({ open }) =>
                      open ? (
                        <ChevronUpIcon className="h-6 w-6" />
                      ) : (
                        <MenuIcon className="h-6 w-6" />
                      )
                    }
                  </PopoverButton>
                  <AnimatePresence initial={false}>
                    {open && (
                      <>
                        <PopoverBackdrop
                          static
                          as={motion.div}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="fixed inset-0 z-0 bg-black/60 backdrop-blur-sm"
                        />
                        <PopoverPanel
                          static
                          as={motion.div}
                          initial={{ opacity: 0, y: -32 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{
                            opacity: 0,
                            y: -32,
                            transition: { duration: 0.2 },
                          }}
                          className="absolute inset-x-0 top-0 z-0 origin-top rounded-b-2xl border border-gray-700/50 bg-gray-900/95 px-6 pt-32 pb-6 shadow-2xl backdrop-blur-lg"
                        >
                          <div className="space-y-4">
                            <MobileNavLink href="#home">
                              {t('header.home')}
                            </MobileNavLink>
                            <MobileNavLink href="#features">
                              {t('header.features')}
                            </MobileNavLink>
                            <MobileNavLink href="#live-chart">
                              {t('header.chart')}
                            </MobileNavLink>
                            <MobileNavLink href="#mlm-engine">
                              {t('header.mlmEngine')}
                            </MobileNavLink>
                            <MobileNavLink href="#pools">
                              {t('header.pools')}
                            </MobileNavLink>
                            <MobileNavLink href="#funds">
                              {t('header.funds')}
                            </MobileNavLink>
                            <MobileNavLink href="#faqs">
                              {t('header.faqs')}
                            </MobileNavLink>
                          </div>
                          <div className="mt-8">
                            <Button
                              href="/login"
                              variant="outline"
                              className="w-full border-gray-600 text-white hover:bg-white/10"
                            >
                              {t('header.login')}
                            </Button>
                          </div>
                        </PopoverPanel>
                      </>
                    )}
                  </AnimatePresence>
                </>
              )}
            </Popover>
            <div className="max-lg:hidden">
              <Button
                href="/login"
                variant="outline"
                className="border-gray-600 text-white hover:bg-white/10"
              >
                {t('header.login')}
              </Button>
            </div>
          </div>
        </Container>
      </nav>
    </header>
  )
}
