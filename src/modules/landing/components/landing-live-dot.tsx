'use client'

import { motion } from 'framer-motion'

/** Small “live” indicator in the hero meta row (replaces CSS-only pulse). */
export function LandingLiveDot() {
  return (
    <motion.span
      className="dot"
      aria-hidden
      animate={{ scale: [1, 1.25, 1], opacity: [1, 0.85, 1] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}
