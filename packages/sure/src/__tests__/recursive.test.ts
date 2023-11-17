import { describe, it, expect } from 'vitest'
import {
  recurse,
  after,
  and,
  array,
  bad,
  good,
  object,
  or,
  pure,
  string,
  sure,
  unknown,
  recursiveElem,
} from '../index.js'
import type {
  InferBad,
  InferGood,
  InferInput,
  InferMeta,
  MetaNever,
  MetaObj,
  Pure,
  RecurseSymbol,
  Sure,
} from '../index.js'
import { assertEqual } from './typeTestUtils.js'

const baseObj = object({
  name: string,
  children: recursiveElem,
})

const recurseSure = recurse(baseObj, recurseSure => {
  return array(recurseSure)
})

// TypeChecks
type InferredGood = InferGood<typeof recurseSure>
type InferredBad = InferBad<typeof recurseSure>
type InferredInput = InferInput<typeof recurseSure>
type InferredMeta = InferMeta<typeof recurseSure>

assertEqual<
  InferredGood,
  {
    name: string
    children: {
      name: string
      children: typeof RecurseSymbol
    }[]
  }
>(true)

describe('recursive', () => {
  it('should return good value', () => {
    const value = recurseSure({
      name: 'hello',
      children: [],
    })

    expect(value).toStrictEqual([
      true,
      {
        name: 'hello',
        children: [],
      },
    ])
  })
})
