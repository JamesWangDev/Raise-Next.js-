import snakeCase from "just-snake-case";
export const snakeCaseKeys = (obj) => {
    if (Array.isArray(obj)) {
        return obj.map((v) => snakeCaseKeys(v));
    } else if (obj != null && obj.constructor === Object) {
        return Object.keys(obj).reduce(
            (result, key) => ({
                ...result,
                [snakeCase(key)]: snakeCaseKeys(obj[key]),
            }),
            {}
        );
    }
    return obj;
};
