import { describe, expect, it } from 'vitest'
import { MetaNever, MetaObj } from '../core.js'
import { InferJustMeta, ExtractPrimitives, justMeta, metaToJsonSchema } from '../meta_wip.js'
import { object, optional } from '../object.js'
import { string, number } from '../primitives.js'
import { PrettifyRec } from '../utils.js'
import { assertEqual } from './typeTestUtils.js'
import { array } from '../array.js'

import { Ajv } from 'ajv'

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
      age: {
        type: 'number'
      }
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
          age: {
            type: 'number'
          }
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
        age: {
          type: 'number',
        },
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

describe('toJsonSchema', () => {
  it('works', () => {
    const result = justMeta(simpleObj)
    const jsonSchema = metaToJsonSchema(result)

    expect(jsonSchema).toStrictEqual({
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        age: {
          type: 'number',
        },
        info: {
          type: 'object',
          properties: {
            country: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
          },
          required: ['country'],
        },
      },
      required: ['age', 'info'],
    })

    const ajv = new Ajv()
    const validate = ajv.compile(jsonSchema)

    // expect that it doesn't throw
  })
})
