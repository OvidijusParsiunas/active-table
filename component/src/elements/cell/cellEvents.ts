import {ProcessedDataTextStyle} from '../../utils/columnType/processedDataTextStyle';
import {DataUtils} from '../../utils/insertRemoveStructure/shared/dataUtils';
import {CELL_UPDATE_TYPE} from '../../enums/onUpdateCellType';
import {FireEvents} from '../../utils/events/fireEvents';
import {EMPTY_STRING} from '../../consts/text';
import {CellText} from '../../types/tableData';
import {ActiveTable} from '../../activeTable';
import {CellElement} from './cellElement';

// operates in an opt in or out basis for various operations
interface UpdateCellOptions {
  // opt in
  element?: HTMLElement;
  // opt out
  processText?: boolean;
  updateData?: boolean;
  updateTableEvent?: boolean;
  updateCellEvent?: boolean;
}

export class CellEvents {
  private static executeUpdateOperation(operation: keyof UpdateCellOptions, options?: UpdateCellOptions) {
    return options?.[operation] === undefined || options[operation] === true;
  }

  // this is directly handled by operations that do not insert new cells as those handle the instructions below
  // in a different order asynchronously for maximum efficiency
  // prettier-ignore
  public static updateCell(at: ActiveTable,
      cellText: CellText, rowIndex: number, columnIndex: number, options?: UpdateCellOptions) {
    if (CellEvents.executeUpdateOperation('processText', options)) {
      cellText = DataUtils.processCellText(at, rowIndex, columnIndex, cellText);
    }
    if (CellEvents.executeUpdateOperation('updateData', options)) at.data[rowIndex][columnIndex] = cellText; 
    if (options?.element) CellElement.setNewText(at, options.element, cellText, false, false); // CAUTION-1
    if (CellEvents.executeUpdateOperation('updateTableEvent', options)) at.onDataUpdate(at.data);
    // slight inefficiency using this here as setCellToDefaultIfNeeded and removeTextIfDefault have already validated text,
    // however having it here minimizes complexity
    if (rowIndex > 0) ProcessedDataTextStyle.setCellStyle(at, rowIndex, columnIndex);
    if (CellEvents.executeUpdateOperation('updateCellEvent', options)) {
      // not in timeout as functionality that calls updateCell calls at.onDataUpdate after - should remain that way
      FireEvents.onCellUpdate(at, cellText, rowIndex, columnIndex, CELL_UPDATE_TYPE.UPDATE);
    }
    return cellText;
  }

  // this is used for cases where updateCell should only be called if it has to be set to default
  // prettier-ignore
  public static setCellToDefaultIfNeeded(at: ActiveTable,
      rowIndex: number, columnIndex: number, textContainerElement: HTMLElement, updateTableEvent = true): boolean {
    const cellText = CellElement.getText(textContainerElement);
    const processedCellText = DataUtils.processCellText(at, rowIndex, columnIndex, cellText);
    if (processedCellText !== cellText) {
      // if pointer problems start occuring, .getText() and processCellText are trimming the <br> element
      CellEvents.updateCell(at, processedCellText, rowIndex, columnIndex,
        { element: textContainerElement, processText: false, updateTableEvent }); 
      return true;
    }
    return false;
  }

  // prettier-ignore
  public static removeTextIfDefault(at: ActiveTable,
      rowIndex: number, columnIndex: number, textContainerElement: HTMLElement) {
    const {isDefaultTextRemovable, defaultText} = at._columnsDetails[columnIndex].settings;
    if (!isDefaultTextRemovable) return;
    if (defaultText !== EMPTY_STRING && defaultText === CellElement.getText(textContainerElement)) {
      CellEvents.updateCell(at, EMPTY_STRING, rowIndex, columnIndex,
        { element: textContainerElement, processText: false });
    }
  }
}
