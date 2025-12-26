'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

import { Container } from '@/components/Container'
import { Logomark } from '@/components/Logo'
import { useTranslation } from '@/hooks/useTranslation'

const socialLinks = [
  {
    name: 'Telegram',
    href: '#',
    icon: (
      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18.717-2.146 10.128-2.146 10.128s-.18.717-.896.717c-.359 0-.717-.18-.897-.359l-3.941-2.866-2.146-1.434-3.223-1.075c-.359-.18-.538-.538-.18-.897.18-.18.359-.359.717-.359l13.167-5.025c.538-.18 1.075.18.897.896z"/>
      </svg>
    ),
  },
  {
    name: 'Instagram',
    href: '#',
    icon: (
      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
  },
  {
    name: 'Twitter',
    href: '#',
    icon: (
      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
]

export function Footer() {
  const t = useTranslation()
  
  return (
    <footer className="border-t border-gray-800 bg-gray-900">
      <Container>
        <div className="py-16">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Logo and description */}
            <div>
              <div className="flex items-center text-white">
                <Logomark className="h-10 w-auto flex-none fill-gray-400" />
              </div>
            </div>

            {/* Quick links */}
            <div>
              <h3 className="text-sm font-semibold text-white">{t('footer.quickLinks')}</h3>
              <ul className="mt-4 space-y-3">
                <li>
                  <Link
                    href="#"
                    className="text-sm text-gray-400 transition-colors hover:text-gray-300"
                  >
                    {t('footer.whitepaper')}
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-gray-400 transition-colors hover:text-gray-300"
                  >
                    {t('footer.terms')}
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-gray-400 transition-colors hover:text-gray-300"
                  >
                    {t('footer.support')}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Social links */}
            <div>
              <h3 className="text-sm font-semibold text-white">{t('footer.social')}</h3>
              <div className="mt-4 flex gap-4">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    className="group relative flex h-12 w-12 items-center justify-center rounded-lg border border-gray-700 text-gray-400 transition-all hover:border-gray-500 hover:text-white"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div
                      className="absolute inset-0 rounded-lg bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 opacity-0 transition-opacity group-hover:opacity-100"
                      animate={{
                        boxShadow: [
                          '0 0 0px rgba(16, 185, 129, 0)',
                          '0 0 20px rgba(16, 185, 129, 0.3)',
                          '0 0 0px rgba(16, 185, 129, 0)',
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <span className="relative">{social.icon}</span>
                  </motion.a>
                ))}
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-12 border-t border-gray-800 pt-8">
            <p className="text-center text-sm text-gray-500">
              {t('footer.copyright')}
            </p>
          </div>
        </div>
      </Container>
    </footer>
  )
}
