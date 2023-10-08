export function sure(insure, meta) {
    return Object.assign(insure, meta);
}
//
export const fail = (fail) => [false, fail];
//
export const good = (good) => [true, good];
