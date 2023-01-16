import {CellText} from './tableContents';

export interface DynamicCellTextUpdateObj {
  newText: CellText;
  rowIndex: number;
  columnIndex: number;
}
