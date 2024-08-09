import { Sure } from './core.js'
import { PrettifyRec } from './utils.js'

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
    
    // for any other type
    :
    T extends Sure<unknown, unknown, any, {meta: infer Meta}>
    ? Meta : 
   
      'unknown'

export function justMeta<TSchema extends Sure<unknown, unknown, any>>(
  schema: TSchema
): PrettifyRec<InferJustMeta<TSchema>> {
  const something = schema.meta
  return something as any
}
