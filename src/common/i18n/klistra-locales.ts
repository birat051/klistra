export const KLISTRA_LOCALES = ['en', 'sv'] as const
export type IKlistraLocale = (typeof KLISTRA_LOCALES)[number]

export const KLISTRA_DEFAULT_LOCALE: IKlistraLocale = 'en'

export function isKlistraLocale(value: string): value is IKlistraLocale {
  return (KLISTRA_LOCALES as readonly string[]).includes(value)
}
