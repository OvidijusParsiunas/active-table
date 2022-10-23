export interface DateProperties {
  separator: string;
  structureIndexes: {
    day: number;
    month: number;
    year: number;
  };
}

export type DateTypeToProperties = {
  [key: string]: DateProperties;
};
