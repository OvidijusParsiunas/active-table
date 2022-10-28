import {ColumnsDetailsT, ColumnDetailsT, ColumnSizerT} from '../../types/columnDetails';
import {EditableTableComponent} from '../../editable-table-component';
import {ColumnSizerElementOverlay} from './columnSizerElementOverlay';
import {ColumnSizerElement} from './columnSizerElement';
import {Browser} from '../../utils/browser/browser';
import {PX} from '../../types/pxDimension';

export class ColumnSizerEvents {
  private static readonly MOUSE_PASSTHROUGH_TIME_ML = 50;

  private static hideWhenCellNotHovered(columnSizer: ColumnSizerT, wasHovered: boolean) {
    if (columnSizer.isSideCellHovered) return;
    if (wasHovered) {
      ColumnSizerElement.hideAfterBlurAnimation(columnSizer.element);
    } else {
      ColumnSizerElement.hide(columnSizer.element);
    }
  }

  private static hideColumnSizer(columnSizer: ColumnSizerT) {
    if (!columnSizer) return;
    columnSizer.isSideCellHovered = false;
    // when hovering over a column sizer and quickly move out of it through the cell and out of the cell we need to know if
    // the sizer was hovered, because columnSizer.isMouseHovered can be set to false before this is called, need another
    // way to figure out if the cell was hovered, hence the following method looks at its element style
    // the reason why this is before timeout is because we want to get this information asap
    const isHovered = ColumnSizerElement.isHovered(columnSizer.element);
    setTimeout(() => {
      // check if mouse has not left the cell for the column sizer
      if (!columnSizer.isSizerHovered) {
        ColumnSizerEvents.hideWhenCellNotHovered(columnSizer, isHovered);
      }
    });
  }

  public static cellMouseLeave(columnsDetails: ColumnsDetailsT, columnIndex: number) {
    ColumnSizerEvents.hideColumnSizer(columnsDetails[columnIndex - 1]?.columnSizer);
    ColumnSizerEvents.hideColumnSizer(columnsDetails[columnIndex]?.columnSizer);
  }

  private static displayColumnSizer(columnSizer: ColumnSizerT, height: PX) {
    if (!columnSizer) return;
    ColumnSizerElement.display(columnSizer.element, height);
    columnSizer.isSideCellHovered = true;
  }

  public static cellMouseEnter(columnsDetails: ColumnsDetailsT, columnIndex: number, event: MouseEvent) {
    const headerCellElement = event.target as HTMLElement;
    const height: PX = `${headerCellElement.offsetHeight}px`;
    ColumnSizerEvents.displayColumnSizer(columnsDetails[columnIndex - 1]?.columnSizer, height);
    ColumnSizerEvents.displayColumnSizer(columnsDetails[columnIndex]?.columnSizer, height);
  }

  private static changeElementWidth(columnElement: HTMLElement, newXMovement: number) {
    const newWidth = `${columnElement.offsetWidth + newXMovement}px`;
    columnElement.style.width = newWidth;
  }

  private static getSizerDetailsViaElementId(id: string, columnsDetails: ColumnsDetailsT) {
    const sizerNumber = Number(id.replace(/\D/g, ''));
    const columnDetails = columnsDetails[sizerNumber];
    return {columnSizer: columnDetails.columnSizer, headerCell: columnDetails.elements[0], sizerNumber};
  }

  private static updateNextColumnIfNeeded(etc: EditableTableComponent, nextColumn: ColumnDetailsT, newXMovement: number) {
    const {tableElementRef, tableDimensions} = etc;
    // REF-11
    if (tableDimensions.width || Browser.IS_SAFARI) {
      if (nextColumn) {
        const nextHeaderCell = nextColumn.elements[0];
        // * -1 sets positive to negative and negative to positive
        ColumnSizerEvents.changeElementWidth(nextHeaderCell, newXMovement * -1);
      } else {
        ColumnSizerEvents.changeElementWidth(tableElementRef as HTMLElement, newXMovement);
      }
    }
  }

