import { good, sure, evil } from './core.js';
export const string = sure(x => {
    return typeof x === 'string' //
        ? good(x)
        : evil('not string');
});
export const number = sure(x => {
    return typeof x === 'number' //
        ? good(x)
        : evil('not number');
});
