import {CELL_UPDATE_TYPE} from '../enums/onUpdateCellType';
import {TableData} from './tableData';

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

export type OnDataUpdate = (dataUpdate: TableData) => void;

export type OnColumnWidthsUpdate = (columnWidthsUpdate: number[]) => void;
