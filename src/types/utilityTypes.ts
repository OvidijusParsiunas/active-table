// returns a new type with one property of the passed in type set as optional
export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

// returns a new type only with properties of a particular type
export type PropertiesOfType<T, Value> = {
  [P in keyof T as T[P] extends Value | undefined ? P : never]: T[P];
};

// sets properties that are in K but not in T to optional never
type AssignNever<T, K> = K & {[B in Exclude<keyof T, keyof K>]?: never};

// This facilitates a type that accepts a variety of interfaces that accept different combinations of properties
// Operates by accepting a union of such interfaces that contain varying combinations of the  CompleteInterface
// and returns a union of interfaces that contain their originally missing properties set to optional never.
// The reason why we have Interfaces extends object is because if we just used AssignNever, TypeScript would
// attempt to combine all of the interfaces, hence this allows unions to be preserved
export type InterfacesUnion<CompleteInterface, Interfaces> = Interfaces extends object
  ? AssignNever<CompleteInterface, Interfaces>
  : never;
