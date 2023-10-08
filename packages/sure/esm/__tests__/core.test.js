import { sure, good, fail } from '../sure.js';
import { assertIs, assertEqual } from '../typeTestUtils.js';
/**
Validator for numbers without any meta.
 */
const sureNumber = sure(value => typeof value === 'number' //
    ? good(value)
    : fail('not a number'));
/**
Validator for strings with meta.
 */
const sureStringMeta = sure(value => typeof value === 'string' //
    ? good(value)
    : fail('not a string'), { myMeta: 'my meta' });
/**
Validator that expects the input to already be a string.
 */
const sureNonEmptyString = sure((value) => value.length > 0 //
    ? good(value)
    : fail('empty string'));
/**
Validator that can return multiple error types
 */
const sureMultipleErrors = sure(value => {
    if (typeof value !== 'string')
        return fail('not a string');
    if (value.length < 3)
        return fail('too small');
    if (value.length > 10)
        return fail('too big');
    // The `string & {}` is used as an example, when the return type has to be more controlled
    return good(value);
});
describe('core', () => {
    it('should return good value', () => {
        const [isNumber, unsure] = sureNumber(1);
        expect(isNumber).toBe(true);
        expect(unsure).toBe(1);
        assertIs(unsure);
        if (isNumber) {
            assertIs(unsure);
        }
        else {
            assertIs(unsure);
        }
    });
    it('should return bad value', () => {
        const [isNumber, unsure] = sureNumber('1');
        expect(isNumber).toBe(false);
        expect(unsure).toBe('not a number');
    });
    it('should not accept inputs that are not strings', () => {
        // @ts-expect-error
        sureNonEmptyString(1);
    });
    it('should accept inputs that are strings', () => {
        const [isValid, unsure] = sureNonEmptyString('1');
        expect(isValid).toBe(true);
        expect(unsure).toBe('1');
    });
    it('should accept inputs that are strings, then fail', () => {
        const [isValid, unsure] = sureNonEmptyString('');
        expect(isValid).toBe(false);
        expect(unsure).toBe('empty string');
    });
    it('should have strong types', () => {
        const [isNumber, unsure] = sureNumber(1);
        assertIs(isNumber);
        assertIs(unsure);
        if (isNumber) {
            assertIs(isNumber);
            assertIs(unsure);
        }
        else {
            assertIs(isNumber);
            assertIs(unsure);
        }
    });
    it('type inference should work', () => {
        assertEqual(true);
        assertEqual(true);
        assertEqual(true);
        assertEqual(true);
    });
    it('should have strong types with meta', () => {
        assertEqual(true);
        assertEqual(true);
        assertEqual(true);
        assertEqual(true);
        assertEqual(true);
    });
    it('should have strong types for validators with custom input', () => {
        assertEqual(true);
        assertEqual(true);
        assertEqual(true);
        assertEqual(true);
    });
    it('should have strong types for validators with multiple errors', () => {
        assertEqual(true);
        assertEqual(true);
        assertEqual(true);
        assertEqual(true);
    });
});
