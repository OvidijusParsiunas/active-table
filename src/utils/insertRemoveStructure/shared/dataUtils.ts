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
  private static shouldTextBeSetToDefault(text: CellText, defaultText: CellText, rowIndex: number, columnIndex: number,
      duplicateHeadersAllowed: boolean, columnsDetails: ColumnsDetailsT) {
    const {userSetColumnType, activeType} = columnsDetails[columnIndex];
    return DataUtils.isTextEmpty(defaultText, text)
      || (rowIndex === 0 && (!duplicateHeadersAllowed && NumberOfIdenticalCells.get(text, columnsDetails) > 1))
      || (rowIndex > 0 && userSetColumnType
          && !DataUtils.isDataValid(userSetColumnType as keyof typeof VALIDABLE_CELL_TYPE, text))
      || (rowIndex > 0 && !(activeType?.validation === undefined || activeType.validation(text)));
  }

  // prettier-ignore
  public static processCellText(etc: EditableTableComponent, rowIndex: number, columnIndex: number, cellText: CellText) {
    const trimmedText = typeof cellText === 'string' ? cellText.trim() : cellText;
    const defaultText = etc.columnsDetails[columnIndex].settings.defaultText as string;
    const shouldBeSetToDefault = DataUtils.shouldTextBeSetToDefault(
      trimmedText, defaultText, rowIndex, columnIndex, etc.duplicateHeadersAllowed, etc.columnsDetails);
    return shouldBeSetToDefault ? defaultText : trimmedText;
  }
}
