import {CELL_UPDATE_TYPE} from '../enums/onUpdateCellType';
import {CellText, TableContent} from './tableContent';
import {ColumnsWidths} from './columnsWidths';

export type OnCellUpdate = (
  newText: CellText,
  cellRowIndex: number,
  cellColumnIndex: number,
  updateType: CELL_UPDATE_TYPE
) => void;

export type ColumUpdateItems = {name: string; backgroundColor?: string}[];

export interface ColumnUpdateDetails {
  columnIndex: number;
  typeName: string;
  items?: ColumUpdateItems;
}

export type OnColumnUpdate = (columnUpdate: ColumnUpdateDetails) => void;

export type OnTableUpdate = (tableUpdate: TableContent) => void;

export type OnColumnWidthsUpdate = (widthsUpdate: ColumnsWidths) => void;
