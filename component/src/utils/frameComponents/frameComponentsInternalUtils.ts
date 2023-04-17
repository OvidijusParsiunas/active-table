import {FrameComponentsInternal} from '../../types/frameComponentsInternal';
import {FrameComponentsColors} from './frameComponentsColors';
import {ActiveTable} from '../../activeTable';

// frame components are comprised of index column, add new column column and add new row row
export class FrameComponentsInternalUtils {
  public static set(at: ActiveTable) {
    const {frameComponentsStyles, _frameComponents} = at;
    _frameComponents.displayAddNewColumn = at.displayAddNewColumn;
    _frameComponents.displayAddNewRow = at.displayAddNewRow;
    _frameComponents.displayIndexColumn = at.displayIndexColumn;
    _frameComponents.styles = frameComponentsStyles.styles;
    _frameComponents.inheritHeaderColors = frameComponentsStyles.inheritHeaderColors ?? true;
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
