import {
  InferBad,
  InferGood,
  InferInput,
  InferMeta,
  MetaNever,
  MetaObj,
  Sure,
  number,
  object,
  optional,
  string,
} from '../index.js'

import { assertEqual } from './typeTestUtils.js'

// https://effectivetypescript.com/2020/05/12/unionize-objectify/
type Unionize<T extends object> = {
  [k in keyof T]: { k: k; v: T[k] }
}[keyof T]

type KVPair = { k: PropertyKey; v: unknown }
type Objectify<T extends KVPair> = {
  [k in T['k']]: Extract<T, { k: k }>['v']
}

type OmitKV<T extends KVPair, V> = T extends { v: V } ? never : T
type PickKV<T extends KVPair, V> = T extends { v: V } ? T : never

// object with optional
const optionalObj = object({
  name: string,
  age: optional(number),
})

// TypeChecks
type InferredGood_optionalObj = InferGood<typeof optionalObj>
type InferredBad_optionalObj = InferBad<typeof optionalObj>
type InferredInput_optionalObj = InferInput<typeof optionalObj>
type InferredMeta_optionalObj = InferMeta<typeof optionalObj>

type JustPart = {
  name: Sure<'not string', string, unknown, MetaObj<undefined>>
  age: Sure<
    'not number',
    number,
    unknown,
    MetaObj<{
      parent: typeof optional
      schema: Sure<'not number', number, unknown, MetaNever>
    }>
  >
}

type unionJustPart = Unionize<JustPart>

type HasOptional<T extends Sure> = InferMeta<T> extends MetaObj<{ parent: typeof optional }> ? 'yes' : 'no'

const optNum = optional(number)
const nonOptNum = number

type TestHasOptional = HasOptional<typeof optNum>
type TestHasOptional2 = HasOptional<typeof nonOptNum>

type JustNonOptionals<
  //
  TSchema extends Record<string, Sure<unknown, unknown, any>>,
> = {
  [K in keyof TSchema & string]: InferMeta<TSchema[K]> extends MetaObj<{ parent: typeof optional }>
    ? never
    : InferGood<TSchema[K]>
}

type JustOptionals<
  //
  TSchema extends Record<string, Sure<unknown, unknown, any>>,
> = {
  [K in keyof TSchema & string]?: InferMeta<TSchema[K]> extends MetaObj<{ parent: typeof optional }>
    ? InferGood<TSchema[K]>
    : never
}

type Test = JustNonOptionals<JustPart>
type Test2 = JustOptionals<JustPart>

assertEqual<InferredGood_optionalObj, { name: string; age?: number }>(true)
assertEqual<
  InferredBad_optionalObj,
  {
    age?: 'not number'
    name?: 'not string'
  }
>(true)
