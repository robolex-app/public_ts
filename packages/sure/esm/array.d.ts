import { Sure, InferBad, InferGood, MetaNever, MetaObj } from './core.js';
export declare function array<TPropFail, TPropGood, TSchema extends Sure<TPropFail, TPropGood, unknown, MetaObj | MetaNever>>(schema: TSchema): Sure<Array<InferBad<TSchema> | undefined>, Array<InferGood<TSchema>>, unknown, MetaObj<TSchema>>;
