import {CellText} from './tableContent';

export interface ProgrammaticCellUpdateT {
  newText: CellText;
  rowIndex: number;
  columnIndex: number;
}
