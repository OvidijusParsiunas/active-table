import {ColumnSizersStates, ColumnSizerState} from '../../types/overlayElements';
import {ColumnDetails, ColumnsDetails} from '../../types/columnDetails';
import {EditableTableComponent} from '../../editable-table-component';
import {ColumnSizerElements} from './columnSizerElements';

export class ColumnSizerEvents {
  private static readonly MOUSE_PASSTHROUGH_TIME_ML = 50;

  private static hideWhenCellNotHovered(columnSizer: ColumnSizerState, wasHovered: boolean) {
    if (columnSizer.isParentCellHovered) return;
    if (wasHovered) {
      ColumnSizerElements.hideAfterBlurAnimation(columnSizer.element);
    } else {
      ColumnSizerElements.hide(columnSizer.element);
    }
  }

  private static hideColumnSizer(columnSizer: ColumnSizerState | undefined) {
    if (!columnSizer) return;
    columnSizer.isParentCellHovered = false;
    // when hovering over a column sizer and quickly move out of it through the cell and out of the cell we need to know if
    // the sizer was hovered, because columnSizer.isMouseHovered can be set to false before this is called, need another
    // way to figure out if the cell was hovered, hence the following method looks at its element style
    // the reason why this is before timeout is because we want to get this information asap
    const isHovered = ColumnSizerElements.isHovered(columnSizer.element);
    setTimeout(() => {
      // check if mouse has not left the cell for the column sizer
      if (!columnSizer.isMouseHovered) {
        ColumnSizerEvents.hideWhenCellNotHovered(columnSizer, isHovered);
      }
    });
  }

  public static cellMouseLeave(columnSizers: ColumnSizersStates, columnIndex: number) {
    ColumnSizerEvents.hideColumnSizer(columnSizers[columnIndex - 1]);
    ColumnSizerEvents.hideColumnSizer(columnSizers[columnIndex]);
  }

  private static displayColumnSizer(columnSizer: ColumnSizerState | undefined, height: string, top: string, left: string) {
    if (!columnSizer) return;
    ColumnSizerElements.display(columnSizer.element, height, top, left);
    columnSizer.isParentCellHovered = true;
  }

  public static cellMouseEnter(columnSizers: ColumnSizersStates, columnIndex: number, event: MouseEvent) {
    const headerCellElement = event.target as HTMLElement;
    const cellRect = headerCellElement.getBoundingClientRect();
    const height = `${headerCellElement.offsetHeight}px`;
    const top = `${cellRect.top}px`;
    const columnLeftSizerLeft = `${cellRect.left}px`;
    ColumnSizerEvents.displayColumnSizer(columnSizers[columnIndex - 1], height, top, columnLeftSizerLeft);
    const columnRightSizerLeft = `${cellRect.left + cellRect.width}px`;
    ColumnSizerEvents.displayColumnSizer(columnSizers[columnIndex], height, top, columnRightSizerLeft);
  }

  private static setNewColumnWidths(columnDetails: ColumnDetails, colWidth: number, newXMovement: number) {
    const newWidth = `${colWidth + newXMovement}px`;
    columnDetails.elements.forEach((cellElement) => (cellElement.style.width = newWidth));
    setTimeout(() => (columnDetails.width = newWidth));
  }

  private static getColumnSizerDetailsViaId(id: string, columnSizers: ColumnSizersStates) {
    const sizerNumber = Number(id.replace(/\D/g, ''));
    return {columnSizer: columnSizers[sizerNumber], sizerNumber};
  }

  // the reason why table events are used to track mouse move events on column sizers is because otherwise when
  // the mouse moves quickly - it can leave the column sizer and events would stop firing
  // prettier-ignore
  public static tableOnMouseMove(selectedColumnSizer: HTMLElement,
      columnSizers: ColumnSizersStates, columnsDetails: ColumnsDetails, newXMovement: number) {
    const { columnSizer, sizerNumber } = ColumnSizerEvents.getColumnSizerDetailsViaId(selectedColumnSizer.id, columnSizers)
    ColumnSizerElements.unsetTransitionTime(columnSizer.element);
    const {left, width} = columnsDetails[sizerNumber].elements[0].getBoundingClientRect();
    ColumnSizerEvents.setNewColumnWidths(columnsDetails[sizerNumber], width, newXMovement);
    ColumnSizerElements.setLeftProp(selectedColumnSizer, left, width, newXMovement);
  }

  // the following method allows us to track when the user stops dragging mouse even when not on the column sizer
  public static tableOnMouseUp(selectedColumnSizer: HTMLElement, columnSizers: ColumnSizersStates, target: HTMLElement) {
    ColumnSizerElements.setTransitionTime(selectedColumnSizer);
    const {columnSizer} = ColumnSizerEvents.getColumnSizerDetailsViaId(selectedColumnSizer.id, columnSizers);
    // if mouse up on a different element
    if (target !== selectedColumnSizer) {
      ColumnSizerElements.setDefaultProperties(selectedColumnSizer);
      ColumnSizerElements.setPropertiesAfterBlurAnimation(selectedColumnSizer);
      ColumnSizerElements.hideAfterBlurAnimation(columnSizer.element);
    }
  }

  // in addition to the above method, the following allows us to track when the mouse has left the table
  public static tableOnMouseLeave(selectedColumnSizer: HTMLElement) {
    ColumnSizerElements.setTransitionTime(selectedColumnSizer);
    ColumnSizerElements.setDefaultProperties(selectedColumnSizer);
    ColumnSizerElements.setPropertiesAfterBlurAnimation(selectedColumnSizer);
  }

  public static sizerOnMouseEnter(this: EditableTableComponent, columnSizerState: ColumnSizerState) {
    columnSizerState.isMouseHovered = true;
    // if selected and hovered over another
    if (this.tableElementEventState.selectedColumnSizer) return;
    ColumnSizerElements.setHoverProperties(columnSizerState.element);
    // only remove the background image if the user is definitely hovering over it
    setTimeout(() => {
      if (columnSizerState.isMouseHovered) ColumnSizerElements.unsetBackgroundImage(columnSizerState.element);
    }, ColumnSizerEvents.MOUSE_PASSTHROUGH_TIME_ML);
  }

  public static sizerOnMouseLeave(this: EditableTableComponent, columnSizerState: ColumnSizerState) {
    columnSizerState.isMouseHovered = false;
    // mouse leave can occur when mouse is moving and column sizer is selected, hence this prevents setting to default
    if (!this.tableElementEventState.selectedColumnSizer) {
      ColumnSizerElements.setDefaultProperties(columnSizerState.element);
    }
    // when leaving the table, the last sizer can be hovered, hence the following is used to hide it because
    // columnSizer.isMouseHovered can be set to false before this is called, need another way to figure out
    // if the cell was hovered, following method looks at its element style to see if it was highlighted
    // the reason why this is before timeout is because we want to get this information asap
    const wasHovered = ColumnSizerElements.isHovered(columnSizerState.element);
    // only reset if the user is definitely not hovering over it
    setTimeout(() => {
      if (!this.tableElementEventState.selectedColumnSizer && !columnSizerState.isMouseHovered) {
        ColumnSizerElements.setPropertiesAfterBlurAnimation(columnSizerState.element);
        ColumnSizerEvents.hideWhenCellNotHovered(columnSizerState, wasHovered);
      }
    }, ColumnSizerEvents.MOUSE_PASSTHROUGH_TIME_ML);
  }
}
