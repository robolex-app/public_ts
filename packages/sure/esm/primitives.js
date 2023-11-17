import { good, sure, bad } from './core.js';
export const string = sure(x => {
    return typeof x === 'string' //
        ? good(x)
        : bad('not string');
});
export const number = sure(x => {
    return typeof x === 'number' //
        ? good(x)
        : bad('not number');
});
