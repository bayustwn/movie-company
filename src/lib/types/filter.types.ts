export interface DateRangeFilter {
    from?: Date;
    to?: Date;
}

export interface NumberRangeFilter {
    min?: number;
    max?: number;
}

export interface FilterBuilder {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    where: any;
}
