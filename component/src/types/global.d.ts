declare global {
  interface Array<T> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    findLastIndex(predicate: (value: T, index: number, obj: T[]) => unknown, thisArg?: any): number;
  }
}

export {};
