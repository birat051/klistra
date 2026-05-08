import { CanvasPage } from '@/modules/canvas/components/canvas-page'

interface I_ROOM_PageProps {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: I_ROOM_PageProps) {
  const { id } = await params
  return <CanvasPage roomId={id} />
}
