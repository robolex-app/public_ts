import { InferBad, InferGood, InferInput, InferMeta, MetaObj, after, bad, good } from '../../index.js'
import { assertEqual } from '../typeTestUtils.js'

const coerceNumber = (input: string | number) => {
  if (typeof input === 'string') {
    const parsed = Number(input)

    if (Number.isNaN(parsed)) {
      return bad('is NaN')
    }

    return good(parsed)
  }

  if (typeof input === 'number') {
    return good(input)
  }

  return bad('neither string nor number')
}

const positive = (input: number) => {
  if (input > 0) {
    return [true, input] as const
  }

  return [false, 'not positive'] as const
}

const combined = after(coerceNumber, positive)

type InferredGood = InferGood<typeof combined>
type InferredBad = InferBad<typeof combined>
type InferredInput = InferInput<typeof combined>
type InferredMeta = InferMeta<typeof combined>

assertEqual<InferredGood, number>(true)
assertEqual<InferredBad, 'not positive' | 'is NaN' | 'neither string nor number'>(true)
assertEqual<InferredInput, string | number>(true)
assertEqual<
  InferredMeta,
  MetaObj<{
    type: 'after'
    first: typeof coerceNumber
    second: typeof positive
  }>
>(true)

// @ts-expect-error - Test: boolean not allowed
combined(true)
