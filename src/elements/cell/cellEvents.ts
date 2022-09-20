import {EditableTableComponent} from '../../editable-table-component';
import {CELL_UPDATE_TYPE} from '../../enums/onUpdateCellType';

export class CellEvents {
  // prettier-ignore
  public static updateCell(etc: EditableTableComponent,
      newText: string | undefined, rowIndex: number, columnIndex: number, target?: HTMLElement): void {
    if (newText === undefined || newText === null) return;
    etc.contents[rowIndex][columnIndex] = newText;
    if (target) target.textContent = newText;
    etc.onCellUpdate(newText, rowIndex, columnIndex, CELL_UPDATE_TYPE.UPDATE);
    etc.onTableUpdate(etc.contents);
  }

  // prettier-ignore
  public static updateCellWithPreprocessing(etc: EditableTableComponent,
      rowIndex: number, columnIndex: number, newText: string, cell?: HTMLElement): void {
    const processedText = newText?.trim();
    CellEvents.updateCell(etc, processedText, rowIndex, columnIndex, cell);
  }
}
