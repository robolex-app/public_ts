import { bad, good, sure } from './core.js';
/**
 * @deprecated
 *
 * It's possible to add a spread operator.
 * But it's seems that it would add a lot of complexity and will have to link the library too much.
 *
 * A tuple would have to know about both the spread and an array.
 *
 * It made sense for `object` and `optional`, since they're linked.
 * But for tuples it can be more clearly implemented as a separate user-land function.
 */
export function spread_NOT_IMPLEMENTED(schema) {
    // IMPORTANT: It's important to pass a new function here
    const val = sure(value => schema(value), {
        parent: spread_NOT_IMPLEMENTED,
        schema,
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
