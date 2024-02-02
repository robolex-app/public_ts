// https://stackoverflow.com/a/50375286/2659549
export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never

export type UnpackPromise<T> = T extends Promise<infer U> ? U : T

/**
 * Use this instead of {}. It seems that {} causes problems especially when used in generics.
 */
export type EmptyObject = Record<string, unknown>

export type Arguments<T extends (...args: unknown[]) => unknown> = T extends (...args: infer R) => unknown ? R : never
export type FirstArgument<T extends (arg: any, ...args: any[]) => any> = T extends (val: infer R, ...args: any[]) => any
  ? R
  : never
export type SecondArgument<T extends (first: any, second: any, ...args: any[]) => any> = T extends (
  first: any,
  second: infer R,
  ...args: any[]
) => any
  ? R
  : never

/**
 * Given a function of type `(v: A) => Ap | (v: B) => Bp`
 * transform it's type into `(v: A | B) => Ap | Bp`
 */
export type UnionFuncFix<F extends (arg: any) => any> = (value: FirstArgument<F>) => ReturnType<F>

// https://www.roryba.in/programming/2019/10/12/flattening-typescript-union-types.html
// Flattens two union types into a single type with optional values
// i.e. FlattenUnion<{ a: number, c: number } | { b: string, c: number }> = { a?: number, b?: string, c: number }
export type FlattenUnion<T> = {
  [K in keyof UnionToIntersection<T>]: K extends keyof T
    ? T[K] extends unknown[]
      ? T[K] // eslint-disable-next-line @typescript-eslint/ban-types
      : T[K] extends object
      ? FlattenUnion<T[K]>
      : T[K]
    : UnionToIntersection<T>[K] | undefined
}

/**
 * Different implementation of Array1/Array2/...
 *
 * Not sure if it provides any advantages
 */
export type ArrayN<N extends number, T> = N extends 1
  ? [T, ...T[]]
  : N extends 2
  ? [T, T, ...T[]]
  : N extends 3
  ? [T, T, T, ...T[]]
  : N extends 4
  ? [T, T, T, T, ...T[]]
  : N extends 5
  ? [T, T, T, T, T, ...T[]]
  : N extends 6
  ? [T, T, T, T, T, T, ...T[]]
  : N extends 7
  ? [T, T, T, T, T, T, T, ...T[]]
  : T[]

export type Array1<T> = [T, ...T[]]
export type Array2<T> = [T, T, ...T[]]
export type Array3<T> = [T, T, T, ...T[]]
export type Array4<T> = [T, T, T, T, ...T[]]
export type Array5<T> = [T, T, T, T, T, ...T[]]
export type Array6<T> = [T, T, T, T, T, T, ...T[]]
export type Array7<T> = [T, T, T, T, T, T, T, ...T[]]

export function map<T, U>(arr: Array1<T>, callbackfn: (value: T, index: number) => U): Array1<U>
export function map<T, U>(arr: Array2<T>, callbackfn: (value: T, index: number) => U): Array2<U>
export function map<T, U>(arr: T[], callbackfn: (value: T, index: number) => U): U[]
export function map<T, U>(arr: T[], callbackfn: (value: T, index: number) => U): U[] {
  return arr.map(callbackfn)
}

export function atLeast<T>(n: 1, arr: T[]): arr is Array1<T>
export function atLeast<T>(n: 2, arr: T[]): arr is Array2<T>
export function atLeast<T>(n: 3, arr: T[]): arr is Array3<T>
export function atLeast<T>(n: number, arr: T[]): arr is T[] {
  return arr.length >= n
}

/**
 * Wrapper around the `in` operator.
 * By default the `in` operator narrows the object (this is useful if the object
 * is a union type). We want to do the reverse, that is narrow down the key.
 * https://www.typescriptlang.org/docs/handbook/2/narrowing.html#the-in-operator-narrowing
 *
 * @param obj The object the keys of which we want to narrow to
 * @param key The key we want to check if is in the object
 */
export function isKeyOf<T extends object>(obj: T, key: string | number | symbol): key is keyof T {
  return key in obj
}

/**
 * Type guard that returns true if the passed array has the exact length as specified
 *
 * @param length The expected length of the array
 * @param arr The array the length of which we test
 */
export function excactly<T>(length: 1, arr: T[]): arr is [T]
export function excactly<T>(length: 2, arr: T[]): arr is [T, T]
export function excactly<T>(length: 3, arr: T[]): arr is [T, T, T]
export function excactly<T>(length: number, arr: T[]): arr is T[] {
  return arr.length === length
}

/**
 * Type guard that returns true if the value is not null or undefined
 *
 * The main usage is the filter function: `something.filter(notEmpty)`
 *
 * @param value A value that may or may not be null/undefined
 */
export function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
  return value !== null && value !== undefined
}

export function atMod<T>(arr: Array1<T>, indexMod: number): T {
  const len = arr.length
  const elem = arr[(indexMod + len) % len]

  return elem ?? arr[0]
}

