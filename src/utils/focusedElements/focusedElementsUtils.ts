import {FocusedElements} from '../../types/focusedElements';
import {FocusedCellUtils} from './focusedCellUtils';

export class FocusedElementsUtils {
  public static createEmpty(): FocusedElements {
    return {cell: FocusedCellUtils.createEmpty()};
  }
}
