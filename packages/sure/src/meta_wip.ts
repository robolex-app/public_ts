import { Sure } from './core.js'
import { object } from './object.js'
import { PrettifyRec, objMapEntries } from './utils.js'

export type ExtractPrimitives<TSchema> = {
  [t in keyof TSchema]: InferJustMeta<TSchema[t]>
}
// prettier-ignore
export type InferJustMetaOld<T 
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

// prettier-ignore
export type InferJustMeta<
  T,
  // extends Sure<unknown, unknown, any, {}>
> = T extends Sure<unknown, unknown, any, { meta: infer Meta }>
  ? // for objects
    Meta extends {
      type: 'object'
      schema: infer CSchema
    } 
    ? {
        type: 'object'
        schema: ExtractPrimitives<CSchema>
      } 
    : // for optional
    Meta extends {
        type: 'optional'
        schema: infer CSchema
      }
    ? {
        type: 'optional'
        schema: InferJustMeta<CSchema>
      }
    : // for array
    Meta extends {
        type: 'array'
        schema: infer CSchema
      }
    ? {
        type: 'array'
        schema: InferJustMeta<CSchema>
      }
    : // for any other type
      Meta
  : // Here we'll not be able to differentiate MetaNever from MetaObj<undefined>
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

    // @ts-expect-error more explicit?
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

export function metaToJsonSchema<TMeta>(meta: TMeta): any {
  if (!meta) {
    return {
      type: 'unknown',
    }
  }

  // @ts-expect-error figure out
  if (meta.type === 'object') {
    // go through each and check if it's optional
    const optionalKeys: string[] = []
    // @ts-expect-error asdfsd
    const withoutOptional = objMapEntries(meta.schema as any, ([key, value]) => {
      if (value.type === 'optional') {
        // @ts-expect-error asdfsd
        optionalKeys.push(key)
        return [key, value.schema]
      }

      return [key, value]
    })

    const required = Object.keys(withoutOptional).filter(key => !optionalKeys.includes(key))

    return {
      type: 'object',
      properties: objMapEntries(withoutOptional, ([key, value]) => {
        return [key, metaToJsonSchema(value)]
      }),
      required,
    }
  }

  // @ts-expect-error figure out
  if (meta.type === 'array') {
    return {
      type: 'array',
      // @ts-expect-error rename schema to items here
      items: metaToJsonSchema(meta.schema),
    }
  }

  //
  return meta
}
