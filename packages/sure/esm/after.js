import { sure, bad } from './core.js';
/**
A common use-case is to first validate that a value is a string.
And then validate other things about the string.

This function will run the @see first validator first.
If it returns a bad value, then the bad value is returned.

If it returns a good value, then the new @see second function will be run.
 */
export function after(first, second) {
    return sure((value) => {
        const [good, out] = first(value);
        return good ? second(out) : bad(out);
    }, {
        first,
        second,
    });
}
