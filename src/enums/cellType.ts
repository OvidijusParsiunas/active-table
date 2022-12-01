import {ACTIVE_COLUMN_TYPE, USER_SET_COLUMN_TYPE} from './columnType';

// these are not accessable to the user
enum AUXILIARY {
  // this is used for a cell that has no text
  Empty = 'Empty',
  // this is used to calculate the amount of dates that apply for both d/m/y and m/d/y formats
  AllDateFormats = 'AllDateFormats',
}

export type CELL_TYPE = ACTIVE_COLUMN_TYPE | AUXILIARY;
export const CELL_TYPE = {...ACTIVE_COLUMN_TYPE, ...AUXILIARY};

// cell types that can be validated
export type VALIDABLE_CELL_TYPE =
  | ACTIVE_COLUMN_TYPE.Number
  | ACTIVE_COLUMN_TYPE.Currency
  // REF-3 important for Date_D_M_Y be before Date_M_D_Y as its successful validation has specific logic after it
  | ACTIVE_COLUMN_TYPE.Date_D_M_Y
  | ACTIVE_COLUMN_TYPE.Date_M_D_Y;
export const VALIDABLE_CELL_TYPE = {
  [ACTIVE_COLUMN_TYPE.Number]: USER_SET_COLUMN_TYPE.Number,
  [ACTIVE_COLUMN_TYPE.Currency]: USER_SET_COLUMN_TYPE.Currency,
  // REF-3 important for Date_D_M_Y be before Date_M_D_Y as its successful validation has specific logic after it
  [ACTIVE_COLUMN_TYPE.Date_D_M_Y]: USER_SET_COLUMN_TYPE.Date_D_M_Y,
  [ACTIVE_COLUMN_TYPE.Date_M_D_Y]: USER_SET_COLUMN_TYPE.Date_M_D_Y,
};
