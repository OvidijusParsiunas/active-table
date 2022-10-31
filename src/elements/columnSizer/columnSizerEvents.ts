import {StaticTableWidthColumnSizerEvents} from '../../utils/staticTableWidthsUtils/staticTableWidthColumnSizerEvents';
import {TableElementEventState} from '../../types/tableElementEventState';
import {ColumnSizerT, SizerMoveLimits} from '../../types/columnSizer';
import {EditableTableComponent} from '../../editable-table-component';
import {MovableColumnSizerElement} from './movableColumnSizerElement';
import {ColumnSizerEventsUtils} from './columnSizerEventsUtils';
import {SEMI_TRANSPARENT_COLOR} from '../../consts/colors';
import {ColumnsDetailsT} from '../../types/columnDetails';
import {ColumnSizerElement} from './columnSizerElement';
import {Browser} from '../../utils/browser/browser';

export class ColumnSizerEvents {
  private static readonly MOUSE_PASSTHROUGH_TIME_ML = 50;

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
  public static sizerOnMouseDown(this: EditableTableComponent, event: MouseEvent) {
    const {columnSizer, sizerNumber} = ColumnSizerEventsUtils.getSizerDetailsViaElementId(
      (event.target as HTMLElement).id, this.columnsDetails);
    const {element: sizerElement, styles: sizerStyles} = columnSizer;
    this.tableElementEventState.columnSizer.selected = sizerElement;
    MovableColumnSizerElement.display(this.tableBodyElementRef as HTMLElement, columnSizer, this.displayAddRowCell)
    ColumnSizerElement.unsetElementsToDefault(sizerElement, sizerStyles.default.width);
    ColumnSizerElement.setBackgroundImage(sizerElement, sizerStyles.default.backgroundImage);
    // WORK - take into consideration border size and padding
    // const rightColumnsWidth = etc.offsetWidth -
    //   etc.columnsDetails[sizerNumber + 1].elements[0].offsetLeft;
    // WORK
    const rightColumnsWidth = (this.parentElement as HTMLElement).offsetWidth -
    this.columnsDetails[sizerNumber + 1].elements[0].offsetLeft - this.offsetLeft;
    this.tableElementEventState.columnSizer.moveLimits = {
      left: -this.columnsDetails[sizerNumber].elements[0].offsetWidth,
      right: rightColumnsWidth,
      currentOffset: 0,
    }
    // REF-11
    if (this.tableDimensions.width || Browser.IS_SAFARI) {
      StaticTableWidthColumnSizerEvents.setPreResizeSiblingCellsTotalWidth(this.columnsDetails, sizerElement);
    }
  }

  // prettier-ignore
  private static mouseUp(leftOffset: number, columnSizer: ColumnSizerT, headerCell: HTMLElement,
      tableElementEventState: TableElementEventState) {
    ColumnSizerEvents.setWidth(columnSizer.element, columnSizer, leftOffset, headerCell);
    MovableColumnSizerElement.hide(columnSizer.movableElement);
    delete tableElementEventState.columnSizer.selected;
  }

  private static setSizerStyleToHoverNoAnimation(columnSizer: ColumnSizerT, anotherColor?: string) {
    const {width} = columnSizer.styles.hover;
    ColumnSizerElement.setHoverStyle(columnSizer.element, width, false, anotherColor);
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
      ColumnSizerElement.hideWhenCellNotHovered(columnSizer, true);
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

  private static mouseUpOnSizer(columnSizer: ColumnSizerT) {
    ColumnSizerEvents.setSizerStyleToHoverNoAnimation(columnSizer);
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
      ColumnSizerEvents.mouseUpOnSizer(columnSizer);
    } else {
      ColumnSizerEvents.mouseUpNotOnSizer(columnSizer);
    }
  }

  public static sizerOnMouseEnter(columnSizer: ColumnSizerT) {
    columnSizer.isSizerHovered = true;
    // mouse up on sizer triggers this event, but we do not want to execute it here as the animation will not be correct
    if (columnSizer.isMouseUpOnSizer) return;
    const {width} = columnSizer.styles.hover;
    ColumnSizerElement.setHoverStyle(columnSizer.element, width, true);
    // only remove the background image if the user is definitely hovering over it
    setTimeout(() => {
      if (columnSizer.isSizerHovered) ColumnSizerElement.unsetBackgroundImage(columnSizer.element);
    }, ColumnSizerEvents.MOUSE_PASSTHROUGH_TIME_ML);
  }

  // the constant if statement checking is used to prevent a bug where if a mouse leaves the sizer and immediately reenters
  // the timeouts would still proceed to execute the code below
  private static unsetColorDuringTransition(columnSizer: ColumnSizerT) {
    setTimeout(() => {
      if (columnSizer.isSizerHovered) return;
      ColumnSizerElement.setBackgroundImage(columnSizer.element, columnSizer.styles.default.backgroundImage);
      setTimeout(() => {
        if (columnSizer.isSizerHovered) return;
        ColumnSizerElement.unsetTransitionTime(columnSizer.element);
        ColumnSizerElement.setColors(columnSizer.element, SEMI_TRANSPARENT_COLOR);
      }, ColumnSizerElement.HALF_TRANSITION_TIME_ML);
    }, ColumnSizerElement.HALF_TRANSITION_TIME_ML);
  }

  public static sizerOnMouseLeave(this: EditableTableComponent, columnSizer: ColumnSizerT) {
    columnSizer.isSizerHovered = false;
    if (this.tableElementEventState.columnSizer.selected) return;
    const {element: sizerElement, styles: sizerStyles} = columnSizer;
    ColumnSizerElement.unsetElementsToDefault(sizerElement, sizerStyles.default.width);
    // cannot use columnSizer.isSizerHovered because it can be set to false before this method is called, hence using
    // the background image as an indicator and then checking if the sizer is in fact not hovered in a timeout
    const isHovered = ColumnSizerElement.isHovered(sizerElement);
    // only reset if the user is definitely not hovering over it
    setTimeout(() => {
      if (!this.tableElementEventState.columnSizer.selected && !columnSizer.isSizerHovered) {
        ColumnSizerEvents.unsetColorDuringTransition(columnSizer);
        ColumnSizerElement.hideWhenCellNotHovered(columnSizer, isHovered);
      }
    }, ColumnSizerEvents.MOUSE_PASSTHROUGH_TIME_ML);
  }
}
