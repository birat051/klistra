import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'

import { getServerAuthToken } from '@/common/utils/get-server-auth-token'
import { isKlistraLocale } from '@/common/i18n/klistra-locales'
import { fetchCollaboratingRooms, fetchOwnedRooms } from '@/modules/dashboard/api/room-api'
import { DashboardLayout } from '@/modules/dashboard/components/dashboard-layout'

interface I_DashboardPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: I_DashboardPageProps): Promise<Metadata> {
  const { locale: raw } = await params
  if (!isKlistraLocale(raw)) {
    return {}
  }
  const title = raw === 'sv' ? 'Klistra — dina ytor' : 'Klistra — your canvases'
  return { title }
}

export default async function Page({ params }: I_DashboardPageProps) {
  const { locale: raw } = await params
  if (!isKlistraLocale(raw)) {
    notFound()
  }
  const locale = raw

  const token = await getServerAuthToken()
  if (!token) {
    redirect(`/${locale}`)
  }

  const [owned, collaborating] = await Promise.all([
    fetchOwnedRooms(token.uid),
    fetchCollaboratingRooms(token.uid),
  ])

  const displayName =
    typeof token.name === 'string' && token.name.trim()
      ? token.name.trim()
      : typeof token.email === 'string'
        ? (token.email.split('@')[0] ?? 'You')
        : 'You'

  return (
    <DashboardLayout
      locale={locale}
      userDisplayName={displayName}
      userEmail={token.email}
      owned={owned}
      collaborating={collaborating}
    />
  )
}
