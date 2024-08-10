import { describe, expect, it } from 'vitest'
import { MetaNever, MetaObj } from '../core.js'
import { InferJustMeta, ExtractPrimitives, justMeta } from '../meta.js'
import { object, optional } from '../object.js'
import { string, number } from '../primitives.js'
import { PrettifyRec } from '../utils.js'
import { assertEqual } from './typeTestUtils.js'
import { array } from '../array.js'

const simpleObj = object({
  name: optional(string),
  age: number,
  info: object({
    country: array(string),
  }),
})

type SimplifyMeta<TMeta extends MetaNever | MetaObj> = TMeta extends MetaObj<infer S> ? S : {}

type InferredJustMeta = InferJustMeta<typeof simpleObj>
type Prett = PrettifyRec<InferredJustMeta>

const temp = optional(number)
type tempType = InferJustMeta<typeof temp>

assertEqual<
  Prett,
  {
    type: 'object'
    schema: {
      name: {
        type: 'optional'
        schema: {
          type: 'string'
        }
      }
      age: undefined
      info: {
        type: 'object'
        schema: {
          country: {
            type: 'array'
            schema: {
              type: 'string'
            }
          }
        }
      }
    }
  }
>(true)

type InferredString = InferJustMeta<typeof string>

type test3 = ExtractPrimitives<{
  name: typeof string
}>

//

describe('justMeta', () => {
  it('works', () => {
    const result = justMeta(simpleObj)
    console.log(result)

    assertEqual<
      typeof result,
      {
        type: 'object'
        schema: {
          name: {
            type: 'optional'
            schema: {
              type: 'string'
            }
          }
          age: undefined
          info: {
            type: 'object'
            schema: {
              country: {
                type: 'array'
                schema: {
                  type: 'string'
                }
              }
            }
          }
        }
      }
    >(true)

    expect(result).toStrictEqual({
      type: 'object',
      schema: {
        name: {
          type: 'optional',
          schema: {
            type: 'string',
          },
        },
        age: undefined,
        info: {
          type: 'object',
          schema: {
            country: {
              type: 'array',
              schema: {
                type: 'string',
              },
            },
          },
        },
      },
    })
  })
})
