import { redirect } from 'next/navigation'

import { LANDING_DEFAULT_LOCALE } from '@/modules/landing/landing-i18n'

export default function HomePage() {
  redirect(`/${LANDING_DEFAULT_LOCALE}`)
}
