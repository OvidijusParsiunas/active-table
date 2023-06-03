import {FilterRowsInternalUtils} from './rows/filterRowsInternalUtils';
import {ActiveTable} from '../../../activeTable';

export class FilterInternalUtils {
  public static headerChanged(at: ActiveTable) {
    // in a timeout primarily because when a column is removed the old column details are removed after this is executed
    setTimeout(() => {
      if (at._filterInternal.rows) FilterRowsInternalUtils.resetAllInputs(at);
    });
  }

  public static completeReset(at: ActiveTable) {
    if (at._filterInternal.rows) FilterRowsInternalUtils.completeReset(at);
  }
}
