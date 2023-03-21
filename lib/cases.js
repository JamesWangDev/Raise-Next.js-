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

export function titleCase(str) {
    var i, j, str, lowers, uppers;
    str = str.replace(/([^\W_]+[^\s-]*) */g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });

    // Certain minor words should be left lowercase unless
    // they are the first or last words in the string
    lowers = [
        "A",
        "An",
        "The",
        "And",
        "But",
        "Or",
        "For",
        "Nor",
        "As",
        "At",
        "By",
        "For",
        "From",
        "In",
        "Into",
        "Near",
        "Of",
        "On",
        "Onto",
        "To",
        "With",
    ];
    for (i = 0, j = lowers.length; i < j; i++)
        str = str.replace(new RegExp("\\s" + lowers[i] + "\\s", "g"), function (txt) {
            return txt.toLowerCase();
        });

    // Certain words such as initialisms or acronyms should be left uppercase
    uppers = ["Id", "Tv"];
    for (i = 0, j = uppers.length; i < j; i++)
        str = str.replace(new RegExp("\\b" + uppers[i] + "\\b", "g"), uppers[i].toUpperCase());

    return str;
}
