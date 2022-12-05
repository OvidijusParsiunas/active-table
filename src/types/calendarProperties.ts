// year/month/day (as digits e.g. '2022') and optionally hours/minutes/seconds/milliseconds which are used to help sorting
export type YMDFormat = [string, string, string, string?, string?, string?, string?];

export interface CalendarProperties {
  // this will have to be removed
  separator: string;
  // this will have to be removed
  structureIndexes: {
    day: number;
    month: number;
    year: number;
  };
  // this should be required
  // the reason why this is required is because the calendar API only accepts values in a year/month/day
  // format, hence we need to know be able to parse the custom date string to get the required values and
  // to additionally be able to convert calendar's output back to the format
  dateConversion?: {
    // if format also includes hours, minutes, seconds, milliseconds - include them in the returned tuple
    // because this will also be used for sorting
    toYMD: (cellText: string) => YMDFormat;
    fromYMD: (YMD: YMDFormat) => string;
  };
}

export type DateTypeToProperties = {
  [key: string]: CalendarProperties;
};
