// The owner's wordmark, kept apart from `site.ts` so the end-to-end specs, which run in Node and
// read `site`, never import an image.
import logoSrc from '../assets/brand/yuxin-logo.svg'

/** An image with its intrinsic size, reserved before it loads so nothing shifts. */
export interface Logo {
  src: string
  width: number
  height: number
}

/**
 * The header home link and At a glance card 1 show it. The SVG's viewBox is cropped to the
 * artwork, so the image has no empty space around it.
 */
export const logo: Logo = { src: logoSrc, width: 1818, height: 973 }
