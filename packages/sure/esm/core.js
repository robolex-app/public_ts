export function sure(insure, meta) {
    return Object.assign(insure, { meta });
}
//
// Fail causes errors when used in Jest tests
export const evil = (val) => [false, val];
//
export const good = (val) => [true, val];
