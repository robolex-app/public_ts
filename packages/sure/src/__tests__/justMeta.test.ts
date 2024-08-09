import { describe, expect, it } from 'vitest'
import { MetaNever, MetaObj } from '../core.js'
import { InferJustMeta, ExtractPrimitives, justMeta } from '../meta.js'
import { object } from '../object.js'
import { string, number } from '../primitives.js'
import { PrettifyRec } from '../utils.js'
import { assertEqual } from './typeTestUtils.js'

const simpleObj = object({
  name: string,
  age: number,
  info: object({
    country: string,
  }),
})

type SimplifyMeta<TMeta extends MetaNever | MetaObj> = TMeta extends MetaObj<infer S> ? S : {}

type InferredJustMeta = InferJustMeta<typeof simpleObj>
type Prett = PrettifyRec<InferredJustMeta>

assertEqual<
  Prett,
  {
    type: 'object'
    schema: {
      name: {
        type: 'string'
      }
      age: 'unknown'
      info: {
        type: 'object'
        schema: {
          country: {
            type: 'string'
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
            type: 'string'
          }
          age: 'unknown'
          info: {
            type: 'object'
            schema: {
              country: {
                type: 'string'
              }
            }
          }
        }
      }
    >(true)

    expect(result).toBe({
      type: 'object',
      schema: {
        name: {
          type: 'string',
        },
        age: 'unknown',
        info: {
          type: 'object',
          schema: {
            country: {
              type: 'string',
            },
          },
        },
      },
    })
  })
})