  // when the user moves their cursor too quickly or over one of the neighbouring cells, the total of the two cells
  // will no longer be the same, hence this is used to make sure the original is kept
  private static correctWidths(siblingCellsTotalWidth: number, headerCell: HTMLElement, nextColumn: ColumnDetailsT) {
    if (nextColumn) {
      const nextHeaderCell = nextColumn.elements[0];
      if (headerCell.offsetWidth + nextHeaderCell.offsetWidth !== siblingCellsTotalWidth) {
        nextHeaderCell.style.width = `${siblingCellsTotalWidth - headerCell.offsetWidth}px`;
        // when the user moves mouse over the neighbour cell - the widths are set incorrectly and do not match up
        // to the offset widths (easiest way to test is to use sizer between the last and second last) which
        // causes further attempts at resizing any columns to jump to incorrect column sizes
        // additionally this prevents the column widths from jumping when the mouse moves over the neighbour columns
        if (nextHeaderCell.style.width !== `${nextHeaderCell.offsetWidth}px`) {
          nextHeaderCell.style.width = `${nextHeaderCell.offsetWidth}px`;
          headerCell.style.width = `${siblingCellsTotalWidth - nextHeaderCell.offsetWidth}px`;
        }
      }
    }
  }

  // the reason why table events are used to track mouse move events on column sizers is because otherwise when the mouse
  // moves quickly - it can leave the column sizer and events would stop firing
  // prettier-ignore
  public static tableOnMouseMove(etc: EditableTableComponent, selectedColumnSizer: HTMLElement,
      columnsDetails: ColumnsDetailsT, newXMovement: number) {
    const { columnSizer, headerCell, sizerNumber } = ColumnSizerEvents.getSizerDetailsViaElementId(
      selectedColumnSizer.id, columnsDetails);
    ColumnSizerElement.unsetTransitionTime(columnSizer.element);
    ColumnSizerEvents.changeElementWidth(headerCell, newXMovement);
    const nextColumnDetails = columnsDetails[sizerNumber + 1];
    ColumnSizerEvents.updateNextColumnIfNeeded(etc, nextColumnDetails, newXMovement);
    ColumnSizerEvents.correctWidths(columnSizer.siblingCellsTotalWidth as number, headerCell, nextColumnDetails)
    // if the header cell size increases or decreases as the width is changed
    // the reason why it is set in a timeout is in order to try to minimize the upfront operations for performance
    setTimeout(() => (selectedColumnSizer.style.height = `${headerCell.offsetHeight}px`));
  }

  // prettier-ignore
  // when the user moves their cursor too quickly or over one of the neighbouring cells, the total of the two cells
  // will no longer be the same, hence this is used to make sure the original is kept
  private static setPreResizeSiblingCellsTotalWidth(columnsDetails: ColumnsDetailsT, selectedColumnSizer: HTMLElement) {
    const {columnSizer, headerCell, sizerNumber} = ColumnSizerEvents.getSizerDetailsViaElementId(
      selectedColumnSizer.id, columnsDetails);
    const nextColumn = columnsDetails[sizerNumber + 1];
    if (nextColumn) {
      const nextColumnHeaderCell = nextColumn.elements[0];
      columnSizer.siblingCellsTotalWidth = headerCell.offsetWidth + nextColumnHeaderCell.offsetWidth;
    }
  }

  public static tableOnMouseDown(etc: EditableTableComponent, selectedColumnSizer: HTMLElement, customColor?: string) {
    ColumnSizerElement.setColors(selectedColumnSizer, customColor || ColumnSizerElement.MOUSE_DOWN_COLOR);
    ColumnSizerElementOverlay.setMouseDownColor(selectedColumnSizer.children[0] as HTMLElement);
    ColumnSizerElement.unsetTransitionTime(selectedColumnSizer);
    if (etc.tableDimensions.width || Browser.IS_SAFARI) {
      ColumnSizerEvents.setPreResizeSiblingCellsTotalWidth(etc.columnsDetails, selectedColumnSizer);
    }
  }

