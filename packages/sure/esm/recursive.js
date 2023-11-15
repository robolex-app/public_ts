import { bad, good, pure, sure } from './core.js';
const recurseKey = 'recurse';
export const RecurseSymbol = Symbol('recurse');
export const recursiveElem = pure(() => good(RecurseSymbol));
export function recurse(//
baseObj, //
// key: TKey,
childrenPraser) {
    const rec = (value) => {
        const [isGood, unsure] = baseObj(value);
        if (!isGood) {
            return bad(unsure);
        }
        //
        let newChildrenGood = {};
        let newChildrenBad = {};
        for (const [key, value] of Object.entries(unsure)) {
            if (key !== recurseKey)
                continue;
            const [isGood, unsure] = childrenPraser(rec)(value);
            if (!isGood) {
                // @ts-expect-error
                newChildrenBad[key] = unsure;
            }
            else {
                // @ts-expect-error
                newChildrenGood[key] = unsure;
            }
        }
        if (Object.keys(newChildrenBad).length) {
            return bad(newChildrenBad);
        }
        return good({ ...unsure, ...newChildrenGood });
    };
    // @ts-expect-error
    return sure(rec, {
        baseObj,
        childrenPraser,
    });
}
