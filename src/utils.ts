import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const DEFAULT_DURATION = 1500

export const fx = {
  fadeUp: {
    opacity: [0, 1],
    translateY: ['4rem', '0%'],
    duration: DEFAULT_DURATION,
    ease: 'outExpo',
  },

  fadeIn: {
    opacity: [0, 1],
    scale: [0.9, 1],
    duration: DEFAULT_DURATION,
    ease: 'outExpo',
  },

  fadeOut: {
    opacity: [1, 0],
    scale: [1, 0.9],
    duration: DEFAULT_DURATION,
    ease: 'inExpo',
  },
}
