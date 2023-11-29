import { as } from 'vitest/dist/reporters-5f784f42.js'
import { InferBadRaw, InferGoodRaw, InferInput, InferMeta, MetaNever, MetaObj, Sure } from '../../core.js'
import { assertEqual } from '../typeTestUtils.js'

{
  const rawNumber = (value: unknown) => {
    if (typeof value === 'number') {
      return [true, value] as const
    }

    return [false, 'not a number'] as const
  }

  // Satisfies shoudl work
  const satisfied = rawNumber satisfies Sure

  type InferredGood = InferGoodRaw<typeof satisfied>
  type InferredBad = InferBadRaw<typeof satisfied>
  type InferredInput = InferInput<typeof satisfied>
  type InferredMeta = InferMeta<typeof satisfied>

  assertEqual<InferredGood, number>(true)
  assertEqual<InferredBad, 'not a number'>(true)
  assertEqual<InferredInput, unknown>(true)
  assertEqual<InferredMeta, MetaNever | MetaObj>(true)
}

{
  const twoBads = (value: unknown) => {
    if (typeof value !== 'number') {
      return [false, 'not a number'] as const
    }

    if (value < 0) {
      return [false, 'negative'] as const
    }

    return [true, value] as const
  }

  // Satisfies shoudl work
  const satisfied = twoBads satisfies Sure

  type InferredGood = InferGoodRaw<typeof satisfied>
  type InferredBad = InferBadRaw<typeof satisfied>
  type InferredInput = InferInput<typeof satisfied>
  type InferredMeta = InferMeta<typeof satisfied>

  assertEqual<InferredGood, number>(true)
  assertEqual<InferredBad, 'not a number' | 'negative'>(true)
  assertEqual<InferredInput, unknown>(true)
  assertEqual<InferredMeta, MetaNever | MetaObj>(true)
}

{
  // Direct usage (no satisfies)
  const twoBads = (value: unknown) => {
    if (typeof value !== 'number') {
      return [false, 'not a number'] as const
    }

    if (value < 0) {
      return [false, 'negative'] as const
    }

    return [true, value] as const
  }

  type InferredGood = InferGoodRaw<typeof twoBads>
  type InferredBad = InferBadRaw<typeof twoBads>
  type InferredInput = InferInput<typeof twoBads>
  type InferredMeta = InferMeta<typeof twoBads>

  assertEqual<InferredGood, number>(true)
  assertEqual<InferredBad, 'not a number' | 'negative'>(true)
  assertEqual<InferredInput, unknown>(true)
  assertEqual<InferredMeta, MetaNever | MetaObj>(true)

  // use extends to check non strict equality
}

{
  // Direct usage (no satisfies)
  const badFunc = (value: unknown) => {
    if (typeof value !== 'number') {
      return [false, 'not a number'] as const
    }

    if (value < 0) {
      return [false, 'negative'] as const
    }

    // accidentaly didn't return the first argument
    return [value] as const
  }

  // badFunc doesn't satisfy Sure constraint
  type InferredGood = InferGoodRaw<
    // @ts-expect-error
    typeof badFunc
  >
  type InferredBad = InferBadRaw<
    // @ts-expect-error
    typeof badFunc
  >
  type InferredInput = InferInput<
    // @ts-expect-error
    typeof badFunc
  >
  type InferredMeta = InferMeta<
    // @ts-expect-error
    typeof badFunc
  >
}

{
  // It's acceptable to always return a bad value
  const badFunc = (value: unknown) => {
    if (typeof value !== 'number') {
      return [false, 'not a number'] as const
    }

    if (value < 0) {
      return [false, 'negative'] as const
    }

    // Accidentaly used `false` instead of `true`
    return [false, value] as const
  }

  // badFunc doesn't satisfy Sure constraint
  type InferredGood = InferGoodRaw<typeof badFunc>
  type InferredBad = InferBadRaw<typeof badFunc>
  type InferredInput = InferInput<typeof badFunc>
  type InferredMeta = InferMeta<typeof badFunc>

  assertEqual<InferredGood, never>(true)
  assertEqual<InferredBad, 'not a number' | 'negative' | number>(true)
  assertEqual<InferredInput, unknown>(true)
  assertEqual<InferredMeta, MetaNever | MetaObj>(true)
}

{
  // It's ok to combine several validators
  const rawNum = (value: unknown) => {
    if (typeof value !== 'number') {
      return [false, 'not a number'] as const
    }

    return [true, value] as const
  }

  const positive = (value: unknown) => {
    const [ok, out] = rawNum(value)

    assertEqual<typeof out, number | 'not a number'>(true)

    if (!ok) {
      assertEqual<typeof out, 'not a number'>(true)

      return [false, out] as const
    }

    if (out < 0) {
      return [false, 'negative'] as const
    }

    return [true, out] as const
  }

  type InferredGood = InferGoodRaw<typeof positive>
  type InferredBad = InferBadRaw<typeof positive>
  type InferredInput = InferInput<typeof positive>
  type InferredMeta = InferMeta<typeof positive>

  assertEqual<InferredGood, number>(true)
  assertEqual<InferredBad, 'not a number' | 'negative'>(true)
  assertEqual<InferredInput, unknown>(true)
  assertEqual<InferredMeta, MetaNever | MetaObj>(true)
}

{
  // It's ok to return a validator in the return value
  const positiveNum = (value: number) => {
    if (value < 0) {
      return [false, 'negative'] as const
    }

    return [true, value] as const
  }

  const positive = (value: unknown) => {
    if (typeof value !== 'number') {
      return [false, 'not a number'] as const
    }

    return positiveNum(value)
  }

  type InferredGood = InferGoodRaw<typeof positive>
  type InferredBad = InferBadRaw<typeof positive>
  type InferredInput = InferInput<typeof positive>
  type InferredMeta = InferMeta<typeof positive>

  assertEqual<InferredGood, number>(true)
  assertEqual<InferredBad, 'not a number' | 'negative'>(true)
  assertEqual<InferredInput, unknown>(true)
  assertEqual<InferredMeta, MetaNever | MetaObj>(true)
}
