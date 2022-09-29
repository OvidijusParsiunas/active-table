// set by the user or inferred
export enum ACTIVE_COLUMN_TYPE {
  Number = 'Number',
  Text = 'Text',
  Currency = 'Currency',
  // REF-3 important for Date_D_M_Y be before Date_M_D_Y as its successful validation has specific logic after it
  Date_D_M_Y = 'Date_D_M_Y',
  Date_M_D_Y = 'Date_M_D_Y',
  Category = 'Category',
}

// this is the default column type which defines that actual column type is inferred automaticallly
enum AUTO {
  Auto = 'Auto',
}

export const USER_SET_COLUMN_TYPE = {...ACTIVE_COLUMN_TYPE, ...AUTO};
export type USER_SET_COLUMN_TYPE = ACTIVE_COLUMN_TYPE | AUTO;
