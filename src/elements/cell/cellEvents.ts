import {DataUtils} from '../../utils/insertRemoveStructure/shared/dataUtils';
import {EditableTableComponent} from '../../editable-table-component';
import {CELL_UPDATE_TYPE} from '../../enums/onUpdateCellType';

// operates in an opt in basis for various operations
interface UpdateCellOptions {
  element?: HTMLElement;
  updateTableEvent?: boolean;
  processText?: boolean;
}

export class CellEvents {
  public static readonly EMPTY_STRING = '';

  private static executeUpdateOpration(operation: keyof UpdateCellOptions, options?: UpdateCellOptions) {
    return options?.[operation] === undefined || options[operation] === true;
  }

  // this is mostly handled by operations that do not operate with the insertion of new cells as the insertion of new cells
  // handles some of the instructions below inin a different order asynchronously for maximum efficiency
  // prettier-ignore
  public static updateCell(etc: EditableTableComponent,
      cellText: string, rowIndex: number, columnIndex: number, options?: UpdateCellOptions): void {
    if (CellEvents.executeUpdateOpration('processText', options)) {
      cellText = DataUtils.processCellText(etc, rowIndex, cellText); 
    }
    etc.contents[rowIndex][columnIndex] = cellText;
    etc.onCellUpdate(cellText, rowIndex, columnIndex, CELL_UPDATE_TYPE.UPDATE);
    if (options?.element) options.element.textContent = cellText;
    if (CellEvents.executeUpdateOpration('updateTableEvent', options)) etc.onTableUpdate(etc.contents); 
  }

  // this is used for cases where you only want to update if a cell has to be set to default
  // prettier-ignore
  public static setCellToDefaultIfNeeded(
      etc: EditableTableComponent, rowIndex: number, columnIndex: number, cell: HTMLElement) {
    const cellText = cell.textContent as string;
    const processedCellText = DataUtils.processCellText(etc, rowIndex, cellText);
    if (processedCellText !== cellText) {
      CellEvents.updateCell(etc, processedCellText, rowIndex, columnIndex, { element: cell, processText: false });
    }
  }

  // prettier-ignore
  public static removeTextIfCellDefault(this: EditableTableComponent,
      rowIndex: number, columnIndex: number, event: FocusEvent) {
    if (this.defaultCellValue !== CellEvents.EMPTY_STRING
        && this.defaultCellValue === (event.target as HTMLElement).textContent) {
      CellEvents.updateCell(this, CellEvents.EMPTY_STRING, rowIndex, columnIndex,
        { element: event.target as HTMLElement, processText: false });
    }
  }
}
