import { Fail, good, sure } from './sure.js'

/**
`isNumber` on hover `Sure<"not a number", number, unknown>`
*/
const number = sure(value => {
  return typeof value === 'number' //
    ? good(value)
    : fail('not a number' as const)
}, 'number' as const)

/**
`isGood` on hover: `"good" | "fail"`
`unsure` on hover: `number | "not a number"`
 */
const [isNumber, unsure] = number(1)

if (isNumber) {
  // on hover: `number`
  unsure
} else {
  // on hover: `"not a number"`
  unsure
}
