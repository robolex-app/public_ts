import { Sure } from './index.js';
export declare const err: <TInput, TGood, TSure extends Sure<unknown, TGood, TInput>>(schema: TSure) => (input: TInput) => TGood;
