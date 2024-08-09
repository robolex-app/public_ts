import { Sure } from './core.js'

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
