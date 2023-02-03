import {FrameComponentsInternal} from '../../types/frameComponentsInternal';
import {FrameComponentsColors} from './frameComponentsColors';
import {FrameComponents} from '../../types/frameComponents';

// frame components are comprised of index column, add new column column and add new row row
export class FrameComponentsInternalUtils {
  public static set(clientObject: FrameComponents, internalObject: FrameComponentsInternal) {
    Object.assign(internalObject, clientObject);
  }

  public static getDefault(): FrameComponentsInternal {
    return {
      displayAddColumn: true,
      displayAddRow: true,
      displayIndexColumn: true,
      cellColors: FrameComponentsColors.getDefaultCellColors(),
    };
  }
}
