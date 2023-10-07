/**
 * Wrapper around `Object.keys` that returns a typed array instead of `string[]`
 *
 * @param value
 */
export function objKeys<T extends object>(value: T): (keyof T)[] {
  return Object.keys(value) as (keyof T)[]
}

type PropKey = string | number | symbol

/**
  Wrapper around `Object.entries` that returns a typed array instead of `[string, unknown][]` 
 */
export function objEntries<
  //
  Obj extends Record<PropKey, unknown>
>(value: Obj): [keyof Obj & string, Obj[keyof Obj]][] {
  // @ts-expect-error We expect an error here
  return Object.entries(value)
}

export function objFromEntries<
  //
  Key extends PropKey,
  Value
>(
  // TODO: Figure out this readonly stuff. It's necessary for `as const`
  entries: readonly (readonly [Key, Value])[]
): Record<Key, Value> {
  // @ts-expect-error We expect an error here
  return Object.fromEntries(entries)
}

/**
 * Check source.
 * Maps over an object using `Object.entries` and returns a new object.
 */
export function objMapEntries<
  //
  Obj extends Record<PropKey, unknown>,
  ResultKey extends PropKey,
  ResultValue
>(
  value: Obj,
  callback: (entry: [key: keyof Obj, value: Obj[keyof Obj]]) => readonly [ResultKey, ResultValue]
): Record<ResultKey, ResultValue> {
  return objFromEntries(objEntries(value).map(callback))
}
