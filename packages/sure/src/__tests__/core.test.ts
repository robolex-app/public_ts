import { sure, good, evil, InferEvil, InferGood, InferInput, InferMeta, Sure, MetaObj, MetaNever } from '../index.js'
import { assertIs, assertEqual } from './typeTestUtils.js'

/**
Validator for numbers without any meta.
 */
const sureNumber = sure(value =>
  typeof value === 'number' //
    ? good(value)
    : evil('not a number' as const)
)

/**
Validator for strings with meta.
 */
const sureStringMeta = sure(
  value =>
    typeof value === 'string' //
      ? good(value)
      : evil('not a string' as const),
  { myMeta: 'my meta' }
)

/**
Validator that expects the input to already be a string.
 */
const sureNonEmptyString = sure((value: string) =>
  value.length > 0 //
    ? good(value)
    : evil('empty string' as const)
)

/**
Validator that can return multiple error types
 */
const sureMultipleErrors = sure(value => {
  if (typeof value !== 'string') return evil('not a string' as const)

  if (value.length < 3) return evil('too small' as const)

  if (value.length > 10) return evil('too big' as const)

  // The `string & {}` is used as an example, when the return type has to be more controlled
  return good<string & {}>(value)
})

describe('core', () => {
  it('should return good value', () => {
    const [isNumber, unsure] = sureNumber(1)

    expect(isNumber).toBe(true)
    expect(unsure).toBe(1)

    assertIs<number | 'not a number'>(unsure)

    if (isNumber) {
      assertIs<number>(unsure)
    } else {
      assertIs<'not a number'>(unsure)
    }
  })

  it('should return bad value', () => {
    const [isNumber, unsure] = sureNumber('1')

    expect(isNumber).toBe(false)
    expect(unsure).toBe('not a number')
  })

  it('should not accept inputs that are not strings', () => {
    // @ts-expect-error
    sureNonEmptyString(1)
  })

  it('should accept inputs that are strings', () => {
    const [isValid, unsure] = sureNonEmptyString('1')

    expect(isValid).toBe(true)
    expect(unsure).toBe('1')
  })

  it('should accept inputs that are strings, then fail', () => {
    const [isValid, unsure] = sureNonEmptyString('')

    expect(isValid).toBe(false)
    expect(unsure).toBe('empty string')
  })

  it('should have strong types', () => {
    const [isNumber, unsure] = sureNumber(1)

    assertIs<boolean>(isNumber)
    assertIs<number | 'not a number'>(unsure)

    if (isNumber) {
      assertIs<true>(isNumber)
      assertIs<number>(unsure)
    } else {
      assertIs<false>(isNumber)
      assertIs<'not a number'>(unsure)
    }
  })

  it('type inference should work', () => {
    assertEqual<
      typeof sureNumber,
      Sure<
        //
        'not a number',
        number,
        unknown,
        MetaObj<undefined>
      >
    >(true)

    assertEqual<InferGood<typeof sureNumber>, number>(true)
    assertEqual<InferEvil<typeof sureNumber>, 'not a number'>(true)
    assertEqual<InferInput<typeof sureNumber>, unknown>(true)
  })

  it('should have strong types with meta', () => {
    assertEqual<
      typeof sureStringMeta,
      Sure<
        //
        'not a string',
        string,
        unknown,
        { meta: { myMeta: string } }
      >
    >(true)
    type fasdf = InferGood<typeof sureStringMeta>

    assertEqual<InferGood<typeof sureStringMeta>, string>(true)
    assertEqual<InferEvil<typeof sureStringMeta>, 'not a string'>(true)
    assertEqual<InferInput<typeof sureStringMeta>, unknown>(true)
    assertEqual<
      InferMeta<typeof sureStringMeta>,
      {
        meta: {
          myMeta: string
        }
      }
    >(true)
  })

  it('should have strong types for validators with custom input', () => {
    assertEqual<typeof sureNonEmptyString, Sure<'empty string', string, string, MetaObj<undefined>>>(true)

    assertEqual<InferGood<typeof sureNonEmptyString>, string>(true)
    assertEqual<InferEvil<typeof sureNonEmptyString>, 'empty string'>(true)
    assertEqual<InferInput<typeof sureNonEmptyString>, string>(true)
    // assertEqual<InferMeta<typeof sureNonEmptyString>, {}>(true)
  })

  it('should have strong types for validators with multiple errors', () => {
    assertEqual<
      typeof sureMultipleErrors,
      Sure<'not a string' | 'too small' | 'too big', string & {}, unknown, MetaObj<undefined>>
    >(true)

    assertEqual<InferGood<typeof sureMultipleErrors>, string & {}>(true)
    assertEqual<InferEvil<typeof sureMultipleErrors>, 'not a string' | 'too small' | 'too big'>(true)
    assertEqual<InferInput<typeof sureMultipleErrors>, unknown>(true)
  })
})
