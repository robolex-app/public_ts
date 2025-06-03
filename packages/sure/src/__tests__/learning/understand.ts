import { Prettify } from '../../utils.js'

export interface $ZodType<O = unknown, I = unknown> {
  _zod: $ZodTypeInternals<O, I>
  // "~standard": StandardSchemaV1.Props<core.input<this>, core.output<this>>;
}
export interface ZodType<out Output = unknown, out Input = unknown> extends $ZodType<Output, Input> {}

export type $ZodLooseShape = Record<string, any>

export type $ZodShape = Readonly<{ [k: string]: $ZodType }>

export interface $ZodTypeInternals<out O = unknown, out I = unknown> {
  output: O //extends { $out: infer O } ? O : Out;
}

type OptionalOutSchema = { _zod: { optionality: 'optional' } }

export type output<T extends $ZodType> = T['_zod'] extends { '~output': any }
  ? T['_zod']['~output']
  : T['_zod']['output']

export type $InferObjectOutput<T extends $ZodLooseShape, Extra extends Record<string, unknown>> = string extends keyof T
  ? object
  : keyof T extends never
  ? Record<string, never>
  : Prettify<
      {
        -readonly [k in keyof T as T[k] extends OptionalOutSchema ? never : k]: output<T[k]>
      } & {
        -readonly [k in keyof T as T[k] extends OptionalOutSchema ? k : never]?: output<T[k]>
      }
    > &
      Extra

export interface $ZodObjectInternals<
  // @ts-ignore Cast variance
  out Shape extends Readonly<$ZodShape> = Readonly<$ZodShape>,
  out OutExtra extends Record<string, unknown> = Record<string, unknown>,
  out InExtra extends Record<string, unknown> = Record<string, unknown>,
> extends $ZodTypeInternals<any, any> {
  // def: $ZodObjectDef<Shape>;
  // outextra: OutExtra;
  // inextra: InExtra;
  // isst: errors.$ZodIssueInvalidType | errors.$ZodIssueUnrecognizedKeys;
  // disc: util.DiscriminatorMap;

  // special keys only used for objects
  // not defined on $ZodTypeInternals (base interface) because it breaks cyclical inference
  // the z.infer<> util checks for these first when extracting inferred type
  '~output': $InferObjectOutput<Shape, OutExtra>
  // "~input": $InferObjectInput<Shape, InExtra>;
}

export interface ZodObject<
  // @ts-ignore cast variance
  out Shape extends $ZodShape,
  OutExtra extends Record<string, unknown>,
  InExtra extends Record<string, unknown>,
> extends ZodType {
  _zod: $ZodObjectInternals<Shape, OutExtra, InExtra>
  shape: Shape
}

export function object<T extends $ZodLooseShape>(shape?: T): ZodObject<T, {}, {}> {
  // @ts-expect-error whatever
  return null
}

const Cat = object({
  get sub() {
    return Cat
  },
})

type test = output<typeof Cat>

const tes: test = {
  sub: {
    sub: {
      sub: null as unknown as test,
    },
  },
}
