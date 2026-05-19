'use client'

import type { ReactNode } from 'react'

export interface I_CANVAS_EditorToolbarButtonProps {
  label: string
  isActive?: boolean
  onClick?: () => void
  children: ReactNode
}

export function EditorToolbarButton({
  label,
  isActive,
  onClick,
  children,
}: I_CANVAS_EditorToolbarButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      className={isActive ? 'is-active' : undefined}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
