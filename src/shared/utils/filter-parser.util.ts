export function parseFilters(filter: string): Record<string, any> {
    const filters: Record<string, string> = {};
    const filterPairs = filter.split(",");

    filterPairs.forEach(pair => {
        const [key, value] = pair.split(":");
        if (key && value) {
            filters[key] = value;
        }
    });

    return filters;
}
