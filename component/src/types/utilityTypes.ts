// returns a new type with one property of the passed in type set as optional
export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

// returns a new type with one property of the passed in type set as required
export type SetRequired<T, K extends keyof T> = T & {[P in K]-?: T[P]};

// returns a new type only with properties of a particular type
export type PropertiesOfType<T, Value> = {
  [P in keyof T as T[P] extends Value | undefined ? P : never]: T[P];
};

// sets properties that are in K but not in T to optional never
type AssignNever<T, K> = K & {[B in Exclude<keyof T, keyof K>]?: never};

// This type accepts a union of interfaces that contain varying combinations of the CompleteInterface and returns
// a union of interfaces that contain their originally missing properties set to optional never. The reason why
// we have Interfaces extends object is because if we just used AssignNever in InterfacesUnion, TypeScript would
// attempt to intersect all of the passed interfaces, hence this preserves the unions
export type BuildUniqueInterfaces<CompleteInterface, Interfaces> = Interfaces extends object
  ? AssignNever<CompleteInterface, Interfaces>
  : never;

type UnionToIntersection<U> = (U extends unknown ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

// This type accepts a union of interfaces/types and returns a union that can be used to assert a variable to have
// EITHER ONE of those interfaces/types
// It operates by accepting a union of interfaces/types, building up a single interface that contains all of their
// properties and returning the same union of interfaces/types with each one containing additional properties that
// other interfaces had and they didn't with those properties being set to optional never ([propertyName]?: never).
export type InterfacesUnion<Interfaces> = BuildUniqueInterfaces<UnionToIntersection<Interfaces>, Interfaces>;
