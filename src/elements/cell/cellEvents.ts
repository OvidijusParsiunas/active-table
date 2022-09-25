import {DataUtils} from '../../utils/insertRemoveStructure/shared/dataUtils';
import {EditableTableComponent} from '../../editable-table-component';
import {CELL_UPDATE_TYPE} from '../../enums/onUpdateCellType';

// operates in an opt in basis for various operations
interface UpdateCellOptions {
  element?: HTMLElement;
  updateTableEvent?: boolean;
  processText?: boolean;
  updateContents?: boolean;
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
    if (CellEvents.executeUpdateOpration('updateContents', options)) etc.contents[rowIndex][columnIndex] = cellText; 
    if (options?.element) options.element.textContent = cellText;
    if (CellEvents.executeUpdateOpration('updateTableEvent', options)) etc.onTableUpdate(etc.contents);
    // not in timeout as functionality that calls updateCell calls etc.onTableUpdate after - should remain that way
    etc.onCellUpdate(cellText, rowIndex, columnIndex, CELL_UPDATE_TYPE.UPDATE);
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
  public static removeTextIfCellDefault(etc: EditableTableComponent,
      rowIndex: number, columnIndex: number, event: FocusEvent) {
    if (etc.defaultCellValue !== CellEvents.EMPTY_STRING
        && etc.defaultCellValue === (event.target as HTMLElement).textContent) {
      CellEvents.updateCell(etc, CellEvents.EMPTY_STRING, rowIndex, columnIndex,
        { element: event.target as HTMLElement, processText: false });
    }
  }
}
