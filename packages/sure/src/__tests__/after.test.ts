import { good, sure, fail, Pure, Sure } from '../sure.js'
import { assertEqual, assertIs } from '../typeTestUtils.js'
import { after } from '../types.js'

const sureNumber = sure(v =>
  typeof v === 'number' //
    ? good(v)
    : fail('---' as const)
)

describe('after', () => {
  it('should return good value', () => {
    const something = after(sureNumber, val => {
      assertIs<number>(val)

      if (val > 10) {
        return good('big' as const)
      }

      return fail('small' as const)
    })

    // This is not good
    assertEqual<
      typeof something,
      Sure<
        //
        '---' | 'small',
        'big',
        unknown,
        undefined
      >
    >(true)
  })
})
