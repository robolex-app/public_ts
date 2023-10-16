import { good, sure, evil, Sure, after } from '../index.js'
import { assertEqual, assertIs } from './typeTestUtils.js'

const sureNumber = sure(v =>
  typeof v === 'number' //
    ? good(v)
    : evil('---' as const)
)

describe('after', () => {
  it('should return good value', () => {
    const something = after(sureNumber, val => {
      assertIs<number>(val)

      if (val > 10) {
        return good('big' as const)
      }

      return evil('small' as const)
    })

    // This is not good
    assertEqual<
      typeof something,
      Sure<
        //
        '---' | 'small',
        'big',
        unknown,
        never
      >
    >(true)
  })
})
