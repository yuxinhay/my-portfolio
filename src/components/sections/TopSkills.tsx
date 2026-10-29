import { skillGroups as defaultGroups, topSkills as defaultTop } from '../../content/skills'
import type { SkillGroup } from '../../content/skills'
import { Heading } from '../ui/Heading'
import { Tag } from '../ui/Tag'
import { TEXT_RECIPES, cx } from '../ui/styles'
import { WrappedSection } from './WrappedSection'

export interface TopSkillsProps {
  groups?: readonly SkillGroup[]
  /** Headline skill names, shown as a numbered top list above the full groups. */
  top?: readonly string[]
}

/**
 * Wrapped-style "top" list of headline skills, then every skill in grouped lists (an h3 per
 * group). Skills have no proficiency levels, so nothing is conveyed by colour or size alone.
 */
export function TopSkills({ groups = defaultGroups, top = defaultTop }: TopSkillsProps) {
  return (
    <WrappedSection id="skills" scene="pink" title="Top skills">
      {top.length > 0 && (
        <ol
          aria-label="Headline skills"
          className={cx(
            TEXT_RECIPES.h1,
            'grid list-inside list-decimal gap-2 marker:text-scene-accent',
          )}
        >
          {top.map((name) => (
            <li key={name}>{name}</li>
          ))}
        </ol>
      )}
      <div className="grid gap-8 md:grid-cols-2">
        {groups.map(({ id, title, skills }) => (
          <div key={id} className="grid content-start gap-3">
            <Heading level={3} id={`skills-${id}`}>
              {title}
            </Heading>
            <ul aria-labelledby={`skills-${id}`} className="flex flex-wrap gap-2">
              {skills.map(({ name, detail }) => (
                <li key={name}>
                  <Tag>{detail ? `${name} (${detail})` : name}</Tag>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </WrappedSection>
  )
}
