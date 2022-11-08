// returns a new type with one property of the passed in type set as optional
export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

// returns a new type only with properties of a particular type
export type PropertiesOfType<T, Value> = {
  [P in keyof T as T[P] extends Value | undefined ? P : never]: T[P];
};
