import { bad, good, sure } from './core.js';
import { isObject } from './object.js';
export function spread(struct) {
    // IMPORTANT: It's important to pass a new function here
    const val = sure(value => struct(value), {
        parent: spread,
        initial: struct.meta,
    });
    // @ts-expect-error - this is fine
    return val;
}
export function tuple(arr) {
    const struct = sure(value => {
        if (!Array.isArray(value)) {
            return bad([]);
        }
        let atLeastOneBad = false;
        let bads = [];
        let goods = [];
        for (let i = 0; i < arr.length; i++) {
            // @ts-expect-error
            const elem = arr[i];
            if (isObject(elem.meta) && elem.meta.parent === spread) {
                // Iterathe through the elements until it doesn't work.
            }
            const [good, unsure] = elem(value[i]);
            if (good) {
                goods.push(unsure);
                // This is necessary in order to maintain the same length
                bads.push(undefined);
            }
            else {
                bads.push(unsure);
                // Since the `bads` array can containe `undefined` values, it's more clear to
                // have an imperative boolean to make the check
                atLeastOneBad = true;
            }
        }
        if (atLeastOneBad) {
            return bad(bads);
        }
        return good(goods);
    }, {
        parent: tuple,
        initial: arr,
    });
    struct.meta;
    // @ts-expect-error
    return struct;
}
