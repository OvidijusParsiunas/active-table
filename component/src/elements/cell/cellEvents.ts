import {ProcessedDataTextStyle} from '../../utils/columnType/processedDataTextStyle';
import {DataUtils} from '../../utils/insertRemoveStructure/shared/dataUtils';
import {CELL_UPDATE_TYPE} from '../../enums/onUpdateCellType';
import {CellText} from '../../types/tableContent';
import {EMPTY_STRING} from '../../consts/text';
import {ActiveTable} from '../../activeTable';
import {CellElement} from './cellElement';

// operates in an opt in or out basis for various operations
interface UpdateCellOptions {
  // opt in
  element?: HTMLElement;
  // opt out
  updateTableEvent?: boolean;
  processText?: boolean;
  updateContent?: boolean;
}

export class CellEvents {
  private static executeUpdateOperation(operation: keyof UpdateCellOptions, options?: UpdateCellOptions) {
    return options?.[operation] === undefined || options[operation] === true;
  }

  // this is mostly handled by operations that do not insert new cells as those handle the instructions below
  // in a different order asynchronously for maximum efficiency
  // prettier-ignore
  public static updateCell(at: ActiveTable,
      cellText: CellText, rowIndex: number, columnIndex: number, options?: UpdateCellOptions) {
    if (CellEvents.executeUpdateOperation('processText', options)) {
      cellText = DataUtils.processCellText(at, rowIndex, columnIndex, cellText);
    }
    if (CellEvents.executeUpdateOperation('updateContent', options)) at.content[rowIndex][columnIndex] = cellText; 
    if (options?.element) CellElement.setNewText(at, options.element, cellText, false, false); // CAUTION-1
    if (CellEvents.executeUpdateOperation('updateTableEvent', options)) at.onTableUpdate(at.content);
    // slight inefficiency using this here as setCellToDefaultIfNeeded and removeTextIfDefault have already validated text,
    // however having it here minimizes complexity
    if (rowIndex > 0) ProcessedDataTextStyle.setCellStyle(at, rowIndex, columnIndex);
    // not in timeout as functionality that calls updateCell calls at.onTableUpdate after - should remain that way
    at.onCellUpdate(cellText, rowIndex, columnIndex, CELL_UPDATE_TYPE.UPDATE);
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
    const {isDefaultTextRemovable, defaultText} = at.columnsDetails[columnIndex].settings;
    if (!isDefaultTextRemovable) return;
    if (defaultText !== EMPTY_STRING && defaultText === CellElement.getText(textContainerElement)) {
      CellEvents.updateCell(at, EMPTY_STRING, rowIndex, columnIndex,
        { element: textContainerElement, processText: false });
    }
  }
}
