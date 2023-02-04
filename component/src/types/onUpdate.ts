import {CELL_UPDATE_TYPE} from '../enums/onUpdateCellType';
import {CellText, TableContent} from './tableContent';

interface CellUpdateDetails {
  text: CellText;
  rowIndex: number;
  columnIndex: number;
  updateType: CELL_UPDATE_TYPE;
}

export type OnCellUpdate = (cellUpdate: CellUpdateDetails) => void;

export type CellDropdownItems = {name: string; backgroundColor?: string}[];

export interface ColumnUpdateDetails {
  columnIndex: number;
  typeName: string;
  cellDropdownItems?: CellDropdownItems;
}

export type OnColumnUpdate = (columnUpdate: ColumnUpdateDetails) => void;

export type OnTableUpdate = (tableUpdate: TableContent) => void;

export type OnColumnWidthsUpdate = (columnWidthsUpdate: number[]) => void;
