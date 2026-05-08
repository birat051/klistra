import { LLMS_TXT } from '@/common/content/crawler-markdown'

export const dynamic = 'force-static'

export function GET(): Response {
  return new Response(LLMS_TXT, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  })
}
