import {ColumnSizerList, ColumnSizers, ColumnSizerState} from '../../types/overlayElements';
import {EditableTableComponent} from '../../editable-table-component';
import {ColumnsDetails} from '../../types/columnDetails';
import {ColumnSizerElement} from './columnSizerElement';

export class ColumnSizerEvents {
  private static readonly MOUSE_PASSTHROUGH_TIME_ML = 50;

  private static hideWhenCellNotHovered(columnSizer: ColumnSizerState, wasHovered: boolean) {
    if (columnSizer.isParentCellHovered) return;
    if (wasHovered) {
      ColumnSizerElement.hideAfterBlurAnimation(columnSizer.element);
    } else {
      ColumnSizerElement.hide(columnSizer.element);
    }
  }

  private static hideColumnSizer(columnSizers: ColumnSizers, columnIndex: number) {
    const columnSizer = columnSizers.list[columnIndex];
    if (!columnSizer) return;
    columnSizer.isParentCellHovered = false;
    // when hovering over a column sizer and quickly move out of it through the cell and out of the cell we need to know if
    // the sizer was hovered, because columnSizer.isMouseHovered can be set to false before this is called, need another
    // way to figure out if the cell was hovered, hence the following method looks at its element style
    // the reason why this is before timeout is because we want to get this information asap
    const isHovered = ColumnSizerElement.isHovered(columnSizer.element);
    setTimeout(() => {
      // check if mouse has not left the cell for the column sizer
      if (!columnSizer.isMouseHovered) {
        ColumnSizerEvents.hideWhenCellNotHovered(columnSizer, isHovered);
        columnSizers.currentlyVisibleElements.delete(columnSizer.element);
      }
    });
  }

  public static cellMouseLeave(columnSizers: ColumnSizers, columnIndex: number) {
    ColumnSizerEvents.hideColumnSizer(columnSizers, columnIndex - 1);
    ColumnSizerEvents.hideColumnSizer(columnSizers, columnIndex);
  }

  // prettier-ignore
  private static displayColumnSizer(
      columnSizers: ColumnSizers, columnIndex: number, height: string, top: string, left: string) {
    const columnSizer = columnSizers.list[columnIndex];
    if (!columnSizer) return;
    ColumnSizerElement.display(columnSizer.element, height, top, left);
    columnSizer.isParentCellHovered = true;
    columnSizers.currentlyVisibleElements.add(columnSizer.element);
  }

  public static cellMouseEnter(columnSizers: ColumnSizers, columnIndex: number, event: MouseEvent) {
    const headerCellElement = event.target as HTMLElement;
    const cellRect = headerCellElement.getBoundingClientRect();
    const height = `${headerCellElement.offsetHeight}px`;
    const top = `${cellRect.top}px`;
    const columnLeftSizerLeft = `${cellRect.left - 1}px`;
    ColumnSizerEvents.displayColumnSizer(columnSizers, columnIndex - 1, height, top, columnLeftSizerLeft);
    const columnRightSizerLeft = `${cellRect.left + cellRect.width - 1}px`;
    ColumnSizerEvents.displayColumnSizer(columnSizers, columnIndex, height, top, columnRightSizerLeft);
  }

  private static setNewColumnWidth(columnElement: HTMLElement, colWidth: number, newXMovement: number) {
    const newWidth = `${colWidth + newXMovement}px`;
    columnElement.style.width = newWidth;
  }

  private static getColumnSizerDetailsViaId(id: string, columnSizers: ColumnSizerList) {
    const sizerNumber = Number(id.replace(/\D/g, ''));
    return {columnSizer: columnSizers[sizerNumber], sizerNumber};
  }

