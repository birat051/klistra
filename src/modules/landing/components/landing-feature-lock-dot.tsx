'use client'

import { motion } from 'framer-motion'

/** Presence lock indicator in the feature illustration (replaces CSS `pulse` on `.vfeat-lock-dot`). */
export function LandingFeatureLockDot() {
  return (
    <motion.span
      className="vfeat-lock-dot"
      animate={{ opacity: [1, 0.55, 1], scale: [1, 1.12, 1] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}
