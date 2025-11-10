export const truncateWords = (str, limit = 8) => {
    if (!str) return "";
    const words = str.split(" ");
    return words.length > limit
        ? words.slice(0, limit).join(" ") + "..."
        : str;
};