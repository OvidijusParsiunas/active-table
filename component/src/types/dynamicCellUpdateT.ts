import {CellText} from './tableContent';

export interface DynamicCellUpdateT {
  newText: CellText;
  rowIndex: number;
  columnIndex: number;
}
