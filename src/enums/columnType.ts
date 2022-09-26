import {CELL_TYPE} from './cellType';

export enum ACTIVE_COLUMN_TYPE {
  Number = CELL_TYPE.Number,
  Text = CELL_TYPE.Text,
}

export enum USER_SET_COLUMN_TYPE {
  Number = ACTIVE_COLUMN_TYPE.Number,
  Text = ACTIVE_COLUMN_TYPE.Text,
  // this is the default column type which allows actual column type to be inferred automaticallly
  Auto,
}
