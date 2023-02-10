import {FrameComponentsInternal} from '../../types/frameComponentsInternal';
import {FrameComponentsColors} from './frameComponentsColors';
import {ActiveTable} from '../../activeTable';

// frame components are comprised of index column, add new column column and add new row row
export class FrameComponentsInternalUtils {
  public static set(at: ActiveTable) {
    const {frameComponentsStyle, _frameComponents} = at;
    _frameComponents.displayAddNewColumn = at.displayAddNewColumn;
    _frameComponents.displayAddNewRow = at.displayAddNewRow;
    _frameComponents.displayIndexColumn = at.displayIndexColumn;
    _frameComponents.style = frameComponentsStyle.style;
    _frameComponents.inheritHeaderColors = frameComponentsStyle.inheritHeaderColors ?? true;
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
