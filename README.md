## Headless Type-safe validation library for Javascript

You can view this markdown rendered with complete Typescript support on https://tsx.md/github.com/robolex-app/public_ts/blob/main/README.md

As with other validation libaries like `zod`, `yup`, `io-ts`, `superstruct`, `valibot`, etc...

You can easily validate any `unknown` value using:

```ts
import { object, string, number } from '@robolex/sure'

const validator = object({
  name: string,
  age: number,
})
```

What this library does differently is that it puts the focus on customization and makes the core so simple,
that you can define your `string` validator like this:

```ts
const string = (value: unknown) => {
  if (typeof value === 'string') return [true, value] as const

  return [false, 'not string'] as const
}
```

This is actually how the `string` from the initial example is defined.

## Why a new library?

<Insert link to the article regarding conditional validation of forms here>

Validating a value as `string` or `number` is easy in any of the aforementioned libraries.
What's not easy, is validting an IBAN using `validator.js`, or validating an IBAN, but showing different error messages for countries whose IBAN your
SaaS doesn't currently support, but will support in the next quarter.

If you want to do this in `zod`, you'll have to understand the difference between
`refine` https://zod.dev/?id=refine
`superRefine` https://zod.dev/?id=superrefine
`transform` https://zod.dev/?id=transform

You'll also encounters lots of interesting issues related to how these 3 methods combine with each other.

## The core library in this:

`./esm/core.js`

```ts
export function sure(insure, meta) {
  return Object.assign(insure, { meta })
}
export function pure(insure) {
  return insure
}
export function bad(val) {
  return [false, val]
}
export function good(val) {
  return [true, val]
}
```

Everything else is based on the core types and those 4 functions.

## Custom validators:

If you want to validate that something is an IBAN you can just define a function:

```ts
import { pure, sure, bad, good, Sure, InferGood, InferBad } from '@robolex/sure'
import { isIBAN } from 'validator'

const ibanSchema = pure(value => {
  if (typeof value === 'string' && isIBAN) return good(value)

  return bad('not an IBAN')
})

// if you don't want to use the utility function you can do it like this:

const ibanSchema2 = (value => {
  if (typeof value === 'string' && isIBAN) return [true, value] as const

  return [false, 'not an IBAN'] as const
}) satisfies Sure

// The `satisfies` is not strictly necessary, but it provides the type-guarantee that
// your function holds all the necessary requirements to be considered a schema

type InferredGoodIban = InferGood<typeof ibanSchema2>
type InferredBadIban = InferBad<typeof ibanSchema2>
```

## Common utilities:

Of course, there are the basic utilities, for things you'd expect from other type-safe libraries:

### object

```ts
import { object, optional, string, number } from '@robolex/sure'
import type { InferGood } from '@robolex/sure'

const validator = object({
  name: string,
  age: optional(number),
})

// The `optional` is a real optional if you use `exactOptionalPropertyTypes`
// It's not a `number | undefined`

type GoodValue = InferGood<typeof validator>
```

### array

```ts
import { array, string } from '@robolex/sure'

const validator = array(string)
```

### tuple

```ts
import { tuple, string, number, InferGood } from '@robolex/sure'

const validator = tuple([string, number])

type GoodValue = InferGood<typeof validator>
```

### literal

```ts
import { literal, string, InferGood } from '@robolex/sure'

const validator = literal('hello')

type GoodValue = InferGood<typeof validator>
```

### recursive

There's some basic support for recursive values

### union

### after

This is the `refine` function from `zod`, but it's much simpler to use.
It runs the first validator, and if it's successful, it runs the second validator.
It returns the first bad value it encounters.

```ts
import { after, string, number, bad, good, InferGood, InferBad } from '@robolex/sure'
import { isIBAN } from 'validator'

const ibanSchema = after(string, val => {
  // `val` is already inferred as a `string`
  if (isIBAN(val)) return good(val)

  return bad(val)
})

type InferredGood = InferGood<typeof ibanSchema>
type InferedBad = InferBad<typeof ibanSchema>
```
