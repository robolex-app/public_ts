import { sure, bad, good } from './core.js';
export function intersection(first, second) {
    return sure(
    // @ts-expect-error Should be fixed at the definition of sure, I think.
    (value) => {
        const [isGoodFirst, unsureFirst] = first(value);
        if (!isGoodFirst) {
            return bad(unsureFirst);
        }
        const [isGoodSecond, unsureSecond] = second(value);
        if (!isGoodSecond) {
            return bad(unsureSecond);
        }
        // TODO: Should we enforce that the outputs are objects?
        return good({ ...unsureFirst, ...unsureSecond });
    }, {
        first,
        second,
    });
}
