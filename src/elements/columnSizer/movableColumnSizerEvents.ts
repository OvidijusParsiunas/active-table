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
    const {tableElementEventState: {selectedColumnSizer}, columnsDetails} = etc;
    if (selectedColumnSizer) {
      const {moveLimits, element} = selectedColumnSizer;
      selectedColumnSizer.mouseMoveOffset += newXMovement;
      if (selectedColumnSizer.mouseMoveOffset > moveLimits.left
          && selectedColumnSizer.mouseMoveOffset < moveLimits.right) {
        MovableColumnSizerEvents.move(element, columnsDetails, newXMovement);
      }
    }
  }
}
