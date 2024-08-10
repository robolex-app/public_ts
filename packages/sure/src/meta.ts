import { Sure } from './core.js'
import { object } from './object.js'
import { PrettifyRec, objMapEntries } from './utils.js'

export type ExtractPrimitives<TSchema> = {
  [t in keyof TSchema]: InferJustMeta<TSchema[t]>
}

// prettier-ignore
export type InferJustMeta<T 
// extends Sure<unknown, unknown, any, {}>
> =
  // for objects
  T extends Sure<unknown, unknown, any, {meta: {
    type: 'object'
    schema: infer CSchema
  }}>
    ?{
      type: 'object'
      schema: ExtractPrimitives<CSchema>
    }  

      // for optional
  :T extends Sure<unknown, unknown, any, {meta: {
    type: 'optional'
    schema: infer CSchema
  }}>
    ?{
      type: 'optional'
      schema: InferJustMeta<CSchema>
    }  

    // for array
  :T extends Sure<unknown, unknown, any, {meta: {
    type: 'array'
    schema: infer CSchema
  }}> ? {
    type: 'array'
    schema: InferJustMeta<CSchema>
  }

    
    // for any other type
    :
    T extends Sure<unknown, unknown, any, {meta: infer Meta}>
    ? Meta :
   
  // Here we'll not be able to differentiate MetaNever from MetaObj<undefined>
  // Both will be extracted as `undefined`
  undefined

export function justMeta<TSchema extends Sure<unknown, unknown, any>>(
  insure: TSchema
): PrettifyRec<InferJustMeta<TSchema>> {
  // object.getMeta(insure) -> if not object -> null

  object

  // @ts-expect-error more explicit?
  if (insure.meta?.type === 'object') {
    const { schema, ...rest } = insure.meta as any

    const ret = objMapEntries(schema, ([key, value]) => {
      return [key, justMeta(value)]
    })

    return { schema: ret, ...rest }
  }

  // @ts-expect-error more explicit?
  if (insure.meta?.type === 'optional') {
    const { schema, ...rest } = insure.meta as any

    return {
      schema: justMeta(schema),
      ...rest,
    }
  }

  // @ts-expect-error more explicit?
  if (insure.meta?.type === 'array') {
    const { schema, ...rest } = insure.meta as any

    return {
      schema: justMeta(schema),
      ...rest,
    }
  }

  if (insure.meta) {
    return insure.meta as any
  }

  return undefined as any
}
