import {FilterRowsInternalUtils} from './rows/filterRowsInternalUtils';
import {ActiveTable} from '../../../activeTable';

export class FilterInternalUtils {
  public static headerChanged(at: ActiveTable) {
    if (at._filterInternal.rows) FilterRowsInternalUtils.resetAllInputs(at);
  }

  public static completeReset(at: ActiveTable) {
    if (at._filterInternal.rows) FilterRowsInternalUtils.completeReset(at);
  }
}
