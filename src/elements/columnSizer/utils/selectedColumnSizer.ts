import {ColumnSizerT, SelectedColumnSizerT} from '../../../types/columnSizer';
import {EditableTableComponent} from '../../../editable-table-component';
import {MoveLimits} from './moveLimits';

export class SelectedColumnSizer {
  // prettier-ignore
  private static generateObject(etc: EditableTableComponent, columnSizer: ColumnSizerT, isFirstSizer: boolean,
      isSecondLastSizer: boolean, leftHeader: HTMLElement, rightHeader: HTMLElement): SelectedColumnSizerT {
    // sizer is centered within the cell divider and starts with an offset, hence mouseMoveOffset is set
    // with that offset in order to limit the vertical line at the correct cell offset position
    const columnSizerOffset = columnSizer.movableElement.offsetLeft;
    return {
      element: columnSizer.element,
      moveLimits: MoveLimits.generate(etc, isFirstSizer, isSecondLastSizer, leftHeader, rightHeader, columnSizerOffset),
      // this is to reflect the initial sizer offset to center itself in the cell divider
      initialOffset: columnSizerOffset,
      mouseMoveOffset: columnSizerOffset,
    };
  }

  public static get(etc: EditableTableComponent, sizerNumber: number, columnSizer: ColumnSizerT): SelectedColumnSizerT {
    // borders of the side cells tend to breach over the limits of the table by half their width, causing the offsets to
    // be incorrect and thus set the limits beyond the table limits, isFirstSizer and isSecondLastSizer help prevent it
    const isFirstSizer = sizerNumber === 0;
    const isSecondLastSizer = etc.columnsDetails.length > sizerNumber + 2;
    const leftHeader = etc.columnsDetails[sizerNumber].elements[0];
    const rightHeader = etc.columnsDetails[sizerNumber + 1]?.elements[0];

    return SelectedColumnSizer.generateObject(etc, columnSizer, isFirstSizer, isSecondLastSizer, leftHeader, rightHeader);
  }
}
