import { bad, good, sure } from './core.js';
// Remove this
import { number, string } from './primitives.js';
// type ExtractTuple <T extends Peasy<unknown>[]> =
const someTuple = tuple([number, string, number]);
const testValue = [number, string, number];
export function tuple(arr) {
    const struct = sure(value => {
        if (!Array.isArray(value)) {
            return bad([]);
        }
        let atLeastOneBad = false;
        let bads = [];
        let goods = [];
        for (const [i, elem] of arr.entries()) {
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
