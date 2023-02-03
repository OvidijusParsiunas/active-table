import {FrameComponentsInternal} from '../../types/frameComponentsInternal';
import {FrameComponentsColors} from './frameComponentsColors';
import {ActiveTable} from '../../activeTable';

// frame components are comprised of index column, add new column column and add new row row
export class FrameComponentsInternalUtils {
  public static set(at: ActiveTable) {
    const {frameComponentsStyle, frameComponentsInternal} = at;
    frameComponentsInternal.displayAddNewColumn = at.displayAddNewColumn;
    frameComponentsInternal.displayAddNewRow = at.displayAddNewRow;
    frameComponentsInternal.displayIndexColumn = at.displayIndexColumn;
    frameComponentsInternal.style = frameComponentsStyle.style;
    frameComponentsInternal.inheritHeaderColors = frameComponentsStyle.inheritHeaderColors;
  }

  public static getDefault(): FrameComponentsInternal {
    return {
      displayAddNewColumn: true,
      displayAddNewRow: true,
      displayIndexColumn: true,
      cellColors: FrameComponentsColors.getDefaultCellColors(),
    };
  }
}
