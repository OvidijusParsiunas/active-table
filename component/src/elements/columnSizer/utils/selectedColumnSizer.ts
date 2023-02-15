import {ColumnSizerT, SelectedColumnSizerT} from '../../../types/columnSizer';
import {ColumnSizerGenericUtils} from './columnSizerGenericUtils';
import {FireEvents} from '../../../utils/events/fireEvents';
import {ActiveTable} from '../../../activeTable';
import {MoveLimits} from './moveLimits';

export class SelectedColumnSizer {
  // prettier-ignore
  private static generateObj(at: ActiveTable, sizer: ColumnSizerT, isFirstSizer: boolean,
      isLastSizer: boolean, leftHeader: HTMLElement, rightHeader?: HTMLElement): SelectedColumnSizerT {
    // sizer is centered within the cell divider and starts with an offset, hence mouseMoveOffset is set
    // with that offset in order to limit the vertical line at the correct cell offset position
    const columnSizerOffset = sizer.movableElement.offsetLeft;
    return {
      element: sizer.element,
      moveLimits: MoveLimits.generate(at, isFirstSizer, isLastSizer, columnSizerOffset, rightHeader, leftHeader),
      // this is to reflect the initial sizer offset to center itself in the cell divider
      initialOffset: columnSizerOffset,
      mouseMoveOffset: columnSizerOffset,
      fireColumnsUpdate: FireEvents.onColumnsUpdate.bind(this, at),
    };
  }

  public static get(at: ActiveTable, sizerNumber: number): SelectedColumnSizerT {
    const sizer = at._columnsDetails[sizerNumber].columnSizer;
    // borders of the side cells tend to breach over the limits of the table by half their width, causing the offsets to
    // be incorrect and thus set the limits beyond the table limits, isFirstSizer and isLastSizer help prevent it
    const isFirstSizer = sizerNumber === 0;
    const isLastSizer = at._columnsDetails.length - 2 === sizerNumber; // only used when table width is set
    const leftHeader = at._columnsDetails[sizerNumber].elements[0];
    const rightHeader = ColumnSizerGenericUtils.findNextResizableColumnHeader(at._columnsDetails, sizerNumber);
    return SelectedColumnSizer.generateObj(at, sizer, isFirstSizer, isLastSizer, leftHeader, rightHeader);
  }
}
