/**
  Can be used just for testing. Doesn't do anything at runtime.
 */
export const expectType =
  <TExpected>() =>
  <TActual>(
    value: TActual,

    input: TExpected extends TActual ? (TActual extends TExpected ? true : never) : never
  ) => {}
