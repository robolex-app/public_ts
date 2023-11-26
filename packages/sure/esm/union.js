import { good, sure } from './core.js';
export function union(first, second) {
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
