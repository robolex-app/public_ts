import { MetaObj, Sure, array, number, spread, string, tuple } from '../../index.js'

// Doesn't work
export type TupleInferGoods01<T> = //
  T extends readonly [infer First, ...infer InferRest]
    ? First extends Sure<unknown, infer Good, any, infer Meta>
      ? Meta extends { parent: typeof spread }
        ? // try spreading the rest if it's an array
          Good extends readonly unknown[]
          ? [...Good, ...TupleInferGoods01<InferRest>]
          : // otherwise just return the good
            [Good, ...TupleInferGoods01<InferRest>]
        : [Good, ...TupleInferGoods01<InferRest>]
      : []
    : []

const sample = [
  //
  string,
  spread(array(number)),
  string,
] as const

type Sample = typeof sample

// [unknown[]]
type Check01 = TupleInferGoods01<Sample>

// ## Try fixing
export type TupleInferGoods_02<T> = //
  T extends readonly [infer First, ...infer InferRest]
    ? First extends Sure<unknown, infer Good, any, infer Meta>
      ? Meta extends MetaObj<{ parent: typeof spread }>
        ? // try spreading the rest if it's an array
          Good extends readonly unknown[]
          ? [...Good, ...TupleInferGoods_02<InferRest>]
          : // otherwise just return the good
            [Good, ...TupleInferGoods_02<InferRest>]
        : [Good, ...TupleInferGoods_02<InferRest>]
      : []
    : []

// works
type Check02 = TupleInferGoods_02<Sample>

// Check for full tuple
const schema = [
  //
  string,
  spread(array(number)),
  string,
] as const
