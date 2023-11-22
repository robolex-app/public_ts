import { bad, good, pure, sure } from './core.js';
export const RecurseSymbol = Symbol('recurse');
export const recursiveElem = pure(() => good(RecurseSymbol));
export function recurse(//
baseObj, //
// key: TKey,
childParser) {
    const rec = (value) => {
        const [isGoodObj, unsureObj] = baseObj(value);
        if (!isGoodObj) {
            return bad(unsureObj);
        }
        //
        let newChildrenGood = {};
        let newChildrenBad = {};
        for (const [key, elem] of Object.entries(unsureObj)) {
            if (elem !== RecurseSymbol)
                continue;
            // @ts-expect-error
            const [isGood, unsure] = childParser(rec)(
            // here we send the value from the original object
            // Seems dangerous, maybe other implementation is better
            // @ts-expect-error TODO: fix
            value[key]);
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
        return good({ ...unsureObj, ...newChildrenGood });
    };
    // @ts-expect-error
    return sure(rec, {
        baseObj,
        childrenPraser: childParser,
    });
}
