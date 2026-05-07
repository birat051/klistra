'use client'

import { motion } from 'framer-motion'

export function MotionSmoke() {
  return (
    <motion.p
      data-testid="motion-smoke"
      className="mt-4 rounded-full bg-emerald-500/15 px-3 py-1 text-sm font-medium text-emerald-800 dark:text-emerald-200"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 320, damping: 24 }}
    >
      Framer Motion is active
    </motion.p>
  )
}
