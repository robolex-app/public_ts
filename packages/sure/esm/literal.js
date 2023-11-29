import { bad, good, pure } from './core.js'
export const literal = value => {
  return pure(val =>
    val === value //
      ? good(
          // the error is placed inside to be more exact
          // @ts-expect-error We do an explicit check above
          val
          //
        )
      : bad(`not literal ${typeof value} (${String(value)})`)
  )
}
