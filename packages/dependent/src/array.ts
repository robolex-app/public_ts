/**
 * The implementation is: `return new Array(length).fill(values)`
 */
export function arrayOf<T>(length: number, values: T): T[] {
  return new Array(length).fill(values)
}
