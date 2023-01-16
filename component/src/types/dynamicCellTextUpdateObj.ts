import {CellText} from './tableContent';

export interface DynamicCellTextUpdateObj {
  newText: CellText;
  rowIndex: number;
  columnIndex: number;
}
