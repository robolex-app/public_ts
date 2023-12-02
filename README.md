
## Headless Type-safe validation library for Javascript

This is the core of the package (the types are stripped).

https://github.com/robolex-app/public_ts/blob/e2af35c1d4d6342a1338b92f2a69639a64cdb286/packages/sure/esm/core.js#L1-L11

Everything else is based on the idea that a function can either return a `[true, <validated thing>]` or a `[false, <some failure message>]`

## The core library in this:

`./esm/core.js`

```
export function sure(insure, meta) {
    return Object.assign(insure, { meta });
}
export function pure(insure) {
    return insure;
}
export function bad(val) {
    return [false, val];
}
export function good(val) {
    return [true, val];
}
```

Everything else is based on the core types and those 4 functions.

## Common utilities:

### object
### array
### tuple
### literal
### recursive
### union

### after ?