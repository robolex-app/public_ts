/**
 * Defined using the `sure` function
 *
 * This adds a `{ meta: undefined }` to the passed function
 */
export declare const string: import("./core.js").Sure<"not string", string, unknown, import("./core.js").MetaObj<undefined>>;
/**
 * Defined using the `pure` function
 *
 * The pure function returnes exactly the passed function
 */
export declare const number: import("./core.js").Sure<"not number", number, unknown, import("./core.js").MetaNever>;
/**
 * Defined without using the `sure` or `pure` functions
 *
 * This is the same as the `pure` function
 */
export declare const boolean: (x: unknown) => import("./core.js").Good<boolean> | import("./core.js").Bad<"not boolean">;
export declare const undef: (value: unknown) => import("./core.js").Good<undefined> | import("./core.js").Bad<"not undefined">;
export declare const nil: (value: unknown) => import("./core.js").Good<null> | import("./core.js").Bad<"not null">;
export declare const unknown: import("./core.js").Sure<unknown, unknown, unknown, import("./core.js").MetaNever>;
