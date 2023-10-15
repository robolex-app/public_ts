import { object, evil, number, string } from '../index.js'

const someObj = object({
  name: string,
  age: number,
  address: object({
    country: string,
  }),
})

describe('object', () => {
  it('should return good value', () => {
    const value = someObj({
      name: 'John',
      age: 12,
      address: {
        country: 'USA',
      },
    })

    expect(value).toEqual([
      true,
      {
        name: 'John',
        age: 12,
        address: {
          country: 'USA',
        },
      },
    ])
  })

  it('should return evil value', () => {
    const value = someObj({
      name: 'John',
      age: 12,
      address: {
        country: 123,
      },
    })

    expect(value).toEqual([
      false,
      {
        address: {
          country: 'not string',
        },
      },
    ])

    expect(value).toEqual(
      evil({
        address: {
          country: 'not string',
        },
      })
    )
  })
})
