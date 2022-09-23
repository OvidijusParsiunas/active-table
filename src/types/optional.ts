// returns a new type with one property of the passed in type set as optional
export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;
