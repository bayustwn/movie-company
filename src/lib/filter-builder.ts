import type { DateRangeFilter, NumberRangeFilter, FilterBuilder } from "./types/filter.types";

export type { DateRangeFilter, NumberRangeFilter, FilterBuilder };

export function createFilterBuilder(): FilterBuilder {
    return { where: {} };
}

export function addStringFilter(
    builder: FilterBuilder,
    field: string,
    value?: string
): FilterBuilder {
    if (value) {
        builder.where[field] = value;
    }
    return builder;
}

export function addStringContainsFilter(
    builder: FilterBuilder,
    field: string,
    value?: string
): FilterBuilder {
    if (value) {
        builder.where[field] = {
            contains: value,
            mode: "insensitive"
        };
    }
    return builder;
}

export function addBooleanFilter(
    builder: FilterBuilder,
    field: string,
    value?: boolean
): FilterBuilder {
    if (value !== undefined) {
        builder.where[field] = value;
    }
    return builder;
}

export function addEnumFilter(
    builder: FilterBuilder,
    field: string,
    value?: string
): FilterBuilder {
    if (value) {
        builder.where[field] = value;
    }
    return builder;
}

export function addArrayHasFilter(
    builder: FilterBuilder,
    field: string,
    value?: string
): FilterBuilder {
    if (value) {
        builder.where[field] = { has: value };
    }
    return builder;
}

export function addArrayHasSomeFilter(
    builder: FilterBuilder,
    field: string,
    values?: string[]
): FilterBuilder {
    if (values && values.length > 0) {
        builder.where[field] = { hasSome: values };
    }
    return builder;
}

export function addDateRangeFilter(
    builder: FilterBuilder,
    field: string,
    range?: DateRangeFilter
): FilterBuilder {
    if (range?.from || range?.to) {
        builder.where[field] = {};
        if (range.from) {
            builder.where[field].gte = range.from;
        }
        if (range.to) {
            builder.where[field].lte = range.to;
        }
    }
    return builder;
}

export function addNumberRangeFilter(
    builder: FilterBuilder,
    field: string,
    range?: NumberRangeFilter
): FilterBuilder {
    if (range?.min !== undefined || range?.max !== undefined) {
        builder.where[field] = {};
        if (range.min !== undefined) {
            builder.where[field].gte = range.min;
        }
        if (range.max !== undefined) {
            builder.where[field].lte = range.max;
        }
    }
    return builder;
}

export function addSearchFilter(
    builder: FilterBuilder,
    fields: string[],
    value?: string
): FilterBuilder {
    if (value && fields.length > 0) {
        builder.where.OR = fields.map(field => ({
            [field]: {
                contains: value,
                mode: "insensitive"
            }
        }));
    }
    return builder;
}

export function getWhere(builder: FilterBuilder): any {
    return builder.where;
}
