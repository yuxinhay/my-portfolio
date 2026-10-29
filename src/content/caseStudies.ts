import pbaFlowAccountSettings from '../assets/case-studies/preferred-bank-account/pba-flow-account-settings.webp'
import pbaFlowUpdateBankAccount from '../assets/case-studies/preferred-bank-account/pba-flow-update-bank-account.webp'
import pbaHifiBankAccountCard from '../assets/case-studies/preferred-bank-account/pba-hifi-bank-account-card.webp'
import pbaHifiUpdateStep from '../assets/case-studies/preferred-bank-account/pba-hifi-update-step.webp'
import pbaHifiWithdrawalConfirm from '../assets/case-studies/preferred-bank-account/pba-hifi-withdrawal-confirm.webp'
import pbaLofiAccountSettings from '../assets/case-studies/preferred-bank-account/pba-lofi-account-settings.webp'
import pbaLofiCoolingCard from '../assets/case-studies/preferred-bank-account/pba-lofi-cooling-card.webp'
import pbaLofiUpdateFlow from '../assets/case-studies/preferred-bank-account/pba-lofi-update-flow.webp'
import pbaLofiUpdateStep from '../assets/case-studies/preferred-bank-account/pba-lofi-update-step.webp'
import tablesFreezeColumnSpec from '../assets/case-studies/adaptive-tables/tables-freeze-column-spec.webp'
import tablesFreezeDecisionTree from '../assets/case-studies/adaptive-tables/tables-freeze-decision-tree.webp'
import tablesInsightSketch from '../assets/case-studies/adaptive-tables/tables-insight-sketch.webp'
import tablesLayoutAVsB from '../assets/case-studies/adaptive-tables/tables-layout-a-vs-b.webp'
import tablesProblemDesktop from '../assets/case-studies/adaptive-tables/tables-problem-desktop.webp'
import tablesProblemMobile from '../assets/case-studies/adaptive-tables/tables-problem-mobile.webp'
import tablesPrototypePoster from '../assets/case-studies/adaptive-tables/tables-prototype-poster.webp'
import tablesPrototype from '../assets/case-studies/adaptive-tables/tables-prototype.mp4'
import tablesSectioning from '../assets/case-studies/adaptive-tables/tables-sectioning.webp'
import tablesSketches from '../assets/case-studies/adaptive-tables/tables-sketches.webp'
import tablesWhiteboard from '../assets/case-studies/adaptive-tables/tables-whiteboard.webp'
import videoCallPaperMockups from '../assets/case-studies/in-app-video-call/video-call-paper-mockups.webp'
import videoCallPrioritisationMatrix from '../assets/case-studies/in-app-video-call/video-call-prioritisation-matrix.webp'
import videoCallProblemStatement from '../assets/case-studies/in-app-video-call/video-call-problem-statement.webp'
import videoCallProductVision from '../assets/case-studies/in-app-video-call/video-call-product-vision.webp'
import videoCallCallNowPoster from '../assets/case-studies/in-app-video-call/video-call-prototype-call-now-poster.webp'
import videoCallCallNow from '../assets/case-studies/in-app-video-call/video-call-prototype-call-now.mp4'
import videoCallQueuePoster from '../assets/case-studies/in-app-video-call/video-call-prototype-queue-poster.webp'
import videoCallQueue from '../assets/case-studies/in-app-video-call/video-call-prototype-queue.mp4'
import videoCallReschedulePoster from '../assets/case-studies/in-app-video-call/video-call-prototype-reschedule-poster.webp'
import videoCallReschedule from '../assets/case-studies/in-app-video-call/video-call-prototype-reschedule.mp4'
import type { Stat } from './achievements'

/**
 * Fields shared by images and videos. `src` comes from a Vite import, so the `/my-portfolio/` base
 * is applied at build time. `width` and `height` are the file's pixel size (checked against the
 * files in caseStudies.test.ts) and reserve the space before it loads.
 */
