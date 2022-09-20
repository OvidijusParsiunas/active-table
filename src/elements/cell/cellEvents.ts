import {NumberOfIdenticalCells} from '../../utils/numberOfIdenticalCells';
import {EditableTableComponent} from '../../editable-table-component';
import {CELL_UPDATE_TYPE} from '../../enums/onUpdateCellType';

export class CellEvents {
  public static readonly EMPTY_STRING = '';

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

  // WORK - duplicate headers allowed
  // prettier-ignore
  public static ifEmptyCellSetToDefault(
      etc: EditableTableComponent, rowIndex: number, columnIndex: number, cell: HTMLElement) {
    const cellText = cell.textContent?.trim();
    if (cellText !== undefined) {
      if ((etc.defaultCellValue !== CellEvents.EMPTY_STRING && cellText === CellEvents.EMPTY_STRING) ||
          (rowIndex === 0 && !etc.duplicateHeadersAllowed && NumberOfIdenticalCells.get(cellText, etc.contents[0]) > 1)) {
        CellEvents.updateCell(etc, etc.defaultCellValue, rowIndex, columnIndex, cell);
      }
    }
  }
}
