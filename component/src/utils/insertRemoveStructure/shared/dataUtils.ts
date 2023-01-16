import {EditableTableComponent} from '../../../editable-table-component';
import {NumberOfIdenticalCells} from '../../numberOfIdenticalCells';
import {TextValidation} from '../../../types/textValidation';
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

  // note that NumberOfIdenticalCells.get uses the etc.contents top row, so it needs to be up-to-date
  // prettier-ignore
  private static shouldBeSetToDefault(etc: EditableTableComponent,
      text: CellText, defaultText: CellText, rowIndex: number, textValidation: TextValidation) {
    const { duplicateHeadersAllowed, columnsDetails } = etc;
    return DataUtils.isTextEmpty(defaultText, text)
      || (rowIndex === 0 && (!duplicateHeadersAllowed && NumberOfIdenticalCells.get(text, columnsDetails) > 1))
      || (rowIndex > 0 && !(textValidation.func === undefined || textValidation.func(String(text))));
  }

  // prettier-ignore
  public static processCellText(etc: EditableTableComponent, rowIndex: number, columnIndex: number, cellText: CellText) {
    let processedText = typeof cellText === 'string' ? cellText.trim() : cellText;
    const {activeType: {textValidation, customTextProcessing}, settings: {defaultText}} = etc.columnsDetails[columnIndex];
    if (rowIndex > 0) {
      if (customTextProcessing?.changeText) processedText = customTextProcessing.changeText(String(processedText)); 
      if (!textValidation.setTextToDefaultOnFail && processedText !== EMPTY_STRING) return processedText;
    }
    const shouldSetToDefault = DataUtils.shouldBeSetToDefault(etc, processedText, defaultText, rowIndex, textValidation);
    return shouldSetToDefault ? defaultText : processedText;
  }
}
