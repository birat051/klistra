'use client'

import { motion, type HTMLMotionProps } from 'framer-motion'

export type ILandingMotionSectionProps = Omit<
  HTMLMotionProps<'section'>,
  'initial' | 'whileInView' | 'viewport' | 'transition'
>

export function LandingMotionSection({ children, ...props }: ILandingMotionSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
      {...props}
    >
      {children}
    </motion.section>
  )
}
