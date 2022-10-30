import {StaticTableWidthColumnSizerEvents} from '../../utils/staticTableWidthsUtils/staticTableWidthColumnSizerEvents';
import {TableElementEventState} from '../../types/tableElementEventState';
import {EditableTableComponent} from '../../editable-table-component';
import {MovableColumnSizerElement} from './movableColumnSizerElement';
import {ColumnSizerT, SizerMoveLimits} from '../../types/columnSizer';
import {ColumnSizerEventsUtils} from './columnSizerEventsUtils';
import {ColumnsDetailsT} from '../../types/columnDetails';
import {ColumnSizerElement} from './columnSizerElement';
import {Browser} from '../../utils/browser/browser';
import {PX} from '../../types/pxDimension';

export type ColumnSizerMoveFunc = (
  selectedColumnSizer: HTMLElement,
  columnsDetails: ColumnsDetailsT,
  newXMovement: number,
  etc: EditableTableComponent
) => void;

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
    // when hovering over a column sizer and quickly moving out of it through the cell and out of the cell we need to
    // know if the sizer was hovered, because columnSizer.isSizerHovered can be set to false before this is called,
    // need another way to figure out if the cell was hovered, hence the following method looks at its element style
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

  // prettier-ignore
  public static setWidth(selectedColumnSizer: HTMLElement,
      columnSizer: ColumnSizerT, widthDelta: number, headerCell: HTMLElement) {
    ColumnSizerElement.unsetTransitionTime(columnSizer.element);
    ColumnSizerEventsUtils.changeElementWidth(headerCell, widthDelta);
    // if the header cell size increases or decreases as the width is changed
    // the reason why it is set in a timeout is in order to try to minimize the upfront operations for performance
    setTimeout(() => (selectedColumnSizer.style.height = `${headerCell.offsetHeight}px`));
  }

  // WORK - remove
  // prettier-ignore
  private static mouseMoveStaticTableWidthFunc(selectedColumnSizer: HTMLElement,
      columnsDetails: ColumnsDetailsT, newXMovement: number, etc: EditableTableComponent) {
    const { columnSizer, headerCell, sizerNumber } = ColumnSizerEventsUtils.getSizerDetailsViaElementId(
      selectedColumnSizer.id, columnsDetails);
    StaticTableWidthColumnSizerEvents.changeNextColumnSize(etc, columnsDetails[sizerNumber + 1], newXMovement,
      columnSizer.siblingCellsTotalWidth as number, headerCell as HTMLElement);
  }

  // WORK - remove
  // prettier-ignore
  private static mouseMoveDynamicTableWidthFunc(
      selectedColumnSizer: HTMLElement, columnsDetails: ColumnsDetailsT, newXMovement: number) {
    const { columnSizer, headerCell } = ColumnSizerEventsUtils.getSizerDetailsViaElementId(
      selectedColumnSizer.id, columnsDetails);
    ColumnSizerEvents.setWidth(selectedColumnSizer, columnSizer, newXMovement, headerCell);
  }

  // prettier-ignore
  public static tableOnMouseDown(etc: EditableTableComponent, selectedColumnSizer: HTMLElement) {
    const {columnSizer, sizerNumber} = ColumnSizerEventsUtils.getSizerDetailsViaElementId(
      selectedColumnSizer.id, etc.columnsDetails);
    etc.tableElementEventState.columnSizer.selected = columnSizer.element;
    MovableColumnSizerElement.display(etc.tableBodyElementRef as HTMLElement, columnSizer, etc.displayAddRowCell)
    ColumnSizerElement.setDefaultProperties(columnSizer.element, columnSizer.styles.default.width);
    ColumnSizerElement.setPropertiesAfterBlurAnimation(columnSizer.element, columnSizer.styles.default.backgroundImage);
    // WORK - take into consideration border size and padding
    // const rightColumnsWidth = etc.offsetWidth -
    //   etc.columnsDetails[sizerNumber + 1].elements[0].offsetLeft;
    // WORK
    const rightColumnsWidth = (etc.parentElement as HTMLElement).offsetWidth -
      etc.columnsDetails[sizerNumber + 1].elements[0].offsetLeft - etc.offsetLeft;
    etc.tableElementEventState.columnSizer.moveLimits = {
      left: -etc.columnsDetails[sizerNumber].elements[0].offsetWidth,
      right: rightColumnsWidth,
      currentOffset: 0,
    }
    // REF-11
    if (etc.tableDimensions.width || Browser.IS_SAFARI) {
      StaticTableWidthColumnSizerEvents.setPreResizeSiblingCellsTotalWidth(etc.columnsDetails, columnSizer.element);
    }
  }

  // prettier-ignore
  private static mouseUpSizer(leftOffset: number, columnSizer: ColumnSizerT, headerCell: HTMLElement,
      tableElementEventState: TableElementEventState) {
    ColumnSizerEvents.setWidth(columnSizer.element, columnSizer, leftOffset, headerCell);
    MovableColumnSizerElement.hide(columnSizer.movableElement);
    delete tableElementEventState.columnSizer.selected;
  }

  // prettier-ignore
  private static immediatelySetSizerStyleToDefault(columnSizer: ColumnSizerT, customBackgroundColor?: string) {
    ColumnSizerElement.setHoverStyle(
      columnSizer.element, columnSizer.styles.hover.width, false, customBackgroundColor);
    ColumnSizerElement.unsetBackgroundImage(columnSizer.element);
  }

  private static blurSizerOnMouseUp(columnSizer: ColumnSizerT) {
    // ColumnSizerElement.hide(selectedColumnSizer as HTMLElement);
    const {element: sizerElement, styles: sizerStyles, movableElement} = columnSizer;
    ColumnSizerEvents.immediatelySetSizerStyleToDefault(columnSizer, movableElement.style.backgroundColor);
    setTimeout(() => {
      ColumnSizerElement.setTransitionTime(sizerElement);
      ColumnSizerElement.setDefaultProperties(sizerElement, sizerStyles.default.width, false);
      ColumnSizerElement.setPropertiesAfterBlurAnimation(sizerElement, sizerStyles.default.backgroundImage);
      ColumnSizerElement.hideAfterBlurAnimation(sizerElement);
    });
  }

  // will be activated by window first so this will not be called if on a window element
  // prettier-ignore
  public static windowOnMouseUp(etc: EditableTableComponent) {
    const { tableElementEventState: { columnSizer: {moveLimits, selected } }, columnsDetails } = etc;
    const {columnSizer, headerCell} = ColumnSizerEventsUtils.getSizerDetailsViaElementId(
      (selected as HTMLElement).id, columnsDetails);
    ColumnSizerEvents.mouseUpSizer((moveLimits as SizerMoveLimits).currentOffset, columnSizer,
      headerCell, etc.tableElementEventState);
    ColumnSizerEvents.blurSizerOnMouseUp(columnSizer)
  }

  // the following method allows us to track when the user stops dragging mouse even when not on the column sizer
  // prettier-ignore
  public static tableOnMouseUp(etc: EditableTableComponent, target: HTMLElement) {
    const { tableElementEventState: { columnSizer: {moveLimits, selected } }, columnsDetails } = etc;
    const {columnSizer, headerCell} = ColumnSizerEventsUtils.getSizerDetailsViaElementId(
      (selected as HTMLElement).id, columnsDetails);
    // resetting the mouse down properties
    ColumnSizerEvents.mouseUpSizer((moveLimits as SizerMoveLimits).currentOffset, columnSizer,
      headerCell, etc.tableElementEventState);
    if (MovableColumnSizerElement.isMovableColumnSizer(target)) {
      columnSizer.isMouseUpOnSizer = true;
      ColumnSizerEvents.immediatelySetSizerStyleToDefault(columnSizer, etc.columnResizerStyle.hover?.backgroundColor);
      setTimeout(() => {
        columnSizer.isMouseUpOnSizer = false;
        ColumnSizerElement.setTransitionTime(columnSizer.element);
      })
    } else {
      ColumnSizerEvents.blurSizerOnMouseUp(columnSizer);
    }
  }

  // prettier-ignore
  public static sizerOnMouseEnter(this: EditableTableComponent, columnSizer: ColumnSizerT) {
    columnSizer.isSizerHovered = true;
    // if selected and hovered over another
    if (this.tableElementEventState.columnSizer.selected || columnSizer.isMouseUpOnSizer) return;
    ColumnSizerElement.setHoverStyle(
      columnSizer.element, columnSizer.styles.hover.width, true, this.columnResizerStyle.hover?.backgroundColor);
    // only remove the background image if the user is definitely hovering over it
    setTimeout(() => {
      if (columnSizer.isSizerHovered) ColumnSizerElement.unsetBackgroundImage(columnSizer.element);
    }, ColumnSizerEvents.MOUSE_PASSTHROUGH_TIME_ML);
  }

  // prettier-ignore
  public static sizerOnMouseLeave(this: EditableTableComponent, columnSizer: ColumnSizerT) {
    columnSizer.isSizerHovered = false;
    if (this.tableElementEventState.columnSizer.selected) return;
    ColumnSizerElement.setDefaultProperties(columnSizer.element, columnSizer.styles.default.width);
    // when leaving the table, the last sizer can be hovered, hence the following is used to hide it because
    // columnSizer.isSizerHovered can be set to false before this is called, need another way to figure out
    // if the cell was hovered, following method looks at its element style to see if it was highlighted
    // the reason why this is before timeout is because we want to get this information asap
    const isHovered = ColumnSizerElement.isHovered(columnSizer.element);
    // only reset if the user is definitely not hovering over it
    setTimeout(() => {
      if (!this.tableElementEventState.columnSizer.selected && !columnSizer.isSizerHovered) {
        ColumnSizerElement.setPropertiesAfterBlurAnimation(columnSizer.element,
          columnSizer.styles.default.backgroundImage);
        ColumnSizerEvents.hideWhenCellNotHovered(columnSizer, isHovered);
      }
    }, ColumnSizerEvents.MOUSE_PASSTHROUGH_TIME_ML);
  }
}
