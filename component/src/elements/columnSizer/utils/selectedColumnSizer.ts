import {ColumnSizerGenericUtils} from './columnSizerGenericUtils';
import {SelectedColumnSizerT} from '../../../types/columnSizer';
import {ColumnDetailsT} from '../../../types/columnDetails';
import {ActiveTable} from '../../../activeTable';
import {MoveLimits} from './moveLimits';

export class SelectedColumnSizer {
  // prettier-ignore
  private static generateObj(at: ActiveTable, leftColumnDetails: ColumnDetailsT, isFirstSizer: boolean,
      isLastSizer: boolean, leftHeader: HTMLElement, rightHeader?: HTMLElement): SelectedColumnSizerT {
    const {columnSizer, settings} = leftColumnDetails;
    // sizer is centered within the cell divider and starts with an offset, hence mouseMoveOffset is set
    // with that offset in order to limit the vertical line at the correct cell offset position
    const columnSizerOffset = columnSizer.movableElement.offsetLeft;
    return {
      element: columnSizer.element,
      moveLimits: MoveLimits.generate(
        at, isFirstSizer, isLastSizer, columnSizerOffset, rightHeader, leftHeader, settings),
      // this is to reflect the initial sizer offset to center itself in the cell divider
      initialOffset: columnSizerOffset,
      mouseMoveOffset: columnSizerOffset,
    };
  }

  public static get(at: ActiveTable, sizerNumber: number): SelectedColumnSizerT {
    const columnDetails = at.columnsDetails[sizerNumber];
    // borders of the side cells tend to breach over the limits of the table by half their width, causing the offsets to
    // be incorrect and thus set the limits beyond the table limits, isFirstSizer and isLastSizer help prevent it
    const isFirstSizer = sizerNumber === 0;
    const isLastSizer = at.columnsDetails.length - 2 === sizerNumber; // only used when table width is set
    const leftHeader = at.columnsDetails[sizerNumber].elements[0];
    const rightHeader = ColumnSizerGenericUtils.findNextResizableColumnHeader(at.columnsDetails, sizerNumber);
    return SelectedColumnSizer.generateObj(at, columnDetails, isFirstSizer, isLastSizer, leftHeader, rightHeader);
  }
}
