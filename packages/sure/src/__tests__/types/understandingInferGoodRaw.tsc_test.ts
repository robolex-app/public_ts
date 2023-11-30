import { InferInput, InferMeta, MetaNever, MetaObj, Sure } from '../../core.js'
import { assertEqual } from '../typeTestUtils.js'

type InferBad_initial<
  T extends Sure<
    unknown,
    unknown,
    // Input issue
    any,
    MetaObj | MetaNever
  >,
> = //
  T extends Sure<
    infer CFailure,
    unknown,
    // Input issue
    any,
    MetaObj | MetaNever
  >
    ? //
      CFailure
    : never

type InferGood_initial<
  T extends Sure<
    unknown,
    unknown,
    // Input issue
    any,
    MetaObj | MetaNever
  >,
> = //
  T extends Sure<
    unknown,
    infer CDefine,
    // Input issue
    any,
    MetaObj | MetaNever
  >
    ? //
      CDefine
    : never

const rawNumber = (value: unknown) => {
  return typeof value === 'number' //
    ? ([true, value] as const)
    : ([false, 'not a number'] as const)
}

// Satisfies shoudl work
const satisfied = rawNumber satisfies Sure

type InferredGood = InferGood_initial<typeof satisfied>
type InferredBad = InferBad_initial<typeof satisfied>
type InferredInput = InferInput<typeof satisfied>
type InferredMeta = InferMeta<typeof satisfied>

// IMPORTANT: This is the test
// @ts-expect-error  - This is the problem
assertEqual<InferredGood, number>(true)
// @ts-expect-error  - This is the problem
assertEqual<InferredBad, 'not a number'>(true)

assertEqual<InferredInput, unknown>(true)
// @ts-expect-error  - This is the problem
assertEqual<InferredMeta, MetaNever>(true)

type InferredGoodRaw = InferGoodRaw<typeof rawNumber>

assertEqual<InferredGoodRaw, number>(true)

type OutputType = ReturnType<typeof rawNumber>
{
  assertEqual<
    //
    OutputType,
    readonly [true, number] | readonly [false, 'not a number']
  >(true)
}

// In order to check the type of the output
type SimpleOutputType = [true, number] | [false, 'not a number']

// From documentation
// When conditional types act on a generic type, they become distributive when given a union type.

{
  type ExtractSimple<T> = //
    T extends [true, infer CGood] //
      ? CGood
      : never

  type ExtractedGood = ExtractSimple<SimpleOutputType>
  assertEqual<ExtractedGood, number>(true)

  type ExtractedGoodReadonly = ExtractSimple<OutputType>
  // @ts-expect-error - This is the problem
  assertEqual<ExtractedGoodReadonly, number>(true)
  //
}

type ExtractComplex<T> = //
  T extends readonly [true, infer CGood] //
    ? CGood
    : never

{
  type ExtractedGood = ExtractComplex<SimpleOutputType>
  assertEqual<ExtractedGood, number>(true)

  type ExtractedGoodReadonly = ExtractComplex<OutputType>
  assertEqual<ExtractedGoodReadonly, number>(true)
}

type afdf = ReturnType<typeof rawNumber>

// # Important: This is the solution
type ExtractDirectly<T> = //
  T extends (...args: any) => infer COutput //
    ? COutput extends readonly [true, infer CGood] //
      ? CGood
      : never
    : never

{
  type ExtractedGood = ExtractDirectly<() => SimpleOutputType>
  assertEqual<ExtractedGood, number>(true)

  type ExtractedGoodReadonly = ExtractDirectly<typeof rawNumber>
  assertEqual<ExtractedGoodReadonly, number>(true)
}

// Try to simplify but doesn't work
type ExtractDirectly01<T extends (...args: any) => any> = //
  ReturnType<T> extends readonly [true, infer CGood] //
    ? CGood
    : never

{
  type ExtractedGood = ExtractDirectly01<() => SimpleOutputType>
  // @ts-expect-error Doesn't work
  assertEqual<ExtractedGood, number>(true)

  type ExtractedGoodReadonly = ExtractDirectly01<typeof rawNumber>
  // @ts-expect-error Doesn't work
  assertEqual<ExtractedGoodReadonly, number>(true)
}

type ExtractDirectly02<
  //
  T extends (...args: any) => any,
  // Now `Inferred` is a `generic` type and will be distributed?
  // Unfortunatelly no
  Inferred = OutputType,
> = OutputType extends readonly [
  //
  true,
  infer CGood,
] //
  ? CGood
  : never

{
  type ExtractedGood = ExtractDirectly02<() => SimpleOutputType>
  // @ts-expect-error Also doesn't work
  assertEqual<ExtractedGood, number>(true)

  type ExtractedGoodReadonly = ExtractDirectly02<typeof rawNumber>
  // @ts-expect-error Also doesn't work
  assertEqual<ExtractedGoodReadonly, number>(true)
}

type InferGoodRaw<
  // Add the Sure constraint
  T extends Sure<
    unknown,
    unknown,
    // Input issue
    any,
    MetaObj | MetaNever
  >,
> = //
  T extends (...args: any) => infer COutput //
    ? COutput extends readonly [true, infer CGood] //
      ? CGood
      : never
    : never

{
  type ExtractedGood = InferGoodRaw<typeof rawNumber>
  assertEqual<ExtractedGood, number>(true)

  type ExtractedGoodReadonly = InferGoodRaw<typeof satisfied>
  assertEqual<ExtractedGoodReadonly, number>(true)
}
