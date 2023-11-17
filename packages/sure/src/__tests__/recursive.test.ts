import { describe, it, expect, assert } from 'vitest'
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
  number,
  tuple,
  literal,
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

describe('recursive', () => {
  describe('simple recursive array', () => {
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
    //////

    assertEqual<
      InferredBad,
      {
        name?: 'not string' | undefined
        children?:
          | (
              | {
                  name?: 'not string' | undefined
                  children?: typeof RecurseSymbol | undefined
                }
              | undefined
            )[]
          | undefined
      }
    >(true)

    it('should return good value', () => {
      const value = recurseSure({
        name: 'hello',
        children: [
          {
            name: 'world',
            children: [],
          },
        ],
      })

      expect(value).toStrictEqual([
        true,
        {
          name: 'hello',
          children: [
            {
              name: 'world',
              children: [],
            },
          ],
        },
      ])
    })
  })

  describe('complex recursive object', () => {
    const complexSure = object({
      value: number,

      left: recursiveElem,

      right: recursiveElem,
    })

    const recurseComplexSure = recurse(
      //
      complexSure,
      inner =>
        //
        or(
          and(
            inner,
            object({
              parent: number,
            })
          ),
          literal('end')
        )
    )

    type InferredGood = InferGood<typeof recurseComplexSure>
    type InferredBad = InferBad<typeof recurseComplexSure>
    type InferredInput = InferInput<typeof recurseComplexSure>
    type InferredMeta = InferMeta<typeof recurseComplexSure>

    assertEqual<InferredInput, unknown>(true)

    assertEqual<
      //
      InferredGood,
      {
        value: number
        left:
          | ({
              value: number
              left: typeof RecurseSymbol
              right: typeof RecurseSymbol
            } & {
              parent: number
            })
          | 'end'
        right:
          | ({
              value: number
              left: typeof RecurseSymbol
              right: typeof RecurseSymbol
            } & {
              parent: number
            })
          | 'end'
      }
    >(true)

    assertEqual<
      InferredBad,
      {
        value?: 'not number' | undefined
        left?:
          | {
              value?: 'not number' | undefined
              left?: typeof RecurseSymbol | undefined
              right?: typeof RecurseSymbol | undefined
            }
          | {
              parent?: 'not number' | undefined
            }
          | `not literal ${string}`
          | undefined
        right?:
          | {
              value?: 'not number' | undefined
              left?: typeof RecurseSymbol | undefined
              right?: typeof RecurseSymbol | undefined
            }
          | {
              parent?: 'not number' | undefined
            }
          | `not literal ${string}`
          | undefined
      }
    >(true)

    it('should work for complex things', () => {
      const value = recurseComplexSure({
        value: 4,

        right: 'end',

        left: {
          value: 3,

          parent: 8,

          // @ts-expect-error, TODO: add several more levels?
          left: 'end',
          // @ts-expect-error, TODO: add several more levels?
          right: 'end',
        },
      } satisfies InferredGood)

      expect(value).toStrictEqual([
        true,
        {
          value: 4,

          right: 'end',

          left: {
            value: 3,

            parent: 8,

            left: 'end',
            right: 'end',
          },
        },
      ])
    })
    it('should fail for complex things (TODO: improve bad response)', () => {
      const value = recurseComplexSure({
        value: 4,

        right: 'end',

        left: {
          value: 3,

          // @ts-expect-error, TODO: add several more levels?
          parent: '8',

          // @ts-expect-error, TODO: add several more levels?
          left: 'end',
          // @ts-expect-error, TODO: add several more levels?
          right: 'end',
        },
      } satisfies InferredGood)

      expect(value).toStrictEqual([
        false,
        {
          // TODO: improve bad response
          left: 'not literal string (end)',
        },
      ])
    })
  })
})
