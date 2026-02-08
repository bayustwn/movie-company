export interface DateRangeFilter {
    from?: Date;
    to?: Date;
}

export interface NumberRangeFilter {
    min?: number;
    max?: number;
}

export interface FilterBuilder {
    where: any;
}
