import {ACTIVE_COLUMN_TYPE, USER_SET_COLUMN_TYPE} from './columnType';

// this is used for a cell that has the defaultCellValue, it is never used as a type for the column
enum DEFAULT {
  Default = 'Default',
}

export type CELL_TYPE = ACTIVE_COLUMN_TYPE | DEFAULT;
export const CELL_TYPE = {...ACTIVE_COLUMN_TYPE, ...DEFAULT};

// cell types that can be validated
export type VALIDABLE_CELL_TYPE = ACTIVE_COLUMN_TYPE.Number | ACTIVE_COLUMN_TYPE.Date | ACTIVE_COLUMN_TYPE.Currency;
export const VALIDABLE_CELL_TYPE = {
  [ACTIVE_COLUMN_TYPE.Number]: USER_SET_COLUMN_TYPE.Number,
  [ACTIVE_COLUMN_TYPE.Date]: USER_SET_COLUMN_TYPE.Date,
  [ACTIVE_COLUMN_TYPE.Currency]: USER_SET_COLUMN_TYPE.Currency,
};
