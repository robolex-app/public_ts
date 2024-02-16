export type Unionize<T extends object> = {
    [k in keyof T]: {
        k: k;
        v: T[k];
    };
}[keyof T];
export type KVPair<V = unknown> = {
    k: PropertyKey;
    v: V;
};
export type Objectify<T extends KVPair> = {
    [k in T['k']]: Extract<T, {
        k: k;
    }>['v'];
};
export type OmitKV<T extends KVPair, V> = T extends {
    v: V;
} ? never : T;
export type PickKV<T extends KVPair, V> = T extends {
    v: V;
} ? T : never;
export type Prettify<T> = {
    [K in keyof T]: T[K];
} & {};
