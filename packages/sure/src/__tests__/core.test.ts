import { sure, good, fail, InferFail, InferGood, InferInput, InferMeta } from '../sure.js'
import { assertIs, AssertEqual, assertEqual } from '../typeTestUtils.js'

/**
Validator for numbers without any meta.
 */
const sureNumber = sure(value =>
  typeof value === 'number' //
    ? good(value)
    : fail('not a number' as const)
)

/**
Validator for strings with meta.
 */
const sureStringMeta = sure(
  value =>
    typeof value === 'string' //
      ? good(value)
      : fail('not a string' as const),
  'my meta' as const
)

/**
Validator that expects the input to already be a string.
 */
const sureNonEmptyString = sure((value: string) =>
  value.length > 0 //
    ? good(value)
    : fail('empty string' as const)
)

/**
Validator that can return multiple error types
 */
const sureMultipleErrors = sure(value => {
  if (typeof value !== 'string') return fail('not a string' as const)

  if (value.length < 3) return fail('too small' as const)

  if (value.length > 10) return fail('too big' as const)

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
    assertEqual<number, InferGood<typeof sureNumber>>(true)
    assertEqual<'not a number', InferFail<typeof sureNumber>>(true)
    assertEqual<unknown, InferInput<typeof sureNumber>>(true)
    assertEqual<undefined, InferMeta<typeof sureNumber>>(true)
  })

  it('should have strong types with meta', () => {
    assertEqual<string, InferGood<typeof sureStringMeta>>(true)
    assertEqual<'not a string', InferFail<typeof sureStringMeta>>(true)
    assertEqual<unknown, InferInput<typeof sureStringMeta>>(true)
    assertEqual<'my meta', InferMeta<typeof sureStringMeta>>(true)
  })

  it('should have strong types for validators with custom input', () => {
    assertEqual<string, InferGood<typeof sureNonEmptyString>>(true)
    assertEqual<'empty string', InferFail<typeof sureNonEmptyString>>(true)
    assertEqual<string, InferInput<typeof sureNonEmptyString>>(true)
    assertEqual<undefined, InferMeta<typeof sureNonEmptyString>>(true)
  })

  it('should have strong types for validators with multiple errors', () => {
    assertEqual<string & {}, InferGood<typeof sureMultipleErrors>>(true)
    assertEqual<'not a string' | 'too small' | 'too big', InferFail<typeof sureMultipleErrors>>(true)
    assertEqual<unknown, InferInput<typeof sureMultipleErrors>>(true)
    assertEqual<undefined, InferMeta<typeof sureMultipleErrors>>(true)
  })
})
