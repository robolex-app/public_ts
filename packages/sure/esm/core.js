export function sure(insure, meta) {
    return Object.assign(insure, { meta });
}
export function pure(insure) {
    return insure;
}
//
// Fail causes errors when used in Jest tests
export const evil = (val) => [false, val];
//
export const good = (val) => [true, val];