// TODO: Write this better
// export function groupBy<T extends {}, K extends string>(
//   arr: (T & { [k in K]?: string })[],
//   key: K
// ): { [k: string]: Array1<T> } {
//   const retObj: { [k: string]: Array1<T> } = {};
//
//   arr.forEach((elem) => {
//     if (!(key in elem)) return;
//
//     const elemVal: string | undefined = elem[key];
//
//     if (!elemVal) return;
//
//     if (isKeyOf(retObj, elemVal)) {
//       retObj[elemVal].push(elem);
//     } else {
//       retObj[elemVal] = [elem];
//     }
//   });
//
//   return retObj;
// }

// Maybe rewrite this more beautifully
export function zip<T, B>(arrT: Array1<T>, arrB: Array1<B>): Array1<[T, B]> {
  const first: [T, B] = [arrT[0], arrB[0]]

  const rest = map(arrT, (tVal, index) => {
    // First element was already extracted
    if (index === 0) return null

    const bVal = arrB[index]

    if (!bVal) return null

    const tup: [T, B] = [tVal, bVal]

    return tup
  }).filter(notEmpty)

  return [first, ...rest]
}

/**
 * Returns the last element of the array
 * If the array is Array1, it will return `T`
 * otherwise it will return `T | undefined`
 *
 * @param arr An array of elements
 */
export function last<T>(arr: Array1<T>): T
export function last<T>(arr: T[]): T | undefined
export function last<T>(arr: T[]): T | undefined {
  return arr[arr.length - 1]
}

/**
 * Filter the values of an array in 2 groups based on the predicate
 *
 * @param arr Array with some values
 * @param pred The predicate
 */
export function split<T>(arr: ReadonlyArray<T>, pred: (elem: T, index: number) => boolean): { good: T[]; bad: T[] } {
  const good = arr.filter((elem, index) => pred(elem, index))
  const bad = arr.filter((elem, index) => !pred(elem, index))

  return { good, bad }
}

/**
 * Wrapper over `Promise.all()` that maintains the guarantees of the passed array
 *
 * @param promises A list of promises
 */
export function promiseAll<T>(promises: Array3<Promise<T>>): Promise<Array3<T>>
export function promiseAll<T>(promises: Array2<Promise<T>>): Promise<Array2<T>>
export function promiseAll<T>(promises: Array1<Promise<T>>): Promise<Array1<T>>
export function promiseAll<T>(promises: Promise<T>[]): Promise<T[]>
export function promiseAll<T>(promises: Promise<T>[]): Promise<T[]> {
  return Promise.all(promises)
}

/**
 * Wrapper over `Promise.all(array.map(callback))` that maintains the guarantees of the array
 */
export function mapAll<T, B>(arr: Array3<T>, callback: (value: T, index: number) => Promise<B>): Promise<Array3<B>>
export function mapAll<T, B>(arr: Array2<T>, callback: (value: T, index: number) => Promise<B>): Promise<Array2<B>>
export function mapAll<T, B>(arr: Array1<T>, callback: (value: T, index: number) => Promise<B>): Promise<Array1<B>>
export function mapAll<T, B>(arr: T[], callback: (value: T, index: number) => Promise<B>): Promise<B[]>
export function mapAll<T, B>(arr: T[], callback: (value: T, index: number) => Promise<B>): Promise<B[]> {
  return Promise.all(arr.map(callback))
}

/**
 * Reverses an array (creates a new array) maintaining its guarantees
 *
 * @param arr The array to reverse
 */
export function reverse<T>(arr: Array3<T>): Array3<T>
export function reverse<T>(arr: Array2<T>): Array2<T>
export function reverse<T>(arr: Array1<T>): Array1<T>
export function reverse<T>(arr: Array1<T>): Array1<T>
export function reverse<T>(arr: T[]): T[] {
  const tempArr = [...arr]

  tempArr.reverse()

  return tempArr
}

/**
 * Wrapper around `splice` that doesn't modify the initial array
 *
 * @param array
 * @param start
 * @param count
 * @param values
 */
export function immutableSplice<T>(array: T[], start: number, count: number, ...values: T[]): T[] {
  const newArr = [...array]
  newArr.splice(start, count, ...values)
  return newArr
}

/**
 * This function can be added in the default case of a switch statement
 * so that the switch is exhaustive (https://stackoverflow.com/a/39419171)
 * When this is added typescript will show an error if one of the possibilities
 * of an enum was not taken into account. See Compose.js setContent() for example
 */
export function unreachable(v: never): never {
  return v
}

export function promiseTimeout(millis: number) {
  return new Promise<undefined>((resolve, reject) => {
    try {
      setTimeout(resolve, millis)
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * Wrapper around `Array.includes()` that is also a type guard and doesn't err if the value
 * is not guaranteed to be in the given array
 *
 * @param arr
 * @param value
 */
export function includes<TArr extends readonly unknown[]>(
  //
  arr: TArr,
  value: unknown
): value is TArr[number] {
  // @ts-ignore
  return arr.includes(value)
}

export type SafeOmit<T, K extends keyof T> = Omit<T, K>
