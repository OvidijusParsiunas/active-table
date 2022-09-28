import {EditableTableComponent} from '../../../editable-table-component';
import {NumberOfIdenticalCells} from '../../numberOfIdenticalCells';
import {CellEvents} from '../../../elements/cell/cellEvents';
import {VALIDABLE_CELL_TYPE} from '../../../enums/cellType';
import {ValidateInput} from '../../cellType/validateInput';
import {TableRow} from '../../../types/tableContents';

export class DataUtils {
  public static createDataArray(length: number, defaultCellValue: string): string[] {
    return new Array(length).fill(defaultCellValue);
  }

  private static isTextEmpty(defaultValue: string, cellText: string) {
    if (defaultValue !== CellEvents.EMPTY_STRING) {
      const processedCellText = typeof cellText === 'string' ? cellText.trim() : cellText;
      return processedCellText === CellEvents.EMPTY_STRING;
    }
    return false;
  }

  private static isDataValid(userSetColumnType: VALIDABLE_CELL_TYPE, text: string) {
    if (VALIDABLE_CELL_TYPE[userSetColumnType]) {
      return ValidateInput.validate(text, userSetColumnType);
    }
    return true;
  }

  // TO-DO - initial table population should be subject to validation if type set beforehand
  // currently etc.columnsDetails is set after the data is inserted which does not allow it to be validated
  // note that NumberOfIdenticalCells.get uses the etc.contents top row, so it needs to be up-to-date
  // prettier-ignore
  private static shouldTextBeSetToDefault(text: string, defaultCellValue: string, rowIndex: number,
      duplicateHeadersAllowed: boolean, headerContents: TableRow, userSetColumnType?: VALIDABLE_CELL_TYPE) {
    return DataUtils.isTextEmpty(defaultCellValue, text)
      || (rowIndex === 0 && (!duplicateHeadersAllowed && NumberOfIdenticalCells.get(text, headerContents) > 1))
      || (rowIndex > 0 && userSetColumnType && !DataUtils.isDataValid(userSetColumnType, text));
  }

  // prettier-ignore
  public static processCellText(etc: EditableTableComponent, rowIndex: number, columnIndex: number, cellText: string) {
    const trimmedText = typeof cellText === 'string' ? cellText.trim() : cellText;
    const shouldBeSetToDefault = DataUtils.shouldTextBeSetToDefault(
      trimmedText, etc.defaultCellValue, rowIndex, etc.duplicateHeadersAllowed, etc.contents[0],
      etc.columnsDetails[columnIndex]?.userSetColumnType as keyof typeof VALIDABLE_CELL_TYPE);
    return shouldBeSetToDefault ? etc.defaultCellValue : trimmedText;
  }
}
