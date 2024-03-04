import { InferGood, InferInput, Sure } from './index.js';
export declare const err: <TSure extends Sure>(schema: TSure) => (input: InferInput<TSure>) => InferGood<TSure>;
