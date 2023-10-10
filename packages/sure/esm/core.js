export function sure(insure, meta) {
    return Object.assign(insure, { meta });
}
//
// Fail causes errors when used in Jest tests
export const fail = (val) => [false, val];
//
export const good = (val) => [true, val];
