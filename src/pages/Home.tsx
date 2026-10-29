import { GlanceIntro } from '../components/glance/GlanceIntro'
import { useDocumentTitle } from '../components/layout/useDocumentTitle'
import { Achievements } from '../components/sections/Achievements'
import { CareerPath } from '../components/sections/CareerPath'
import { Intro } from '../components/sections/Intro'
import { Projects } from '../components/sections/Projects'
import { TopSkills } from '../components/sections/TopSkills'

/**
 * The Career Wrapped story: full-bleed scenes in a fixed order. The intro holds the page's only
 * h1; every other section is named by its h2. The document title matches the "Work" nav item.
 * A first visit opens the At a glance intro over the page; the intro section can replay it.
 */
export function Home() {
  useDocumentTitle('Work')
  return (
    <>
      <Intro actions={<GlanceIntro />} />
      <TopSkills />
      <CareerPath />
      <Projects />
      <Achievements />
    </>
  )
}
