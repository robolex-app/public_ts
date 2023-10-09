export function sure(insure, meta) {
    return Object.assign(insure, { meta });
}
//
// Fail causes errors when used in Jest tests
export const fail = (fail) => [false, fail];
export const evil = (fail) => [false, fail];
//
export const good = (good) => [true, good];
