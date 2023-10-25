import { array, evil, number } from '../index.js'

const someArray = array(number)

describe('array', () => {
  it('should return good value', () => {
    const value = someArray([1, 2, 3])

    expect(value).toEqual([true, [1, 2, 3]])
  })

  it('should return evil value', () => {
    const value = someArray([1, 'two', 3])

    expect(value).toEqual([false, ['not number']])

    expect(value).toEqual(evil(['not number']))
  })
})
