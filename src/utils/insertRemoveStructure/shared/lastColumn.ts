import {ColumnsDetailsT} from '../../../types/columnDetails';
import {ElementDetails} from '../../../types/elementDetails';

export class LastColumn {
  // the reason why last column details are used is because after removal of the last column element, its details are
  // no longer present and update methods are run in setTimeouts, hence those details need to be captured before
  // their methods are executed
  public static getDetails(columnsDetails: ColumnsDetailsT, rowIndex: number): ElementDetails {
    const lastColumnIndex = columnsDetails.length - 1;
    return {element: columnsDetails[lastColumnIndex].elements[rowIndex], index: lastColumnIndex};
  }
}
