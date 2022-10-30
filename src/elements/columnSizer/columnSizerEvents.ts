import {StaticTableWidthColumnSizerEvents} from '../../utils/staticTableWidthsUtils/staticTableWidthColumnSizerEvents';
import {ColumnSizerT, SizerMoveLimits, UserSetColumnSizerStyle} from '../../types/columnSizer';
import {TableElementEventState} from '../../types/tableElementEventState';
import {EditableTableComponent} from '../../editable-table-component';
import {MovableColumnSizerElement} from './movableColumnSizerElement';
import {ColumnSizerEventsUtils} from './columnSizerEventsUtils';
import {SEMI_TRANSPARENT_COLOR} from '../../consts/colors';
import {ColumnsDetailsT} from '../../types/columnDetails';
import {ColumnSizerElement} from './columnSizerElement';
import {Browser} from '../../utils/browser/browser';
import {PX} from '../../types/pxDimension';

export class ColumnSizerEvents {
  private static readonly MOUSE_PASSTHROUGH_TIME_ML = 50;

  private static hideWithBlurAnimation(columnSizerElement: HTMLElement) {
    setTimeout(() => {
      ColumnSizerElement.hide(columnSizerElement);
    }, ColumnSizerElement.HALF_TRANSITION_TIME_ML);
  }

  private static hideWhenCellNotHovered(columnSizer: ColumnSizerT, wasHovered: boolean) {
    // do not hide if the other side cell is hovered
    if (columnSizer.isSideCellHovered) return;
    if (wasHovered) {
      ColumnSizerEvents.hideWithBlurAnimation(columnSizer.element);
    } else {
      ColumnSizerElement.hide(columnSizer.element);
    }
  }

