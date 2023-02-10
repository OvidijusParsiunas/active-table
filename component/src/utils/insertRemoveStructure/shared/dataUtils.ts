import {NumberOfIdenticalCells} from '../../numberOfIdenticalCells';
import {TextValidation} from '../../../types/textValidation';
import {CellText} from '../../../types/tableContent';
import {EMPTY_STRING} from '../../../consts/text';
import {ActiveTable} from '../../../activeTable';

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

  // note that NumberOfIdenticalCells.get uses the at.content top row, so it needs to be up-to-date
  // prettier-ignore
  private static shouldBeSetToDefault(at: ActiveTable,
      text: CellText, defaultText: CellText, rowIndex: number, textValidation: TextValidation) {
    const {allowDuplicateHeaders, _columnsDetails} = at;
    return DataUtils.isTextEmpty(defaultText, text)
      || (rowIndex === 0 && (!allowDuplicateHeaders && NumberOfIdenticalCells.get(text, _columnsDetails) > 1))
      || (rowIndex > 0 && !(textValidation.func === undefined || textValidation.func(String(text))));
  }

  // prettier-ignore
  public static processCellText(at: ActiveTable, rowIndex: number, columnIndex: number, cellText: CellText) {
    let processedText = typeof cellText === 'string' ? cellText.trim() : cellText;
    const columnsDetails = at._columnsDetails[columnIndex];
    if (!columnsDetails) return processedText;
    const {activeType: {textValidation, customTextProcessing}, settings: {defaultText}} = columnsDetails;
    if (rowIndex > 0) {
      if (customTextProcessing?.changeTextFunc) {
        processedText = customTextProcessing.changeTextFunc(String(processedText)); 
      }
      if (!textValidation.setTextToDefaultOnFail && processedText !== EMPTY_STRING) return processedText;
    }
    const shouldSetToDefault = DataUtils.shouldBeSetToDefault(at, processedText, defaultText, rowIndex, textValidation);
    return shouldSetToDefault ? defaultText : processedText;
  }
}
