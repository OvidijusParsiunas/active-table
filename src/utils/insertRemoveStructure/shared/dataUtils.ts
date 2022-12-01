import {EditableTableComponent} from '../../../editable-table-component';
import {NumberOfIdenticalCells} from '../../numberOfIdenticalCells';
import {ColumnsDetailsT} from '../../../types/columnDetails';
import {VALIDABLE_CELL_TYPE} from '../../../enums/cellType';
import {ValidateInput} from '../../cellType/validateInput';
import {CellText} from '../../../types/tableContents';
import {EMPTY_STRING} from '../../../consts/text';

export class DataUtils {
  public static createEmptyStringDataArray(length: number): string[] {
    return new Array(length).fill(EMPTY_STRING);
  }

  private static isTextEmpty(defaultText: CellText, cellText: CellText) {
    if (defaultText !== EMPTY_STRING) {
      const processedCellText = typeof cellText === 'string' ? cellText.trim() : cellText;
      return processedCellText === EMPTY_STRING;
    }
    return false;
  }

  private static isDataValid(userSetColumnType: VALIDABLE_CELL_TYPE, text: CellText) {
    if (VALIDABLE_CELL_TYPE[userSetColumnType]) {
      return ValidateInput.validate(text, userSetColumnType);
    }
    return true;
  }

  // TO-DO - initial table population should be subject to validation if type set beforehand
  // currently etc.columnsDetails is set after the data is inserted which does not allow it to be validated
  // note that NumberOfIdenticalCells.get uses the etc.contents top row, so it needs to be up-to-date
  // prettier-ignore
  private static shouldTextBeSetToDefault(text: CellText, defaultText: CellText, rowIndex: number,
      duplicateHeadersAllowed: boolean, columnsDetails: ColumnsDetailsT, userSetColumnType?: VALIDABLE_CELL_TYPE) {
    return DataUtils.isTextEmpty(defaultText, text)
      || (rowIndex === 0 && (!duplicateHeadersAllowed && NumberOfIdenticalCells.get(text, columnsDetails) > 1))
      || (rowIndex > 0 && userSetColumnType && !DataUtils.isDataValid(userSetColumnType, text));
  }

  // prettier-ignore
  public static processCellText(etc: EditableTableComponent, rowIndex: number, columnIndex: number, cellText: CellText) {
    const trimmedText = typeof cellText === 'string' ? cellText.trim() : cellText;
    const defaultText = etc.columnsDetails[columnIndex].settings.defaultText as string;
    const shouldBeSetToDefault = DataUtils.shouldTextBeSetToDefault(
      trimmedText, defaultText, rowIndex, etc.duplicateHeadersAllowed, etc.columnsDetails,
      etc.columnsDetails[columnIndex]?.userSetColumnType as keyof typeof VALIDABLE_CELL_TYPE);
    return shouldBeSetToDefault ? defaultText : trimmedText;
  }
}
