'use client'

import { CANVAS_NOTE_COLOR_SWATCHES } from '@/modules/canvas/constants/canvas-note-swatches'

import './color-picker.css'

export interface I_CANVAS_ColorPickerProps {
  value: string
  onChange: (hex: string) => void
  /** Accessible name for the swatch `role="group"` (design: “Note color”). */
  groupAriaLabel?: string
}

export function ColorPicker({
  value,
  onChange,
  groupAriaLabel = 'Note color',
}: I_CANVAS_ColorPickerProps) {
  return (
    <div className="cv-edit-toolbar__colors" role="group" aria-label={groupAriaLabel}>
      {CANVAS_NOTE_COLOR_SWATCHES.map((hex, i) => (
        <button
          key={hex}
          type="button"
          className="cv-swatch"
          style={{ background: hex }}
          aria-label={`Note color ${i + 1}`}
          aria-pressed={value === hex}
          onClick={() => onChange(hex)}
        />
      ))}
    </div>
  )
}