  // the following method allows us to track when the user stops dragging mouse even when not on the column sizer
  // prettier-ignore
  public static tableOnMouseUp(
      selectedColumnSizer: HTMLElement, columnsDetails: ColumnsDetailsT, target: HTMLElement, customColor?: string) {
    // resetting the mouse down properties
    ColumnSizerElementOverlay.setDefaultColor(selectedColumnSizer.children[0] as HTMLElement, customColor);
    const {columnSizer} = ColumnSizerEvents.getSizerDetailsViaElementId(selectedColumnSizer.id, columnsDetails);
    // if mouse up on a different element
    if (target !== selectedColumnSizer) {
      ColumnSizerElement.setTransitionTime(selectedColumnSizer);
      ColumnSizerElement.setDefaultProperties(selectedColumnSizer, columnSizer.styles.default.width);
      ColumnSizerElement.setPropertiesAfterBlurAnimation(selectedColumnSizer, columnSizer.styles.default.backgroundImage);
      ColumnSizerElement.hideAfterBlurAnimation(columnSizer.element);
    } else {
      ColumnSizerElement.setColors(selectedColumnSizer, customColor || ColumnSizerElement.DEFAULT_COLOR);
      // the reason why this is in a timeout is to allow the colors to be set to hover without a transition so the overlay
      // does not stand out on mouse up
      setTimeout(() => ColumnSizerElement.setTransitionTime(selectedColumnSizer));
    }
  }

  // in addition to the above method, the following allows us to track when the mouse has left the table
  public static tableOnMouseLeave(selectedColumnSizer: HTMLElement, columnsDetails: ColumnsDetailsT) {
    const {columnSizer} = ColumnSizerEvents.getSizerDetailsViaElementId(selectedColumnSizer.id, columnsDetails);
    ColumnSizerElement.setTransitionTime(selectedColumnSizer);
    ColumnSizerElement.setDefaultProperties(selectedColumnSizer, columnSizer.styles.default.width);
    ColumnSizerElement.setPropertiesAfterBlurAnimation(selectedColumnSizer, columnSizer.styles.default.backgroundImage);
  }

  // prettier-ignore
  public static sizerOnMouseEnter(this: EditableTableComponent, columnSizer: ColumnSizerT) {
    columnSizer.isSizerHovered = true;
    // if selected and hovered over another
    if (this.tableElementEventState.selectedColumnSizer) return;
    ColumnSizerElement.setHoverProperties(
      columnSizer.element, columnSizer.styles.hover.width, this.columnResizerStyle.hover?.backgroundColor);
    // only remove the background image if the user is definitely hovering over it
    setTimeout(() => {
      if (columnSizer.isSizerHovered) ColumnSizerElement.unsetBackgroundImage(columnSizer.element);
    }, ColumnSizerEvents.MOUSE_PASSTHROUGH_TIME_ML);
  }

  // prettier-ignore
  public static sizerOnMouseLeave(this: EditableTableComponent, columnSizer: ColumnSizerT) {
    columnSizer.isSizerHovered = false;
    // mouse leave can occur when mouse is moving and column sizer is selected, hence this prevents setting to default
    if (!this.tableElementEventState.selectedColumnSizer) {
      ColumnSizerElement.setDefaultProperties(columnSizer.element, columnSizer.styles.default.width);
    }
    // when leaving the table, the last sizer can be hovered, hence the following is used to hide it because
    // columnSizer.isMouseHovered can be set to false before this is called, need another way to figure out
    // if the cell was hovered, following method looks at its element style to see if it was highlighted
    // the reason why this is before timeout is because we want to get this information asap
    const isHovered = ColumnSizerElement.isHovered(columnSizer.element);
    // only reset if the user is definitely not hovering over it
    setTimeout(() => {
      if (!this.tableElementEventState.selectedColumnSizer && !columnSizer.isSizerHovered) {
        ColumnSizerElement.setPropertiesAfterBlurAnimation(columnSizer.element,
          columnSizer.styles.default.backgroundImage);
        ColumnSizerEvents.hideWhenCellNotHovered(columnSizer, isHovered);
      }
    }, ColumnSizerEvents.MOUSE_PASSTHROUGH_TIME_ML);
  }
}
