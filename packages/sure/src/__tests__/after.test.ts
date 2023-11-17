import { good, sure, bad, Sure, after, MetaObj } from '../index.js'
import { assertEqual, assertIs } from './typeTestUtils.js'

const sureNumber = sure(v =>
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
        //
        '---' | 'small',
        'big',
        unknown,
        MetaObj<undefined>
      >
    >(true)
  })
})
