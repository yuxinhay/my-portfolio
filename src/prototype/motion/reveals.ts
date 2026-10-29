// PROTOTYPE: scroll reveals. Content is only ever hidden by CSS keyed on the `proto-reveal` class,
// which this script adds once an IntersectionObserver exists, so without JS (or without the
// observer) nothing is hidden. Each element reveals once and stays revealed.

const SECTION = '[data-proto-section]'
const MAX_STAGGER = 6

/** The section's direct children; lists are split into their items so they stagger. */
function targetsIn(section: Element): HTMLElement[] {
  return [...section.children].flatMap((child) =>
    (child instanceof HTMLUListElement || child instanceof HTMLOListElement) &&
    child.children.length > 1
      ? ([...child.children] as HTMLElement[])
      : [child as HTMLElement],
  )
}

/**
 * Hides every reveal target under `root` until it scrolls into view. Returns a cleanup. `run`
 * labels the run (page and replay count) for debugging.
 */
export function startReveals(root: HTMLElement, run: string): () => void {
  root.dataset.protoRevealRun = run
  if (typeof IntersectionObserver === 'undefined') return () => {}

  const targets = [...root.querySelectorAll(SECTION)].flatMap((section) =>
    targetsIn(section).map((element, index) => {
      element.style.setProperty('--proto-i', String(Math.min(index, MAX_STAGGER)))
      element.classList.add('proto-reveal', 'is-instant')
      return element
    }),
  )
  // Hide without animating (e.g. on "Replay"), then let later changes transition.
  void root.offsetHeight
  targets.forEach((element) => element.classList.remove('is-instant'))

  const reveal = (element: Element) => element.classList.add('is-revealed')
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        // Content already scrolled past (e.g. after a #hash jump) is shown without animating later.
        if (!entry.isIntersecting && entry.boundingClientRect.bottom > 0) continue
        reveal(entry.target)
        observer.unobserve(entry.target)
      }
    },
    { rootMargin: '0px 0px -10% 0px' },
  )
  targets.forEach((element) => observer.observe(element))

  // Keyboard users can tab into content before it scrolls in; show it at once.
  const onFocusIn = (event: FocusEvent) => {
    const target = event.target instanceof Element ? event.target.closest('.proto-reveal') : null
    if (target) reveal(target)
  }
  document.addEventListener('focusin', onFocusIn)

  return () => {
    observer.disconnect()
    document.removeEventListener('focusin', onFocusIn)
    targets.forEach((element) => {
      element.classList.remove('proto-reveal', 'is-revealed')
      element.style.removeProperty('--proto-i')
    })
  }
}