interface MediaBase {
  src: string
  /** Visible caption. For flow charts it also summarises the flow, which alt text cannot carry. */
  caption: string
  width: number
  height: number
  /**
   * The surface the media sits on. `dark` for drawings with light strokes on a transparent
   * background, which would vanish on the blush page.
   */
  background?: 'light' | 'dark'
}

export interface ImageMedia extends MediaBase {
  kind: 'image'
  /** What the image shows, for screen readers. */
  alt: string
  /** Also link to the image file, for diagrams too detailed to read at the column width. */
  fullSize?: boolean
}

export interface VideoMedia extends MediaBase {
  kind: 'video'
  /** Poster frame (WebP), shown before the video plays; same size as the video. */
  poster: string
  /** What happens in the video, in text: the alternative for video-only content (WCAG 1.2.1). */
  description: string
  /** A visible label above the video, e.g. "Prototype". */
  label?: string
}

export type Media = ImageMedia | VideoMedia

/** A paragraph, or a bulleted list. */
export type Block = string | { list: readonly string[] }

/**
 * How a group of media is laid out: `stack` one per row (default), `pair` two side by side from
 * `md` up (e.g. low and high fidelity), `grid` up to three per row, for phone-sized screens.
 */
export type MediaLayout = 'stack' | 'pair' | 'grid'

export interface CaseStudySection {
  heading: string
  body: readonly Block[]
  media?: readonly Media[]
  mediaLayout?: MediaLayout
}

/** Quotes from research or feedback sessions, shown as a numbered list. */
export interface Insights {
  /** e.g. "Insights from members" */
  heading: string
  /** The quotes as said, without quotation marks. */
  quotes: readonly string[]
}

export interface ProcessStep {
  title: string
  body: readonly Block[]
  insights?: Insights
  media?: readonly Media[]
  mediaLayout?: MediaLayout
}

export interface CaseStudy {
  /** Matches a slug in projects.ts, which holds the title, timeframe, status and card summary. */
  slug: string
  overview: {
    /** Yuxin's role, in full. */
    role: string
    /** Who else was involved, or a note on the role. */
    team?: string
  }
  /** The problem, or for the PM case studies, what the product or programme is. */
  problem: CaseStudySection
  process: CaseStudySection & { steps: readonly ProcessStep[] }
  solution?: CaseStudySection
  outcome?: CaseStudySection & { stats?: readonly Stat[] }
  lessons?: CaseStudySection
}

const DUMMY_DATA = 'All data in the screens is dummy data.'

