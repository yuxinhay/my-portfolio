import type { ReactNode } from 'react'

interface FoundationPageProps {
  title: string
  intro: ReactNode
  children: ReactNode
}

/** Page frame for a Foundations story: one `main` landmark and `h1`, on the default blush scene. */
export function FoundationPage({ title, intro, children }: FoundationPageProps) {
  return (
    <main className="scene-blush min-h-dvh px-6 py-10">
      <p className="text-eyebrow font-bold tracking-eyebrow uppercase">Foundations</p>
      <h1 className="mt-2 text-h1 leading-snug font-black tracking-heading">{title}</h1>
      <div className="mt-4 max-w-prose text-body">{intro}</div>
      <div className="mt-10 grid gap-12">{children}</div>
    </main>
  )
}

interface FoundationSectionProps {
  title: string
  children: ReactNode
}

export function FoundationSection({ title, children }: FoundationSectionProps) {
  return (
    <section className="grid gap-4">
      <h2 className="text-h2 leading-snug font-black tracking-heading">{title}</h2>
      {children}
    </section>
  )
}

/** Inline code-style token name. */
export function TokenName({ children }: { children: ReactNode }) {
  return <code className="font-semibold">{children}</code>
}
