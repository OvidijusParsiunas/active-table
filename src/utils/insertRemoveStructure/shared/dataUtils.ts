import {EditableTableComponent} from '../../../editable-table-component';
import {CellEvents} from '../../../elements/cell/cellEvents';
import {TableRow} from '../../../types/tableContents';
import {NumberOfIdenticalCells} from '../../numberOfIdenticalCells';

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

  // prettier-ignore
  private static shouldTextBeSetToDefault(text: string,
      defaultCellValue: string, rowIndex: number, duplicateHeadersAllowed: boolean, headerContents: TableRow) {
    return DataUtils.isTextEmpty(defaultCellValue, text)
      || (rowIndex === 0 && !duplicateHeadersAllowed && NumberOfIdenticalCells.get(text, headerContents) > 1)
  }

  // prettier-ignore
  public static processCellText(etc: EditableTableComponent, rowIndex: number, cellText: string) {
    const trimmedText = typeof cellText === 'string' ? cellText.trim() : cellText;
    const shouldBeSetToDefault = DataUtils.shouldTextBeSetToDefault(
      cellText, etc.defaultCellValue, rowIndex, etc.duplicateHeadersAllowed, etc.contents[0]);
    return shouldBeSetToDefault ? etc.defaultCellValue : trimmedText;
  }
}
