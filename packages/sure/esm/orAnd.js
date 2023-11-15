import { bad, good, sure } from './core.js';
export function or(first, second) {
    return sure(
    // @ts-expect-error Should be fixed at the definition of sure, I think.
    (value) => {
        const [isGoodFirst, unsureFirst] = first(value);
        if (isGoodFirst) {
            return good(unsureFirst);
        }
        return second(value);
    }, {
        first,
        second,
    });
}
export function and(first, second) {
    // @ts-expect-error Should be fixed at the definition of sure, I think.
    return sure(
    // @ts-expect-error Should be fixed at the definition of sure, I think.
    (value) => {
        const [isGoodFirst, unsureFirst] = first(value);
        if (!isGoodFirst) {
            return bad(unsureFirst);
        }
        return second(value);
    }, {
        first,
        second,
    });
}
