interface I_CANVAS_CanvasPageProps {
  roomId: string
}

export function CanvasPage({ roomId }: I_CANVAS_CanvasPageProps) {
  return (
    <div className="min-h-full bg-zinc-100 p-8 dark:bg-zinc-900">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Canvas</h1>
      <p className="mt-2 font-mono text-sm text-zinc-600 dark:text-zinc-400">Room id: {roomId}</p>
    </div>
  )
}
