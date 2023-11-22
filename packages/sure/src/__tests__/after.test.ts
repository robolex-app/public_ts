import { describe, it, expect } from 'vitest'
import { good, sure, bad, Sure, after, MetaObj, Pure, MetaNever, pure } from '../index.js'
import { assertEqual, assertIs } from './typeTestUtils.js'

const sureNumber = pure(v =>
  typeof v === 'number' //
    ? good(v)
    : bad('---' as const)
)

describe('after', () => {
  it('should return good value', () => {
    const something = after(sureNumber, val => {
      assertIs<number>(val)

      if (val > 10) {
        return good('big' as const)
      }

      return bad('small' as const)
    })

    // This is not good
    assertEqual<
      typeof something,
      Sure<
        '---' | 'small',
        'big',
        unknown,
        MetaObj<{
          first: Pure<'---', number, unknown>
          second: Pure<'small', 'big', number>
        }>
      >
    >(true)
  })
})