  // the reason why table events are used to track mouse move events on column sizers is because otherwise when
  // the mouse moves quickly - it can leave the column sizer and events would stop firing
  // prettier-ignore
  public static tableOnMouseMove(selectedColumnSizer: HTMLElement,
      columnSizers: ColumnSizerList, columnsDetails: ColumnsDetails, newXMovement: number) {
    const { columnSizer, sizerNumber } = ColumnSizerEvents.getColumnSizerDetailsViaId(selectedColumnSizer.id, columnSizers)
    ColumnSizerElement.unsetTransitionTime(columnSizer.element);
    const columnElement = columnsDetails[sizerNumber].elements[0];
    const {left, width, height} = columnElement.getBoundingClientRect();
    ColumnSizerEvents.setNewColumnWidth(columnElement, width, newXMovement);
    ColumnSizerElement.setLeftProp(selectedColumnSizer, left, width, newXMovement);
    // if the header cell size increases or decreases as the width is changed
    // the reason why it is set in a timeout is in order to try to minimize the upfront operations for performance
    setTimeout(() => selectedColumnSizer.style.height = `${height}px`);
  }

  // the following method allows us to track when the user stops dragging mouse even when not on the column sizer
  public static tableOnMouseUp(selectedColumnSizer: HTMLElement, columnSizers: ColumnSizerList, target: HTMLElement) {
    ColumnSizerElement.setTransitionTime(selectedColumnSizer);
    const {columnSizer} = ColumnSizerEvents.getColumnSizerDetailsViaId(selectedColumnSizer.id, columnSizers);
    // if mouse up on a different element
    if (target !== selectedColumnSizer) {
      ColumnSizerElement.setDefaultProperties(selectedColumnSizer);
      ColumnSizerElement.setPropertiesAfterBlurAnimation(selectedColumnSizer, columnSizer.backgroundImage);
      ColumnSizerElement.hideAfterBlurAnimation(columnSizer.element);
    }
  }

  // in addition to the above method, the following allows us to track when the mouse has left the table
  public static tableOnMouseLeave(selectedColumnSizer: HTMLElement, columnSizers: ColumnSizerList) {
    const {columnSizer} = ColumnSizerEvents.getColumnSizerDetailsViaId(selectedColumnSizer.id, columnSizers);
    ColumnSizerElement.setTransitionTime(selectedColumnSizer);
    ColumnSizerElement.setDefaultProperties(selectedColumnSizer);
    ColumnSizerElement.setPropertiesAfterBlurAnimation(selectedColumnSizer, columnSizer.backgroundImage);
  }

  public static sizerOnMouseEnter(this: EditableTableComponent, columnSizerState: ColumnSizerState) {
    columnSizerState.isMouseHovered = true;
    // if selected and hovered over another
    if (this.tableElementEventState.selectedColumnSizer) return;
    ColumnSizerElement.setHoverProperties(columnSizerState.element);
    // only remove the background image if the user is definitely hovering over it
    setTimeout(() => {
      if (columnSizerState.isMouseHovered) ColumnSizerElement.unsetBackgroundImage(columnSizerState.element);
    }, ColumnSizerEvents.MOUSE_PASSTHROUGH_TIME_ML);
  }

  public static sizerOnMouseLeave(this: EditableTableComponent, columnSizer: ColumnSizerState) {
    columnSizer.isMouseHovered = false;
    // mouse leave can occur when mouse is moving and column sizer is selected, hence this prevents setting to default
    if (!this.tableElementEventState.selectedColumnSizer) {
      ColumnSizerElement.setDefaultProperties(columnSizer.element);
    }
    // when leaving the table, the last sizer can be hovered, hence the following is used to hide it because
    // columnSizer.isMouseHovered can be set to false before this is called, need another way to figure out
    // if the cell was hovered, following method looks at its element style to see if it was highlighted
    // the reason why this is before timeout is because we want to get this information asap
    const wasHovered = ColumnSizerElement.isHovered(columnSizer.element);
    // only reset if the user is definitely not hovering over it
    setTimeout(() => {
      if (!this.tableElementEventState.selectedColumnSizer && !columnSizer.isMouseHovered) {
        ColumnSizerElement.setPropertiesAfterBlurAnimation(columnSizer.element, columnSizer.backgroundImage);
        ColumnSizerEvents.hideWhenCellNotHovered(columnSizer, wasHovered);
      }
    }, ColumnSizerEvents.MOUSE_PASSTHROUGH_TIME_ML);
  }
}
