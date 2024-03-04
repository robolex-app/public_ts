import { InferGood, InferInput, MetaNever, MetaObj, Sure } from './index.js'

export const err =
  <TInput, TGood, TSure extends Sure<unknown, TGood, TInput>>(schema: TSure) =>
  (input: TInput): TGood => {
    const [good, result] = schema(input)

    if (good) {
      return result
    }

    throw result
  }
