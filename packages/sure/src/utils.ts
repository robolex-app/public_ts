// https://effectivetypescript.com/2020/05/12/unionize-objectify/
export type Unionize<T extends object> = {
  [k in keyof T]: { k: k; v: T[k] }
}[keyof T]

export type KVPair<V = unknown> = { k: PropertyKey; v: V }
export type Objectify<T extends KVPair> = {
  [k in T['k']]: Extract<T, { k: k }>['v']
}

export type OmitKV<T extends KVPair, V> = T extends { v: V } ? never : T
export type PickKV<T extends KVPair, V> = T extends { v: V } ? T : never

// https://www.totaltypescript.com/concepts/the-prettify-helper
export type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}

export type PrettifyRec<T> = {
  [K in keyof T]: PrettifyRec<T[K]>
} & {}

type PropKey = string | number | symbol

/**
 * Check source.
 * Maps over an object using `Object.entries` and returns a new object.
 */
export function objMapEntries<
  //
  Obj extends Record<PropKey, unknown>,
  ResultKey extends PropKey,
  ResultValue,
>(
  value: Obj,
  callback: (entry: [key: keyof Obj, value: Obj[keyof Obj]]) => readonly [ResultKey, ResultValue]
): Record<ResultKey, ResultValue> {
  // @ts-expect-error We expect an error here
  return Object.fromEntries(Object.entries(value).map(callback))
}
