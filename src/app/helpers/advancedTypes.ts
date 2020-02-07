
/**
 * Like Partial<T> but require certain properties.
 */
export type PartialWith<T, Keys extends keyof T = keyof T> =
    Pick<Partial<T>, Exclude<keyof T, Keys>>
    & {
        [K in Keys]: T[K]
    };
