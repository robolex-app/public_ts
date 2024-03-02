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
What's not easy, is validating an IBAN using `validator.js`, or validating an IBAN, but showing different error messages for countries whose IBAN your
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
  if (typeof value === 'string' && isIBAN(value)) return good(value)

  return bad('not an IBAN')
})

// if you don't want to use the utility function you can do it like this:

const ibanSchema2 = (value => {
  if (typeof value === 'string' && isIBAN(value)) return [true, value] as const

  return [false, 'not an IBAN'] as const
}) satisfies Sure

// The `satisfies` is not strictly necessary, but it provides the type-guarantee that
// your function holds all the necessary requirements to be considered a schema

type InferredGoodIban = InferGood<typeof ibanSchema2>
type InferredBadIban = InferBad<typeof ibanSchema2>
```

## Common utilities:

Of course, there are the basic utilities, for things you'd expect from other type-safe libraries:

### primitives

[/packages/sure/esm/primitives.js](https://github.com/robolex-app/public_ts/blob/main/packages/sure/esm/primitives.js)

The library doesn't provide too many primitives, the idea being, that _you already know how to check if something is a string_.

Other libraries have lots of different views about what a string is (empty or not), or what a number is (NaN or infinity).

Usually I want to validate if something is a positive integer, or if something is a valid age.
In that case I just write a function, that's all.

Nevertheless, there are currently several primitives:

```ts
import { string, number, boolean, nil, undef, unknown } from '@robolex/sure'
import type { InferGood } from '@robolex/sure'

type InferString = InferGood<typeof string>
type InferNumber = InferGood<typeof number>
type InferBoolean = InferGood<typeof boolean>
type InferNil = InferGood<typeof nil>
type InferUndef = InferGood<typeof undef>
type InferUnknown = InferGood<typeof unknown>
```

### `object` and `optional`

[/packages/sure/esm/object.js](https://github.com/robolex-app/public_ts/blob/main/packages/sure/esm/object.js)

```ts
import { object, optional, string, number } from '@robolex/sure'
import type { InferGood } from '@robolex/sure'

const validator = object({
  name: string,
  age: optional(number),
})

// The `optional` is a real optional if you use `exactOptionalPropertyTypes`
// It's not a `number | undefined`

/*
type GoodValue = {
    age?: number;
    name: string;
}
*/
type GoodValue = InferGood<typeof validator>
```

### `array`

[/packages/sure/esm/array.js](https://github.com/robolex-app/public_ts/blob/main/packages/sure/esm/array.js)

```ts
import { array, string } from '@robolex/sure'

const validator = array(string)

/*
type GoodValue = string[]
*/
type GoodValue = InferGood<typeof validator>
```

### **`after`**

This is the `refine` function from `zod`, but it's much simpler to use.
It runs the first validator, and if it's successful, it runs the second validator.
It returns the first bad value it encounters.

```ts
import { after, string, number, bad, good, InferGood, InferBad } from '@robolex/sure'
import { isIBAN } from 'validator'

const ibanSchema = after(string, val => {
  // `val` is already inferred as a `string`
  if (isIBAN(val)) return good(val)

  return bad('not iban')
})

/*
type InferredGood = string
*/
type InferredGood = InferGood<typeof ibanSchema>

/*
type InferedBad = "not string" | "not iban"
*/
type InferedBad = InferBad<typeof ibanSchema>
```

## Other utilities

### `tuple`

[/packages/sure/esm/tuple.js](https://github.com/robolex-app/public_ts/blob/main/packages/sure/esm/tuple.js)

```ts
import { tuple, string, number, InferGood } from '@robolex/sure'

const validator = tuple([string, number])

/*
type GoodValue = [string, number]
*/
type GoodValue = InferGood<typeof validator>
```

### `literal`

[/packages/sure/esm/literal.js](https://github.com/robolex-app/public_ts/blob/main/packages/sure/esm/literal.js)

```ts
import { literal, string, InferGood } from '@robolex/sure'

const validator = literal('hello')

/*
type GoodValue = "hello"
*/
type GoodValue = InferGood<typeof validator>
```

### `union` = `or`

[/packages/sure/esm/union.js](https://github.com/robolex-app/public_ts/blob/main/packages/sure/esm/union.js)

```ts
import { or, string, number, undef, InferGood } from '@robolex/sure'

const maybeString = or(string, undef)

/*
type GoodValue = string | undefined
*/
type GoodValue = InferGood<typeof maybeString>
```

### `intersection`

[/packages/sure/esm/intersection.js](https://github.com/robolex-app/public_ts/blob/main/packages/sure/esm/intersection.js)

```ts
import { and, object, string, number, InferGood } from '@robolex/sure'

const simple = and(
  object({
    name: string,
  }),
  object({
    age: number,
  })
)

/*
type GoodValue = {
    name: string;
} & {
    age: number;
}
*/
type GoodValue = InferGood<typeof simple>
```

### `recursive`

The `recursive` function is a bit more complex, basically, you have an object and you can say that one of the fields is expected to be recursive.

Afterwards you can use the `recurse` function to define the shape of the recursive element.

The idea here is that it's not possible to know the shape of the recursive element before you define the object that contains it.

This was implemented mostly to test the limits of the library.

```ts
import { object, string, array, recurse, recursiveElem } from '@robolex/sure'
import type { InferGood } from '@robolex/sure'

const baseObj = object({
  name: string,
  children: recursiveElem,
})

const recurseSure = recurse(baseObj, recurseSure => {
  return array(recurseSure)
})

/*
type GoodValue = {
    name: string;
    children: {
        name: string;
        children: typeof RecurseSymbol;
    }[];
}
 */
type GoodValue = InferGood<typeof recurseSure>
```

## The `meta` property in the validation function

Things like `object` that return another function which is the actual validator, can have data that's attached to them.

At the moment I don't personally use this feature.

They were added to allow introspection of the validation schema in cases where it might be necessary to

Decided how to store any metadata was a tought decision, especially when validators are simple functions.

The `meta` is a property that can be directly set to a function.

```ts
export type MetaNever = { meta?: never }
export type MetaObj<TMeta = unknown> = { meta: TMeta }
```

This type tells us that a function can either NOT have a `meta` property, or it can have `meta` property that you don't know the type of.

This idea can be applied to any function whatsoever, since any function can either have a `meta` property or not. Most functions don't.

This seemed like the less invasive option.
