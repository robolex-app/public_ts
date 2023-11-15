import { sure, evil, good } from './core.js';
export function array(schema) {
    const struct = sure(value => {
        if (!Array.isArray(value)) {
            return evil([]);
        }
        let atLeastOneEvil = false;
        let evils = [];
        let goods = [];
        for (const elem of value) {
            const [good, unsure] = schema(elem);
            if (good) {
                goods.push(unsure);
                // This is necessary in order to maintain the same length
                evils.push(undefined);
            }
            else {
                evils.push(unsure);
                // Since the `evils` array can containe `undefined` values, it's more clear to
                // have an imperative boolean to make the check
                atLeastOneEvil = true;
            }
        }
        if (atLeastOneEvil) {
            return evil(evils);
        }
        return good(goods);
    }, schema);
    // @ts-expect-error Expected error
    return struct;
}
