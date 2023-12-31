import { describe, it, expect } from 'vitest'
import {
  InferBad,
  InferGood,
  InferInput,
  Sure,
  good,
  sure,
  bad,
  InferMeta,
  MetaObj,
  pure,
  MetaNever,
} from '../index.js'
import { assertEqual } from './typeTestUtils.js'

export const nonEmptyString = pure(x => {
  return typeof x === 'string' //
    ? good(x)
    : bad('not string' as const)
})

describe('primitives', () => {
  it('should return good value', () => {
    nonEmptyString('1')

    assertEqual<typeof nonEmptyString, Sure<'not string', string, unknown, MetaNever>>(true)

    assertEqual<InferGood<typeof nonEmptyString>, string>(true)
    assertEqual<InferBad<typeof nonEmptyString>, 'not string'>(true)
    assertEqual<InferInput<typeof nonEmptyString>, unknown>(true)
    assertEqual<InferMeta<typeof nonEmptyString>, MetaNever>(true)
  })
})
