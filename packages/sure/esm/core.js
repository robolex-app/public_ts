export function sure(insure, meta) {
    return Object.assign(insure, { meta });
}
export function pure(insure) {
    return insure;
}
//
export const bad = (val) => [false, val];
//
export const good = (val) => [true, val];
