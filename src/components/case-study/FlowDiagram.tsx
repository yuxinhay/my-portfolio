import type { Flow, FlowBranch } from '../../content/caseStudies'
import { Text } from '../ui/Text'
import { TEXT_RECIPES, cx } from '../ui/styles'

export interface FlowDiagramProps {
  flow: Flow
}

/** "3a", "3b": the stage number and a letter per branch. */
const branchNumber = (stage: number, branch: number) =>
  `${stage}${String.fromCharCode(97 + branch)}`

/** Where a branch leads, in text, so the split never relies on the drawn lines. */
function BranchEnd({ branch, next }: { branch: FlowBranch; next: number }) {
  return (
    <Text variant="eyebrow" className="text-scene-accent">
      {branch.continues ? `Continues to stage ${next}` : 'Ends here'}
    </Text>
  )
}

function BranchLabel({ number, branch }: { number: string; branch: FlowBranch }) {
  return (
    <p className={TEXT_RECIPES.h3}>
      {number} {branch.label}
      {branch.title && `: ${branch.title}`}
    </p>
  )
}

const BADGE =
  'grid size-10 shrink-0 place-items-center rounded-pill bg-scene-fg font-black text-scene'

/**
 * A flow as an ordered list of stage cards, numbered in text and joined by lines. A stage with
 * branches holds them side by side in a nested list (stacked on small screens), each labelled in
 * text and saying whether the flow continues or ends there; the path that ends has a dashed edge,
 * and the line to the next stage drops from under the path that continues. The lines are
 * decorative and hidden from screen readers. Chosen by the owner over a timeline-rail layout.
 */
export function FlowDiagram({ flow }: FlowDiagramProps) {
  const { stages } = flow
  return (
    <ol aria-label={flow.label} className="grid">
      {stages.map(({ title, detail, branches }, index) => {
        const fromBranch = Boolean(stages[index - 1]?.branches)
        return (
          <li key={title} className="grid">
            {index > 0 && (
              <div aria-hidden="true" className="grid gap-4 px-6 md:grid-cols-2">
                <span
                  className={cx(
                    'mx-auto h-8 w-(--border-rule) bg-scene-fg',
                    fromBranch && 'md:col-start-2',
                  )}
                />
              </div>
            )}
            <div className="grid gap-4 rounded-card bg-scene-surface p-6">
              <p className={cx(TEXT_RECIPES.h3, 'flex items-center gap-3')}>
                <span className={BADGE}>{index + 1}</span>
                <span>{title}</span>
              </p>
              {detail && <Text>{detail}</Text>}
              {branches && (
                <ul className="grid gap-4 md:grid-cols-2">
                  {branches.map((branch, b) => (
                    <li
                      key={branch.label}
                      className={cx(
                        'grid content-start gap-3 rounded-sm border-(length:--border-rule) border-scene-fg p-4',
                        !branch.continues && 'border-dashed',
                      )}
                    >
                      <BranchLabel number={branchNumber(index + 1, b)} branch={branch} />
                      <Text>{branch.detail}</Text>
                      <BranchEnd branch={branch} next={index + 2} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
