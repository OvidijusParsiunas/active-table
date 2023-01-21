import {CellText} from './tableContent';

export interface DynamicCellTextUpdateT {
  newText: CellText;
  rowIndex: number;
  columnIndex: number;
}
