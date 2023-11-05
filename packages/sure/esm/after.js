import { sure, evil } from './core.js';
export function after(first, second, meta) {
    return sure((value) => {
        const [good, out] = first(value);
        return good ? second(out) : evil(out);
    }, meta);
}
