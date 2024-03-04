import { describe, expect, it } from 'vitest'
import { err, number, object, string } from '../index.js'
import { assertEqual } from './typeTestUtils.js'

const parser = err(
  object({
    name: string,
    age: number,
  })
)

type InputType = Parameters<typeof parser>
type OutputType = ReturnType<typeof parser>

assertEqual<InputType, [unknown]>(true)
assertEqual<
  OutputType,
  {
    name: string
    age: number
  }
>(true)

describe('err', () => {
  it('throws an error', () => {
    expect(() => err(string)(1)).toThrow('not string')
  })

  it('returns the value', () => {
    expect(err(string)('a')).toBe('a')
  })
})
