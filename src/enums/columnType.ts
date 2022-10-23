import {GenericObject} from '../types/genericObject';
// WORK - this is not static and should be eligible for the user to edit

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

// Date_D_M_Y and Date_M_D_Y are added here by the populateDefaultDateTypes method invocation
export const DATE_COLUMN_TYPE: GenericObject = {};

export const TEXT_DIV_COLUMN_TYPE: GenericObject = {[ACTIVE_COLUMN_TYPE.Category]: ACTIVE_COLUMN_TYPE.Category};

// this is the default column type which defines that actual column type is inferred automaticallly
enum AUTO {
  Auto = 'Auto',
}

export const USER_SET_COLUMN_TYPE = {...ACTIVE_COLUMN_TYPE, ...AUTO};
export type USER_SET_COLUMN_TYPE = ACTIVE_COLUMN_TYPE | AUTO;
