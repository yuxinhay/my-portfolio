// Placeholder shell styled with design tokens. Replaced by the routed layout in the layout-shell milestone.
const SCENES = [
  { scene: 'scene-pink', eyebrow: 'Your top skill', title: 'Interaction design' },
  { scene: 'scene-cobalt', eyebrow: 'Your career path', title: 'Design → Code' },
  { scene: 'scene-ink', eyebrow: 'Projects shipped', title: '12' },
] as const

function App() {
  return (
    <div className="scene-blush min-h-dvh">
      <a
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:rounded-sm focus:bg-scene focus:px-4 focus:py-2 focus:font-bold"
        href="#main"
      >
        Skip to main content
      </a>
      <header className="px-6 py-4">
        <p className="text-eyebrow font-bold tracking-eyebrow uppercase">Portfolio</p>
      </header>
      <main id="main" tabIndex={-1} className="mx-auto grid max-w-5xl gap-6 px-6 pb-12">
        <section className="py-8">
          <p className="text-eyebrow font-bold tracking-eyebrow uppercase">Your Career Wrapped</p>
          <h1 className="mt-2 text-display leading-tight font-black tracking-display">
            UX designer &amp; <span className="text-scene-accent">UI developer</span>
          </h1>
          <p className="mt-4 max-w-prose text-body">
            Portfolio coming soon: projects, achievements and skills.
          </p>
        </section>
        <div className="grid gap-6 md:grid-cols-3">
          {SCENES.map(({ scene, eyebrow, title }) => (
            <section key={scene} className={`${scene} rounded-card p-6`}>
              <h2 className="text-eyebrow font-bold tracking-eyebrow uppercase">{eyebrow}</h2>
              <p className="mt-6 text-h2 leading-snug font-black tracking-heading">{title}</p>
            </section>
          ))}
        </div>
      </main>
      <footer className="px-6 py-6 text-small">
        <p>Built with React, TypeScript, Vite and a token-driven design system.</p>
      </footer>
    </div>
  )
}

export default App
