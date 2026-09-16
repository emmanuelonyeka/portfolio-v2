import type { Belief } from '../types'

export const beliefs: Belief[] = [
  {
    num: 'I',
    title: 'Make trade-offs explicit',
    desc: 'I explain what a technical choice improves, what it costs, and where its limits are before building around it.',
  },
  {
    num: 'II',
    title: 'Test beyond the happy path',
    desc: 'Forms, navigation, keyboard flows, loading states, and small screens all need deliberate testing.',
  },
  {
    num: 'III',
    title: 'Trace the cause before rewriting',
    desc: 'I reproduce the failure, identify the constraint, and change the smallest part that solves it cleanly.',
  },
  {
    num: 'IV',
    title: 'Communicate scope early',
    desc: 'Requirements, revision limits, delivery assumptions, and handover expectations should be clear before implementation begins.',
  },
]

/** The client-facing summary of the four operating principles. */
export const beliefsQuote =
  'A polished interface earns attention. Reliable behavior, accessibility, and clean handover earn trust.'
