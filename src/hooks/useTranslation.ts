'use client'

import faTranslations from '@/locales/fa.json'

type TranslationKeys = typeof faTranslations
type DotPrefix<T extends string> = T extends '' ? '' : `.${T}`
type DotNestedKeys<T> = (T extends object
  ? {
      [K in Exclude<keyof T, symbol>]: `${K}${DotPrefix<
        DotNestedKeys<T[K]>
      >}`
    }[Exclude<keyof T, symbol>]
  : '') extends infer D
  ? Extract<D, string>
  : never

type TranslationPath = DotNestedKeys<TranslationKeys> | string

export function useTranslation() {
  const t = (key: TranslationPath): string | any => {
    const keys = key.split('.')
    let value: any = faTranslations

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        console.warn(`Translation key not found: ${key}`)
        return key
      }
    }

    return typeof value === 'string' ? value : value
  }

  return t
}

