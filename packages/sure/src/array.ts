import { Sure, InferEvil, InferGood, sure, evil, good } from './core.js'

export function array<
  //
  TPropFail,
  TPropGood,
  TSchema extends Sure<TPropFail, TPropGood, unknown, unknown>,
>(
  schema: TSchema
): Sure<
  //
  Array<InferEvil<TSchema> | undefined>,
  Array<InferGood<TSchema>>,
  unknown,
  TSchema
> {
  const struct = sure(value => {
    if (!Array.isArray(value)) {
      return evil([])
    }

    let atLeastOneEvil = false

    const arrayUnsure = value.map(elem => {
      const [good, unsure] = schema(elem)

      if (!good) {
        atLeastOneEvil = true
      }

      return unsure
    })

    if (atLeastOneEvil) {
      return evil(arrayUnsure)
    }

    return good(arrayUnsure)
  }, schema)

  // @ts-expect-error Expected error
  return struct
}
