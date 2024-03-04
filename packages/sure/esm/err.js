export const err = (schema) => (input) => {
    const [good, result] = schema(input);
    if (good) {
        return result;
    }
    throw result;
};
