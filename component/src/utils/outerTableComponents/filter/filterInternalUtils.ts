import {FilterInternalUtils} from './rows/filterInternalUtils';
import {ActiveTable} from '../../../activeTable';

export class VisibilityUtils {
  public static headerChanged(at: ActiveTable) {
    // in a timeout primarily because when a column is removed the old column details are removed after this is executed
    setTimeout(() => {
      if (at._visiblityInternal.filters) FilterInternalUtils.resetAllInputs(at);
    });
  }

  public static completeReset(at: ActiveTable) {
    if (at._visiblityInternal.filters) FilterInternalUtils.completeReset(at);
  }
}
