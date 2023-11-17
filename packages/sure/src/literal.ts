import { Peasy, Pure, bad, good, pure } from './core.js'

// Copied from Zod
export type Primitive =
  | string //
  | number
  | symbol
  | bigint
  | boolean
  | null
  | undefined

export const literal = <
  // so that `as const` is not needed
  T extends Primitive,
>(
  value: T
) => {
  return pure(val =>
    val === value //
      ? good<T>(
          // @ts-expect-error We do an explicit check above
          val
        )
      : bad(`not literal ${typeof value} (${String(value)})` as const)
  )
}
