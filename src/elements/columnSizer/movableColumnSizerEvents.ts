import {EditableTableComponent} from '../../editable-table-component';
import {ColumnSizerEventsUtils} from './columnSizerEventsUtils';
import {ColumnsDetailsT} from '../../types/columnDetails';

export class MovableColumnSizerEvents {
  private static move(selectedColumnSizer: HTMLElement, columnsDetails: ColumnsDetailsT, newXMovement: number) {
    const {columnSizer} = ColumnSizerEventsUtils.getSizerDetailsViaElementId(selectedColumnSizer.id, columnsDetails);
    const {movableElement} = columnSizer;
    const left = movableElement.offsetLeft + newXMovement;
    movableElement.style.left = `${left}px`;
  }

  // prettier-ignore
  public static attemptMove(etc: EditableTableComponent, newXMovement: number) {
    const { tableElementEventState: { columnSizer: {moveLimits, selected } }, columnsDetails } = etc;
    if (moveLimits) {
      moveLimits.currentOffset += newXMovement;
      if (moveLimits.currentOffset > moveLimits.left && moveLimits.currentOffset < moveLimits.right) {
        MovableColumnSizerEvents.move(selected as HTMLElement, columnsDetails, newXMovement);
      }
    }
  }
}
