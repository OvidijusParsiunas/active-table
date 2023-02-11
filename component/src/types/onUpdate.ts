import {CELL_UPDATE_TYPE} from '../enums/onUpdateCellType';
import {TableContent} from './tableContent';

interface CellUpdateDetails {
  text: string;
  rowIndex: number;
  columnIndex: number;
  updateType: CELL_UPDATE_TYPE;
}

export type OnCellUpdate = (cellUpdate: CellUpdateDetails) => void;

export type CellDropdownItems = {name: string; backgroundColor?: string}[];

export interface ColumnUpdateDetails {
  width: number;
  typeName: string;
  cellDropdownItems?: CellDropdownItems;
}

export type OnColumnsUpdate = (columnsUpdate: ColumnUpdateDetails[]) => void;

export type OnTableUpdate = (tableUpdate: TableContent) => void;

export type OnColumnWidthsUpdate = (columnWidthsUpdate: number[]) => void;
