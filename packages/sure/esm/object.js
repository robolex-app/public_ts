import { sure, good, evil } from './core.js';
/**
Necessary because `typeof x` is not a type guard.
 */
function isObject(x) {
    return typeof x === 'object' && x !== null;
}
export function object(schema) {
    const struct = sure(value => {
        if (!isObject(value)) {
            return evil({});
        }
        const groupFail = {};
        const groupGood = {};
        for (const [key, sureFunction] of Object.entries(schema)) {
            // TODO: Make different between `| undefined` and `?: somthing`
            // check if key actually exists
            const [good, unsure] = sureFunction(value[key]);
            if (good) {
                // @ts-expect-error
                groupGood[key] = unsure;
            }
            else {
                // @ts-expect-error
                groupFail[key] = unsure;
            }
        }
        if (Object.keys(groupFail).length) {
            return evil(groupFail);
        }
        return good(groupGood);
    }, schema);
    // @ts-expect-error
    return struct;
}
