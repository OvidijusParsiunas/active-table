import {EditableTableComponent} from '../../../editable-table-component';
import {ColumnTypeInternal} from '../../../types/columnTypeInternal';
import {NumberOfIdenticalCells} from '../../numberOfIdenticalCells';
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

  // TO-DO - initial table population should be subject to validation if type set beforehand
  // currently etc.columnsDetails is set after the data is inserted which does not allow it to be validated
  // note that NumberOfIdenticalCells.get uses the etc.contents top row, so it needs to be up-to-date
  // prettier-ignore
  private static shouldTextBeSetToDefault(etc: EditableTableComponent,
      text: CellText, defaultText: CellText, rowIndex: number, activeType: ColumnTypeInternal) {
    const { duplicateHeadersAllowed, columnsDetails } = etc;
    return DataUtils.isTextEmpty(defaultText, text)
      || (rowIndex === 0 && (!duplicateHeadersAllowed && NumberOfIdenticalCells.get(text, columnsDetails) > 1))
      || (rowIndex > 0 && !(activeType?.validation === undefined || activeType.validation(String(text))));
  }

  public static processCellText(etc: EditableTableComponent, rowIndex: number, columnIndex: number, cellText: CellText) {
    const trimmedText = typeof cellText === 'string' ? cellText.trim() : cellText;
    const {activeType, settings} = etc.columnsDetails[columnIndex];
    const {defaultText} = settings;
    if (!activeType.validationProps?.setTextToDefaultOnFail && trimmedText !== EMPTY_STRING) return trimmedText;
    const shouldBeSetToDefault = DataUtils.shouldTextBeSetToDefault(etc, trimmedText, defaultText, rowIndex, activeType);
    return shouldBeSetToDefault ? defaultText : trimmedText;
  }
}
