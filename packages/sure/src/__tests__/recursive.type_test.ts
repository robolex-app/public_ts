import { RecurseSymbol, ReplaceSymbolWithObj } from '../recursive.js'
import { assertEqual, type AssertEqual } from './typeTestUtils.js'

type Obj = {
  a: number
  b: typeof RecurseSymbol
}

type replaced = ReplaceSymbolWithObj<Obj, string | Date>

assertEqual<
  replaced,
  {
    a: number
    b: string | Date
  }
>(true)

// Optional

type OptionalObj = {
  a: number
  b?: typeof RecurseSymbol
}

type replacedOptional = ReplaceSymbolWithObj<OptionalObj, string | Date>

assertEqual<
  replacedOptional,
  {
    a: number
    b?: string | Date | undefined
  }
>(true)

// Undefined
type UndefinedObj = {
  a: number
  b: typeof RecurseSymbol | undefined
}

type replacedUndefined = ReplaceSymbolWithObj<UndefinedObj, string | Date>

assertEqual<
  replacedUndefined,
  {
    a: number
    // TODO: Strange behaviour
    b: string | Date
  }
>(true)

// Optional & Undefined
//
// This is the behaviour we care about
// since it's the output of the `object` function

type OptionalUndefinedObj = {
  a: number
  b?: typeof RecurseSymbol | undefined
}

type replacedOptionalUndefined = ReplaceSymbolWithObj<OptionalUndefinedObj, string | Date>

assertEqual<
  replacedOptionalUndefined,
  {
    a: number
    b?: string | Date | undefined
  }
>(true)
