import type { ReactNode } from 'react'
import { SCENES } from '../components/ui/styles'
import type { SceneName } from '../components/ui/styles'

interface AllScenesProps {
  /** Rendered once per scene. Use the function form when the content needs unique ids. */
  children: ReactNode | ((scene: SceneName) => ReactNode)
}

/** Renders a story's content in each of the four scenes, so every variant is seen on every surface. */
export function AllScenes({ children }: AllScenesProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {SCENES.map((scene) => (
        <section
          key={scene}
          aria-label={`${scene} scene`}
          className={`scene-${scene} grid content-start justify-items-start gap-4 rounded-card p-6`}
        >
          <p className="text-eyebrow font-bold tracking-eyebrow uppercase">scene-{scene}</p>
          {typeof children === 'function' ? children(scene) : children}
        </section>
      ))}
    </div>
  )
}
