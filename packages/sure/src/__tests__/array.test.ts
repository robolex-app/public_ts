import { array, evil, number } from '../index.js'

const someArray = array(number)

describe('array', () => {
  it('should return good value', () => {
    const value = someArray([1, 2, 3])

    expect(value).toStrictEqual([true, [1, 2, 3]])
  })

  it('should return evil value', () => {
    const value = someArray([1, 'two', 3])

    expect(value).toStrictEqual([false, [undefined, 'not number', undefined]])
  })
})
