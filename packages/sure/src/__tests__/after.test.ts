import { describe, it, expect } from 'vitest'
import {
  good,
  sure,
  bad,
  Sure,
  after,
  MetaObj,
  MetaNever,
  pure,
  InferGoodRaw,
  InferBadRaw,
  InferInput,
  InferMeta,
} from '../index.js'
import { assertEqual, assertIs } from './typeTestUtils.js'

const sureNumber = (value: unknown) =>
  typeof value === 'number' //
    ? good(value)
    : bad('not number')

const positiveNum = (value: number) => {
  if (value > 0) {
    return [true, value] as const
  }

  return [false, 'not positive'] as const
}

const combined = after(sureNumber, positiveNum)

{
  type InferredGood = InferGoodRaw<typeof positiveNum>
  type InferredBad = InferBadRaw<typeof positiveNum>
  type InferredInput = InferInput<typeof positiveNum>
  type InferredMeta = InferMeta<typeof positiveNum>

  assertEqual<InferredGood, number>(true)
  assertEqual<InferredBad, 'not positive'>(true)
  assertEqual<InferredInput, number>(true)

  // TODO: Not liking this, should it by MetaNever by default?
  assertEqual<InferredMeta, MetaNever | MetaObj>(true)
}

{
  type InferredSure = typeof combined

  type InferredGood = InferGoodRaw<typeof combined>
  type InferredBad = InferBadRaw<typeof combined>
  type InferredInput = InferInput<typeof combined>
  type InferredMeta = InferMeta<typeof combined>

  assertEqual<InferredGood, number>(true)
  assertEqual<InferredBad, 'not positive' | 'not number'>(true)
  assertEqual<InferredInput, unknown>(true)
  assertEqual<
    InferredMeta,
    MetaObj<{
      first: typeof sureNumber
      second: typeof positiveNum
    }>
  >(true)
}

describe('after', () => {
  it('should correctly run', () => {
    const [ok, out] = combined(1)

    expect(ok).toBe(true)
    expect(out).toBe(1)

    {
      // DX checks
      assertIs<boolean>(ok)
      assertIs<number | 'not number' | 'not positive'>(out)

      if (ok) {
        assertIs<number>(out)
      } else {
        assertIs<'not number' | 'not positive'>(out)
      }
    }
  })
})
