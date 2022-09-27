// set by the user or inferred
export enum ACTIVE_COLUMN_TYPE {
  Number = 'Number',
  Text = 'Text',
  Date = 'Date',
}

// this is the default column type which defines that actual column type is inferred automaticallly
enum AUTO {
  Auto = 'Auto',
}

export const USER_SET_COLUMN_TYPE = {...ACTIVE_COLUMN_TYPE, ...AUTO};
export type USER_SET_COLUMN_TYPE = ACTIVE_COLUMN_TYPE | AUTO;
