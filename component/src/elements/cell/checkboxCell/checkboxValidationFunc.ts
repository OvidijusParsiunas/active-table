import {CustomTextProcessing} from '../../../types/customTextProcessing';
import {CellText} from '../../../types/tableData';

export class CheckboxValidationFunc {
  // cannot place this inside the CheckboxCellElement class as certain dependencies are not imported in time
  public static getDefault(): CustomTextProcessing['changeTextFunc'] {
    return (text: CellText) => {
      const processedString = String(text).trim().toLocaleLowerCase();
      // prettier-ignore
      if (processedString === '' || processedString === '0'
          || processedString === '00' || processedString === 'false') {
        return 'false';
      }
      return 'true';
    };
  }
}
