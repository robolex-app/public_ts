import { describe, expect, it } from 'vitest'
import { err, string } from '../index.js'

describe('err', () => {
  it('throws an error', () => {
    expect(() => err(string)(1)).toThrow('not string')
  })

  it('returns the value', () => {
    expect(err(string)('a')).toBe('a')
  })
})
