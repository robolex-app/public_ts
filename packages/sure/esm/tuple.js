import { bad, good, sure } from './core.js';
export function tupleRest(struct) {
    const val = sure(struct, {
        func: tupleRest,
        initial: struct.meta,
    });
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
    }, arr);
    // @ts-expect-error
    return struct;
}
