export const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export const fullNameFromUser = (first: string, last: string) => {
    return `${capitalizeFirstLetter(first)} ${capitalizeFirstLetter(last)}`;
}