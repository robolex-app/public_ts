export const err = (schema) => (input) => {
    const [good, result] = schema(input);
    if (good) {
        // @ts-expect-error Inferred as `unknown`
        return result;
    }
    throw result;
};
