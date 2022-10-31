import {EditableTableComponent} from '../../editable-table-component';
import {ColumnSizerEventsUtils} from './columnSizerEventsUtils';
import {ColumnsDetailsT} from '../../types/columnDetails';

export class MovableColumnSizerEvents {
  private static move(selectedColumnSizer: HTMLElement, columnsDetails: ColumnsDetailsT, newLeft: number) {
    const {columnSizer} = ColumnSizerEventsUtils.getSizerDetailsViaElementId(selectedColumnSizer.id, columnsDetails);
    columnSizer.movableElement.style.left = `${newLeft}px`;
  }

  // prettier-ignore
  public static attemptMove(etc: EditableTableComponent, newXMovement: number) {
    const {tableElementEventState: {selectedColumnSizer}, columnsDetails} = etc;
    if (selectedColumnSizer) {
      const {moveLimits, element} = selectedColumnSizer;
      selectedColumnSizer.mouseMoveOffset += newXMovement;
      if (selectedColumnSizer.mouseMoveOffset > moveLimits.left
          && selectedColumnSizer.mouseMoveOffset < moveLimits.right) {
        MovableColumnSizerEvents.move(element, columnsDetails, selectedColumnSizer.mouseMoveOffset);
      }
    }
  }
}
