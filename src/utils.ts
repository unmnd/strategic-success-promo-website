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

    fadeUpOut: {
        opacity: 0,
        translateY: '-4rem',
        duration: DEFAULT_DURATION * 0.5,
        ease: 'inExpo',
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
        duration: DEFAULT_DURATION * 0.5,
        ease: 'inExpo',
    },
}

const format = new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
})
export const formatter = (value: number) => format.format(value / 100)

const formatterWhole = new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
})
export const formatWhole = (value: number) => formatterWhole.format(value / 100)

export const formatString = (value: number, currency: boolean = true) => {
    const negative = value < 0

    value /= currency ? 100 : 1 // Convert from pence to pounds
    value = Math.abs(value)

    let result = ''

    if (value < 1000) {
        result = value.toFixed(0)
    } else if (value < 10000) {
        result = (value / 1000).toFixed(1) + 'k'
    } else if (value < 1000000) {
        result = (value / 1000).toFixed(0) + 'k'
    } else if (value < 10000000) {
        result = (value / 1000000).toFixed(2) + 'm'
    } else if (value < 100000000) {
        result = (value / 1000000).toFixed(1) + 'm'
    } else if (value < 1000000000) {
        result = (value / 1000000).toFixed(0) + 'm'
    } else if (value < 10000000000) {
        result = (value / 1000000000).toFixed(2) + 'b'
    }

    if (currency) {
        result = '£' + result
    }

    if (negative) {
        result = '-' + result
    }

    return result
}

export function colouredIcon(colour: string, icon: string) {
    return ` <span>
              <span style="width: 0.5em; height: 0.5em; background-color: ${colour}; border-radius: 50%; display: inline-block; vertical-align: middle;"></span>
              <i class="${icon}"></i>
          </span>`
}

export { toast } from 'vue-sonner'