  private static hideColumnSizer(columnSizer: ColumnSizerT) {
    if (!columnSizer) return;
    columnSizer.isSideCellHovered = false;
    // cannot use columnSizer.isSizerHovered to identify if animation is present as it can be set to false before
    // this method is called, hence using the background image as an indicator and then checking if the sizer is
    // in fact not hovered in a timeout
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

  // WORK - remove
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

  // WORK - can potentially have this on the element itself?
  // prettier-ignore
  public static tableOnMouseDown(etc: EditableTableComponent, selectedColumnSizer: HTMLElement) {
    const {columnSizer, sizerNumber} = ColumnSizerEventsUtils.getSizerDetailsViaElementId(
      selectedColumnSizer.id, etc.columnsDetails);
    etc.tableElementEventState.columnSizer.selected = columnSizer.element;
    MovableColumnSizerElement.display(etc.tableBodyElementRef as HTMLElement, columnSizer, etc.displayAddRowCell)
    ColumnSizerElement.unsetElementsToDefault(columnSizer.element, columnSizer.styles.default.width);
    ColumnSizerElement.setBackgroundImage(columnSizer.element, columnSizer.styles.default.backgroundImage);
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
  private static mouseUp(leftOffset: number, columnSizer: ColumnSizerT, headerCell: HTMLElement,
      tableElementEventState: TableElementEventState) {
    ColumnSizerEvents.setWidth(columnSizer.element, columnSizer, leftOffset, headerCell);
    MovableColumnSizerElement.hide(columnSizer.movableElement);
    delete tableElementEventState.columnSizer.selected;
  }

  // prettier-ignore
  private static setSizerStyleToHoverNoAnimation(columnSizer: ColumnSizerT, customBackgroundColor?: string) {
    ColumnSizerElement.setHoverStyle(
      columnSizer.element, columnSizer.styles.hover.width, false, customBackgroundColor);
    ColumnSizerElement.unsetBackgroundImage(columnSizer.element);
  }

  private static mouseUpNotOnSizer(columnSizer: ColumnSizerT) {
    // ColumnSizerElement.hide(selectedColumnSizer as HTMLElement);
    const {element: sizerElement, styles: sizerStyles, movableElement} = columnSizer;
    ColumnSizerEvents.setSizerStyleToHoverNoAnimation(columnSizer, movableElement.style.backgroundColor);
    // this kicks off the animation with the hover properties from above
    setTimeout(() => {
      ColumnSizerElement.setTransitionTime(sizerElement);
      ColumnSizerElement.unsetElementsToDefault(sizerElement, sizerStyles.default.width, false);
      ColumnSizerEvents.hideWithBlurAnimation(sizerElement);
    });
    // reset properties after the animation so we have the right properties for mouse enter
    setTimeout(() => {
      ColumnSizerElement.setBackgroundImage(sizerElement, sizerStyles.default.backgroundImage);
      ColumnSizerElement.setColors(sizerElement, SEMI_TRANSPARENT_COLOR);
    }, ColumnSizerElement.TRANSITION_TIME_ML);
  }

  // if the user clicks mouse up on the table first - this will not be activated as columnSizer selected will be removed
  // prettier-ignore
  public static windowOnMouseUp(etc: EditableTableComponent) {
    const { tableElementEventState: { columnSizer: {moveLimits, selected } }, columnsDetails } = etc;
    const {columnSizer, headerCell} = ColumnSizerEventsUtils.getSizerDetailsViaElementId(
      (selected as HTMLElement).id, columnsDetails);
    ColumnSizerEvents.mouseUp((moveLimits as SizerMoveLimits).currentOffset, columnSizer,
      headerCell, etc.tableElementEventState);
    ColumnSizerEvents.mouseUpNotOnSizer(columnSizer);
  }

  private static mouseUpOnSizer(columnSizer: ColumnSizerT, userSetColumnSizerStyle: UserSetColumnSizerStyle) {
    ColumnSizerEvents.setSizerStyleToHoverNoAnimation(columnSizer, userSetColumnSizerStyle.hover?.backgroundColor);
    columnSizer.isMouseUpOnSizer = true;
    setTimeout(() => {
      columnSizer.isMouseUpOnSizer = false;
      ColumnSizerElement.setTransitionTime(columnSizer.element);
    });
  }

  // this method is used to get what exact element was clicked on as window events just return the component as the target
  // prettier-ignore
  public static tableOnMouseUp(etc: EditableTableComponent, target: HTMLElement) {
    const { tableElementEventState: { columnSizer: {moveLimits, selected } }, columnsDetails } = etc;
    const {columnSizer, headerCell} = ColumnSizerEventsUtils.getSizerDetailsViaElementId(
      (selected as HTMLElement).id, columnsDetails);
    ColumnSizerEvents.mouseUp((moveLimits as SizerMoveLimits).currentOffset, columnSizer,
      headerCell, etc.tableElementEventState);
    if (MovableColumnSizerElement.isMovableColumnSizer(target)) {
      ColumnSizerEvents.mouseUpOnSizer(columnSizer, etc.columnResizerStyle);
    } else {
      ColumnSizerEvents.mouseUpNotOnSizer(columnSizer);
    }
  }

  // prettier-ignore
  public static sizerOnMouseEnter(this: EditableTableComponent, columnSizer: ColumnSizerT) {
    columnSizer.isSizerHovered = true;
    // mouse up on sizer triggers this event, but we do not want to execute it here as the animation will not be correct
    if (columnSizer.isMouseUpOnSizer) return;
    ColumnSizerElement.setHoverStyle(
      columnSizer.element, columnSizer.styles.hover.width, true, this.columnResizerStyle.hover?.backgroundColor);
    // only remove the background image if the user is definitely hovering over it
    setTimeout(() => {
      if (columnSizer.isSizerHovered) ColumnSizerElement.unsetBackgroundImage(columnSizer.element);
    }, ColumnSizerEvents.MOUSE_PASSTHROUGH_TIME_ML);
  }

  private static unsetColorDuringTransition(columnSizerElement: HTMLElement, backgroundImage: string) {
    setTimeout(() => {
      ColumnSizerElement.setBackgroundImage(columnSizerElement, backgroundImage);
      setTimeout(() => {
        ColumnSizerElement.unsetTransitionTime(columnSizerElement);
        ColumnSizerElement.setColors(columnSizerElement, SEMI_TRANSPARENT_COLOR);
      }, ColumnSizerElement.HALF_TRANSITION_TIME_ML);
    }, ColumnSizerElement.HALF_TRANSITION_TIME_ML);
  }

  // prettier-ignore
  public static sizerOnMouseLeave(this: EditableTableComponent, columnSizer: ColumnSizerT) {
    columnSizer.isSizerHovered = false;
    if (this.tableElementEventState.columnSizer.selected) return;
    ColumnSizerElement.unsetElementsToDefault(columnSizer.element, columnSizer.styles.default.width);
    // cannot use columnSizer.isSizerHovered because it can be set to false before this method is called, hence using
    // the background image as an indicator and then checking if the sizer is in fact not hovered in a timeout
    const isHovered = ColumnSizerElement.isHovered(columnSizer.element);
    // only reset if the user is definitely not hovering over it
    setTimeout(() => {
      if (!this.tableElementEventState.columnSizer.selected && !columnSizer.isSizerHovered) {
        ColumnSizerEvents.unsetColorDuringTransition(columnSizer.element,
          columnSizer.styles.default.backgroundImage);
        ColumnSizerEvents.hideWhenCellNotHovered(columnSizer, isHovered);
      }
    }, ColumnSizerEvents.MOUSE_PASSTHROUGH_TIME_ML);
  }
}
