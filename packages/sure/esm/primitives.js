import { good, sure, bad, pure } from './core.js';
/**
 * Defined using the `sure` function
 *
 * This adds a `{ meta: undefined }` to the passed function
 */
export const string = sure(x => {
    return typeof x === 'string' //
        ? good(x)
        : bad('not string');
}, undefined);
/**
 * Defined using the `pure` function
 *
 * The pure function returnes exactly the passed function
 */
export const number = pure(x => {
    return typeof x === 'number' //
        ? good(x)
        : bad('not number');
});
/**
 * Defined without using the `sure` or `pure` functions
 *
 * This is the same as the `pure` function
 */
export const boolean = (x) => {
    return typeof x === 'boolean' //
        ? good(x)
        : bad('not boolean');
};
export const undef = (value) => {
    return value === undefined //
        ? good(value)
        : bad('not undefined');
};
export const nil = (value) => {
    return value === null //
        ? good(value)
        : bad('not null');
};
export const unknown = pure(x => good(x));
