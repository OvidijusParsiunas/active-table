import {ColumnSizersStates, ColumnSizerState} from '../../types/overlayElements';
import {ColumnDetails, ColumnsDetails} from '../../types/columnDetails';
import {EditableTableComponent} from '../../editable-table-component';
import {ColumnSizerElements} from './columnSizerElements';

export class ColumnSizerEvents {
  private static readonly MOUSE_PASSTHROUGH_TIME_ML = 50;

  public static hide(etc: EditableTableComponent, columnIndex: number) {
    ColumnSizerElements.hide(etc, columnIndex);
  }

  public static display(etc: EditableTableComponent, columnIndex: number, event: MouseEvent) {
    const headerCellElement = event.target as HTMLElement;
    const cellRect = headerCellElement.getBoundingClientRect();
    const columnSizerLeft = etc.overlayElements.columnSizers[columnIndex - 1];
    if (columnSizerLeft) {
      ColumnSizerElements.display(headerCellElement, cellRect, columnSizerLeft.element, `${cellRect.left}px`);
    }
    const columnSizerRight = etc.overlayElements.columnSizers[columnIndex];
    const columnRightSizerLeft = `${cellRect.left + cellRect.width}px`;
    ColumnSizerElements.display(headerCellElement, cellRect, columnSizerRight.element, columnRightSizerLeft);
  }

  private static getColumnSizerDetailsViaId(id: string, columnSizers: ColumnSizersStates) {
    const sizerNumber = Number(id.replace(/\D/g, ''));
    return {columnSizer: columnSizers[sizerNumber], sizerNumber};
  }

  private static setNewColumnWidths(columnDetails: ColumnDetails, colWidth: number, newXMovement: number) {
    const newWidth = `${colWidth + newXMovement}px`;
    columnDetails.elements.forEach((cellElement) => (cellElement.style.width = newWidth));
    setTimeout(() => (columnDetails.width = newWidth));
  }

  // prettier-ignore
  public static tableOnMouseMove(selectedColumnSizer: HTMLElement,
      columnSizers: ColumnSizersStates, columnsDetails: ColumnsDetails, newXMovement: number) {
    const { columnSizer, sizerNumber } = ColumnSizerEvents.getColumnSizerDetailsViaId(selectedColumnSizer.id, columnSizers)
    ColumnSizerElements.unsetTransitionTime(columnSizer.element);
    const {left, width} = columnsDetails[sizerNumber].elements[0].getBoundingClientRect();
    ColumnSizerEvents.setNewColumnWidths(columnsDetails[sizerNumber], width, newXMovement);
    ColumnSizerElements.setLeftProp(selectedColumnSizer, left, width, newXMovement);
  }

  public static tableOnMouseUp(selectedColumnSizer: HTMLElement, target: HTMLElement) {
    // if mouse up on a different element
    if (target !== selectedColumnSizer) {
      ColumnSizerElements.setSyncDefaultProperties(selectedColumnSizer);
      ColumnSizerElements.setAsyncDefaultProperties(selectedColumnSizer);
    }
    // need to reset transition property when mouse up
    ColumnSizerElements.setTransitionTime(selectedColumnSizer);
  }

  public static tableOnMouseLeave(selectedColumnSizer: HTMLElement) {
    ColumnSizerElements.setSyncDefaultProperties(selectedColumnSizer);
    ColumnSizerElements.setAsyncDefaultProperties(selectedColumnSizer);
    // don't need to set transition as sudden default looks nicer when the cursor leaves the table
  }

  public static onMouseEnter(this: EditableTableComponent, columnSizerState: ColumnSizerState) {
    // if selected and hovered over another
    columnSizerState.isMouseHovered = true;
    if (this.tableElementEventState.selectedColumnSizer) return;
    ColumnSizerElements.setHoverProperties(columnSizerState.element);
    // only remove the background image if the user is definitely hovering over it
    setTimeout(() => {
      if (columnSizerState.isMouseHovered) ColumnSizerElements.unsetBackgroundImage(columnSizerState.element);
    }, ColumnSizerEvents.MOUSE_PASSTHROUGH_TIME_ML);
  }

  public static onMouseLeave(this: EditableTableComponent, columnSizerState: ColumnSizerState) {
    columnSizerState.isMouseHovered = false;
    // mouse leave can occur when mouse is moving and column sizer is selected, hence this prevents setting to default
    if (!this.tableElementEventState.selectedColumnSizer) {
      ColumnSizerElements.setSyncDefaultProperties(columnSizerState.element);
    }
    // only reset if the user is definitely not hovering over it
    setTimeout(() => {
      if (!this.tableElementEventState.selectedColumnSizer && !columnSizerState.isMouseHovered) {
        ColumnSizerElements.setAsyncDefaultProperties(columnSizerState.element);
      }
    }, ColumnSizerEvents.MOUSE_PASSTHROUGH_TIME_ML);
  }
}
