import { bad, good, pure } from './core.js';
export const literal = (value) => {
    return pure(val => val === value //
        ? good(
        // @ts-expect-error We do an explicit check above
        val)
        : bad(`not literal ${typeof value} (${String(value)})`));
};