export const caseStudies: readonly CaseStudy[] = [
  {
    slug: 'preferred-bank-account',
    overview: {
      role: 'Lead designer for the Preferred Bank Account (PBA) feature',
      team: 'Secondary designer on the related anti-scam features: verified contact details and withdrawal limits.',
    },
    problem: {
      heading: 'The problem',
      body: [
        "Scams targeting members' CPF savings were rising, especially against members aged 55 and above, who can withdraw a lump sum from their Retirement Account.",
        'The Preferred Bank Account was one of a set of anti-scam measures:',
        {
          list: [
            'Singpass face verification',
            'Verified contact details',
            'Withdrawal limits',
            'Preferred bank account',
          ],
        },
        'The anti-scam measures received local media recognition.',
      ],
    },
    process: {
      heading: 'Process',
      body: [DUMMY_DATA],
      steps: [
        {
          title: 'Flow charts and design grooming',
          body: [
            "The Product Owners' user stories were open to interpretation, so I built flow charts for the account settings flow and the update bank account flow, and ran a design grooming session with the Product Owners. The flow charts carry my open questions to them.",
          ],
          media: [
            {
              kind: 'image',
              src: pbaFlowAccountSettings,
              width: 1600,
              height: 1333,
              alt: 'Flow chart of the bank account section in account settings, with sticky notes of questions to the Product Owners.',
              caption:
                'Account settings flow. From the "Account settings" page the member goes to the "Bank account" section. If they have no PBA, show N/A and possibly a nudge message. If they have one and it is pending the 12-hour cooling period, show the previous PBA, disable "Update" and show a cooling message; otherwise show the PBA with "Update" enabled. My questions to the Product Owners sit beside each branch.',
              fullSize: true,
            },
            {
              kind: 'image',
              src: pbaFlowUpdateBankAccount,
              width: 1600,
              height: 1946,
              alt: 'Flow chart of the update bank account journey, from the cover page to the acknowledgement page.',
              caption:
                'Update bank account flow. The member clicks "Update", sees a cover page, agrees to the terms and passes an eligibility check (or is redirected). The bank options shown depend on whether they already have a PBA and are eligible for PayNow. They pick a preferred bank or enter another bank, then review the change with an alert about the cooling measure, submit, and see an acknowledgement with the current and updated values.',
              fullSize: true,
            },
          ],
        },
        {
          title: 'Low-fidelity mockups',
          body: ['The grooming sessions led to low-fidelity mockups of both flows.'],
          media: [
            {
              kind: 'image',
              src: pbaLofiAccountSettings,
              width: 1600,
              height: 711,
              background: 'dark',
              alt: 'Wireframes of the account settings page with the bank account card in three states: initial, cannot update during cooling, and after cooling.',
              caption:
                'Account settings: the bank account card in its initial state, while it cannot be updated during the cooling period, and after cooling.',
            },
            {
              kind: 'image',
              src: pbaLofiUpdateFlow,
              width: 1600,
              height: 372,
              background: 'dark',
              alt: 'Four wireframes in sequence: update bank account form, review page with a cooling alert, Singpass face validation, and acknowledgement.',
              caption:
                'Update flow: update the bank account, review it, verify with Singpass face validation, and see the acknowledgement.',
              fullSize: true,
            },
          ],
        },
        {
          title: 'High-fidelity: the bank account card',
          body: [
            'In account settings, the bank account card shows an alert during the cooling period and a "Pending activation" status, with "Update" disabled until the change is complete.',
          ],
          mediaLayout: 'pair',
          media: [
            {
              kind: 'image',
              src: pbaLofiCoolingCard,
              width: 934,
              height: 558,
              background: 'dark',
              alt: 'Wireframe of the bank account card during cooling: a warning alert, the current bank account details and a disabled button.',
              caption: 'Low fidelity: the card while the change is cooling.',
            },
            {
              kind: 'image',
              src: pbaHifiBankAccountCard,
              width: 934,
              height: 558,
              alt: 'High-fidelity bank account card: an alert says a change was requested and lists what happens next; the account shows "Pending activation" and the Update button is disabled.',
              caption: 'High fidelity: the alert explains the change, and the status is in text.',
            },
          ],
        },
        {
          title: 'High-fidelity: a step-by-step update',
          body: [
            'Updating the bank account is split into steps (select an account, then review, with Singpass Face Verification) to avoid information overload.',
          ],
          mediaLayout: 'pair',
          media: [
            {
              kind: 'image',
              src: pbaLofiUpdateStep,
              width: 934,
              height: 892,
              alt: 'Wireframe of the first update step: a progress indicator, the current bank account and fields to update it.',
              caption: 'Low fidelity: the first step of the update.',
            },
            {
              kind: 'image',
              src: pbaHifiUpdateStep,
              width: 934,
              height: 892,
              alt: 'High-fidelity "Update bank account" step 1 of 2: important notes about Singpass Face Verification and activation, the current account, and three options for the new account.',
              caption:
                'High fidelity: step 1 of 2, "Select account", before "Review". Important notes come first.',
            },
          ],
        },
        {
          title: 'Consistency across withdrawal forms',
          body: [
            'Every withdrawal form shows the preferred bank account in a "Confirm bank account" step: a miniature version of the settings card, so members see the same thing everywhere.',
          ],
          mediaLayout: 'pair',
          media: [
            {
              kind: 'image',
              src: pbaHifiBankAccountCard,
              width: 934,
              height: 558,
              alt: 'High-fidelity bank account card in account settings, showing the bank account with "Pending activation".',
              caption: 'The bank account card in account settings.',
            },
            {
              kind: 'image',
              src: pbaHifiWithdrawalConfirm,
              width: 947,
              height: 458,
              alt: 'High-fidelity "Confirm bank account" step of a withdrawal form, showing the bank account card with "Pending activation".',
              caption: 'Its miniature in the "Confirm bank account" step of a withdrawal form.',
            },
          ],
        },
      ],
    },
  },
  {
    slug: 'adaptive-tables',
    overview: {
      role: 'Designer',
      team: 'I spotted the problem during usability testing and raised it with the Product Owner.',
    },
    problem: {
      heading: 'The problem',
      body: [
        'During usability testing of another enhancement, users struggled to compare data in tables on mobile, scrolling horizontally again and again. One example is a housing-loan "Computation breakdown" that compares an HDB loan with a bank loan.',
        'How can we make tables on mobile screens more readable and user-friendly?',
      ],
      mediaLayout: 'pair',
      media: [
        {
          kind: 'image',
          src: tablesProblemDesktop,
          width: 1544,
          height: 1048,
          alt: 'A "Computation breakdown" page on a laptop: tables compare an HDB loan with a bank loan side by side.',
          caption: 'On desktop, the two loans sit side by side.',
        },
        {
          kind: 'image',
          src: tablesProblemMobile,
          width: 508,
          height: 1048,
          alt: 'The same page on a phone: the table is cut off after the first value column, with a horizontal scroll bar.',
          caption: 'On mobile, the comparison is hidden behind horizontal scrolling.',
        },
      ],
    },
    process: {
      heading: 'Process',
      body: [],
      steps: [
        {
          title: 'Sketching a wide range of ideas',
          body: [
            'Split tables, vertical scrolling, tap to open a modal, a responsive squeeze, a carousel, and an anchored or frozen column.',
          ],
          media: [
            {
              kind: 'image',
              src: tablesSketches,
              width: 1600,
              height: 986,
              background: 'dark',
              alt: 'Hand-drawn sketches of table ideas on phones: split tables, vertical scrolling, tap for a modal pop-up, responsive squeeze, carousel view, a frozen column and an anchored column.',
              caption: 'Early sketches of seven ways to show a table on a phone.',
            },
          ],
        },
        {
          title: 'Committing too early: freeze the first column',
          body: [
            'I committed too early to freezing the first column, wrote draft guidelines (a spec and a decision tree) and tested them with colleagues.',
            'The colleagues I tested it with had differing views on how readable and user-friendly the table was with one column frozen.',
          ],
          insights: {
            heading: 'Insights from colleagues',
            quotes: [
              'Hmm… I can see where you’re coming from but it makes the view more restrictive?',
              'Then what about desktop screens? It doesn’t make sense to freeze right?',
              'I think is more (user) friendly, can we choose which column to freeze?',
              'The view is still very small, like I still can’t see the full row of the table which is important if I were to read the table.',
            ],
          },
          media: [
            {
              kind: 'image',
              src: tablesFreezeColumnSpec,
              width: 606,
              height: 960,
              alt: 'Spec of a table with a frozen first column: a shadow spans the column height, and the frozen and first scrollable columns have equal width.',
              caption:
                'Draft spec: a shadow marks the frozen column, and the frozen and first scrollable columns share the width equally.',
            },
            {
              kind: 'image',
              src: tablesFreezeDecisionTree,
              width: 1600,
              height: 1575,
              alt: 'Decision tree for when a table column can be frozen.',
              caption:
                'Draft decision tree. A table with an action icon, a column span or no stub column cannot freeze; one with a stub column can freeze only if its total column width is wider than its container.',
              fullSize: true,
            },
            {
              kind: 'image',
              src: tablesWhiteboard,
              width: 1278,
              height: 960,
              alt: 'Whiteboard notes comparing a full-width table type with a scrollable, adjustable-width type, with rules for when columns can be frozen.',
              caption: 'Whiteboard notes on table types and freezing rules.',
            },
          ],
        },
        {
          title: 'Back to the problem',
          body: [
            'A traditional table is wider than it is tall; a phone is taller than it is wide. So the layout of the table itself has to change.',
          ],
          media: [
            {
              kind: 'image',
              src: tablesInsightSketch,
              width: 1600,
              height: 1435,
              background: 'dark',
              alt: 'Sketch comparing a traditional table, where width is greater than height, with a mobile phone, where height is greater than width.',
              caption:
                'The insight: a table is wider than tall, a phone is taller than wide. A traditional table cannot be used on a mobile screen; its layout must change.',
            },
          ],
        },
        {
          title: 'The adaptive table',
          body: [
            'I sectioned the table into categories laid out vertically, and compared two groupings. Layout A groups values by row header, for example "Loan amount" with the HDB and bank values together. Layout B groups them by loan type. I chose Layout A because it is better for comparison.',
          ],
          media: [
            {
              kind: 'image',
              src: tablesSectioning,
              width: 1600,
              height: 2290,
              background: 'dark',
              alt: 'Annotated tables showing two ways to section a table: by row header, with each comparison stacked under it, or by loan type.',
              caption:
                'Sectioning the table: (1) a row header such as "Downpayment" with comparison 1 and 2 beneath it, or (2) a section per loan type with every row inside it.',
              fullSize: true,
            },
            {
              kind: 'image',
              src: tablesLayoutAVsB,
              width: 1600,
              height: 772,
              alt: 'Layout A and Layout B side by side. Layout A groups cards by row header, such as Loan amount; Layout B groups them by loan type and is marked with a thumbs-down.',
              caption: 'Layout A (chosen) against Layout B, marked with a thumbs-down.',
            },
          ],
        },
      ],
    },
    solution: {
      heading: 'Solution',
      body: [
        'The adaptive table removes horizontal scrolling: each category is a section, and the values to compare sit together inside it.',
      ],
      media: [
        {
          kind: 'video',
          src: tablesPrototype,
          poster: tablesPrototypePoster,
          width: 436,
          height: 890,
          background: 'dark',
          label: 'Prototype video',
          caption: 'Prototype of the adaptive table on a phone.',
          description:
            'The "Computation breakdown" page scrolls vertically on a phone. Each row header, such as Loan amount, Interest rate and Downpayment, is a section with the HDB loan and bank loan values stacked inside it, so no horizontal scrolling is needed.',
        },
      ],
    },
    outcome: {
      heading: 'Outcome',
      body: [
        'Removed horizontal scrolling and improved the readability of tables on mobile, and produced design guidelines. No metrics were set for this work.',
      ],
    },
    lessons: {
      heading: 'Lessons',
      body: [
        'Don’t get attached to one idea early. After the feedback on the frozen column, going back to the problem led to the adaptive table.',
      ],
    },
  },
  {
    slug: 'in-app-video-call',
    overview: {
      role: 'Sole designer',
      team: 'I was the only designer: interviews, ideation and prototype.',
    },
    problem: {
      heading: 'The problem',
      body: [
        'The initial idea was to authenticate service calls between members, in the CPF mobile app, and CPF staff, as a measure against impersonation scams.',
        'In 2022, scam victims in Singapore lost a total of $660.7 million, and all of the top 5 scams involved impersonating legitimate organisations or individuals.',
      ],
      media: [
        {
          kind: 'image',
          src: videoCallProblemStatement,
          width: 1076,
          height: 651,
          alt: 'Problem statement slide: in 2022, scam victims in Singapore lost a total of $660.7 million; all of the top 5 scams involved impersonating legitimate organisations or individuals.',
          caption: 'The problem statement I started from.',
        },
      ],
    },
    process: {
      heading: 'Process',
      body: [],
      steps: [
        {
          title: 'Interviews: a twist',
          body: [
            'We interviewed members in person at a service centre, expecting to hear about scams and secure authentication. Instead, the members cared less about scams than about convenience.',
          ],
          insights: {
            heading: 'Insights from members',
            quotes: [
              'I want to understand how much I can withdraw so I know how much money to leave in my retirement account.',
              'I think it’s safer to come for 1-1 consultation in case I click something wrongly.',
              'Queue is so long in self-help lobby!',
              'I still require help from CPF staff for the available options for my monies.',
              'I prefer step-by-step instruction on how to withdraw funds online.',
              'I travelled about an hour to reach the nearest service centre from my house.',
            ],
          },
        },
        {
          title: 'Prioritising ideas',
          body: [
            'Three ideas went through a prioritisation matrix of potential against challenge: an in-app video call, app queue monitoring, and in-app appointment booking. The video call had the highest potential.',
          ],
          media: [
            {
              kind: 'image',
              src: videoCallPrioritisationMatrix,
              width: 1100,
              height: 1054,
              background: 'dark',
              alt: 'Prioritisation matrix with potential on the vertical axis and challenge on the horizontal axis. In-app video call is highest in potential, marked with stars; app queue monitoring is low in potential and higher in challenge; in-app appointment booking is low in both.',
              caption: 'Prioritisation matrix: the in-app video call has the highest potential.',
            },
          ],
        },
        {
          title: 'A product vision',
          body: [
            '“For CPF members who need help from our customer service executives, the CPF mobile app is a more seamless platform that provides communication and consultation; unlike existing multi-channels, the product offers omni-channel support with more emotional assurance and convenience.”',
          ],
          media: [
            {
              kind: 'image',
              src: videoCallProductVision,
              width: 1076,
              height: 610,
              alt: 'Product vision slide in a "For, who, the, is a, that provides, unlike, the product offers" template, with the same words as the vision statement.',
              caption: 'The product vision, in a fill-in template.',
            },
          ],
        },
        {
          title: 'Paper mock-ups, user stories and a prototype',
          body: [
            'I sketched paper mock-ups, wrote 4 user stories and built a high-fidelity prototype.',
          ],
          media: [
            {
              kind: 'image',
              src: videoCallPaperMockups,
              width: 1076,
              height: 588,
              alt: 'Eight hand-drawn phone screens in sequence: home, appointment form, online options, enquiry date and time, camera permission, waiting, video call with a staff member, and a permission request.',
              caption: 'Paper mock-ups of the video call journey.',
            },
          ],
        },
      ],
    },
    solution: {
      heading: 'Solution',
      body: [
        'Members log in with Singpass. They can video call a staff member now (camera permission, then a waiting queue that shows their place in line, the call, and feedback) or schedule, edit, reschedule or cancel an online appointment, ending on an acknowledgement page.',
        DUMMY_DATA,
      ],
      mediaLayout: 'grid',
      media: [
        {
          kind: 'video',
          src: videoCallCallNow,
          poster: videoCallCallNowPoster,
          width: 440,
          height: 888,
          background: 'dark',
          label: 'Prototype video',
          caption: 'Prototype: starting a video call.',
          description:
            'The member logs in with Singpass, opens the app menu, chooses Video call, taps "Make new video call appointment" and reaches the start of the form, which explains that they will need to turn on their camera.',
        },
        {
          kind: 'video',
          src: videoCallQueue,
          poster: videoCallQueuePoster,
          width: 444,
          height: 892,
          background: 'dark',
          label: 'Prototype video',
          caption: 'Prototype: waiting in the queue.',
          description:
            'The member chooses to call CPF staff now and allows the camera. A waiting screen shows their place in line moving from 4th to 2nd while they wait for an available staff member. After the call ends, a feedback screen appears.',
        },
        {
          kind: 'video',
          src: videoCallReschedule,
          poster: videoCallReschedulePoster,
          width: 438,
          height: 896,
          background: 'dark',
          label: 'Prototype video',
          caption: 'Prototype: rescheduling an appointment.',
          description:
            'From the list of upcoming appointments, the member edits one, picks a new enquiry type, date and time, and taps Reschedule. They review the details, agree to the disclaimer and confirm, and an acknowledgement page shows the appointment was successful.',
        },
      ],
    },
    outcome: {
      heading: 'Outcome',
      body: ['A concept only: it was not shipped, and there are no outcome metrics.'],
    },
  },
  {
    slug: 'flowcentral',
    overview: {
      role: 'Main Product Manager: strategy, use-case management, adoption and transition',
    },
    problem: {
      heading: 'The product',
      body: [
        'flowCentral is an internal agentic AI workflow management platform, built on top of open-source n8n. It adds governance and security, so staff can streamline their work.',
        'I owned its direction, use-case intake and prioritisation.',
      ],
    },
    process: {
      heading: 'How I managed it',
      body: [],
      steps: [
        {
          title: 'Use-case intake',
          body: [
            'I assessed 40+ use-case submissions, pipelined 24 use cases across 14 departments, and selected 3 flagship use cases.',
          ],
        },
        {
          title: 'Operating model',
          body: [
            'I helped set up a six-stage operating model:',
            {
              list: [
                'Submission',
                'Discovery',
                'Build',
                'Testing',
                'Operational readiness',
                'Portfolio management',
              ],
            },
          ],
        },
        {
          title: 'Senior management',
          body: [
            'I gave 2 presentations to senior management: one on the roadmap, onboarding, governance and reusable capabilities, and one on lessons for future AI products.',
          ],
        },
        {
          title: 'Adoption',
          body: [
            {
              list: [
                '3 roadshows, sharing sessions and an AI Day showcase',
                'User guides, a FAST onboarding model, onboarding journey maps and role-based onboarding materials',
                'A weekly knowledge-sharing segment I started for Forward Deployed Engineers and developers',
              ],
            },
          ],
        },
        {
          title: 'Transition',
          body: [
            'I led the transition plan for existing use cases, assessing each one for migration, pause or retirement, with communications for each group of stakeholders. I chose a planned transition over sunk-cost investment.',
          ],
        },
      ],
    },
    outcome: {
      heading: 'In numbers',
      body: [],
      stats: [
        { value: '40+', label: 'use-case submissions assessed' },
        { value: '24', label: 'use cases pipelined across 14 departments' },
        { value: '3', label: 'flagship use cases' },
        { value: '3', label: 'roadshows' },
      ],
    },
  },
  {
    slug: 'made-in-cpf',
    overview: {
      role: 'Programme Manager for Season 5',
      team: 'I also worked on Season 4.',
    },
    problem: {
      heading: 'The programme',
      body: [
        'Made-in-CPF (MIC) is an intrapreneurship programme: any staff member can sign up and team up to solve real workplace challenges, with protected time and curated workshops, all managed by me.',
      ],
    },
    process: {
      heading: 'How I managed it',
      body: [],
      steps: [
        {
          title: 'Redesigning the programme',
          body: [
            "I redesigned the programme from 7 months to 10 weeks, aligned to the organisation's AI direction, and co-presented the redesign to senior management, who supported it.",
          ],
        },
        {
          title: 'The openMIC portal',
          body: [
            'I vibe-coded the openMIC portal in about 1–2 weeks. Staff can learn about MIC, submit workplace problems, and browse, comment on and upvote them. I then redesigned it for participant recruitment.',
            {
              list: [
                'Multiple entry points',
                'Guidance on writing problem statements',
                'Warning modals before destructive actions',
                'Clear calls to action',
                'Acknowledgement checkpoints',
              ],
            },
          ],
        },
        {
          title: 'Vibe coding for participants',
          body: [
            'I introduced AI-assisted vibe coding to participants, after stress-testing it myself first.',
          ],
        },
        {
          title: 'After the programme',
          body: [
            'Projects progress from proof of concept to proof of value to live operations, with sponsor ownership (team lead and above), success measures and governance.',
          ],
        },
        {
          title: 'Running it',
          body: ['A structured communications rhythm, and a weekly intern sync and mentoring.'],
        },
      ],
    },
    outcome: {
      heading: 'In numbers',
      body: [],
      stats: [
        { value: '10 weeks', label: 'programme length, redesigned from 7 months' },
        { value: '22+', label: 'challenge submissions, narrowed to 7 challenges' },
        { value: '38', label: 'officers in 7 cross-functional teams' },
        { value: '1–2 weeks', label: 'to vibe-code the openMIC portal' },
      ],
    },
  },
]

/** The case study for a project slug, or `undefined` if there is none. */
export function findCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((study) => study.slug === slug)
}
