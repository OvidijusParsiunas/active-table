import {ColumnSettings} from './columnsSettings';

// should be used internally
export type ColumnSettingsInternal = Omit<ColumnSettings, 'columnName'>;

// should be used internally
// the benefits of this over the client provided array is that settings can be accessed immediately when
// cell text is known instead of traversing an array.
export type ColumnsSettingsMap = {
  [columnName: string]: ColumnSettingsInternal;
};
