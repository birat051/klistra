'use server'

import { revalidatePath } from 'next/cache'

import { KLISTRA_LOCALES } from '@/common/i18n/klistra-locales'
import { getServerAuthToken } from '@/common/utils/get-server-auth-token'
import { createRoom } from '@/modules/dashboard/services/room-service'

export async function createDashboardRoom(name: string): Promise<{ ok: boolean; error?: string }> {
  const token = await getServerAuthToken()
  if (!token) {
    return { ok: false, error: 'auth' }
  }
  try {
    await createRoom(token.uid, name)
    for (const locale of KLISTRA_LOCALES) {
      revalidatePath(`/${locale}/dashboard`)
    }
    return { ok: true }
  } catch {
    return { ok: false, error: 'write' }
  }
}
