import {EditableTableComponent} from '../../editable-table-component';
import {MovableColumnSizerElement} from './movableColumnSizerElement';
import {ColumnSizerGenericUtils} from './columnSizerGenericUtils';
import {SEMI_TRANSPARENT_COLOR} from '../../consts/colors';
import {ColumnSizerElement} from './columnSizerElement';
import {ColumnSizerT} from '../../types/columnSizer';
import {Browser} from '../../utils/browser/browser';

export class ColumnSizerOverlayEvents {
  public static readonly MOUSE_PASSTHROUGH_TIME_ML = 50;

  public static overlayMouseEnter(this: EditableTableComponent, columnSizer: ColumnSizerT) {
    columnSizer.isSizerHovered = true;
    // mouse up on sizer triggers this event, but we do not want to execute it here as the animation will not be correct
    if (columnSizer.isMouseUpOnSizer || this.tableElementEventState.selectedColumnSizer) return;
    const {width} = columnSizer.styles.hover;
    ColumnSizerElement.display(columnSizer.element);
    ColumnSizerElement.setTransitionTime(columnSizer.element);
    setTimeout(() => {
      if (columnSizer.isSizerHovered) {
        ColumnSizerElement.setHoverStyle(columnSizer.element, width, false);
      }
    }, 1);
    // only remove the background image if the user is definitely hovering over it
    setTimeout(() => {
      if (columnSizer.isSizerHovered) ColumnSizerElement.unsetBackgroundImage(columnSizer.element);
    }, ColumnSizerOverlayEvents.MOUSE_PASSTHROUGH_TIME_ML);
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

  public static overlayMouseLeave(this: EditableTableComponent, columnSizer: ColumnSizerT) {
    columnSizer.isSizerHovered = false;
    if (this.tableElementEventState.selectedColumnSizer) return;
    const {element: sizerElement, styles: sizerStyles} = columnSizer;
    ColumnSizerElement.unsetElementsToDefault(sizerElement, sizerStyles.default.width);
    // cannot use columnSizer.isSizerHovered because it can be set to false before this method is called, hence using
    // the background image as an indicator and then checking if the sizer is in fact not hovered in a timeout
    const isHovered = ColumnSizerElement.isHovered(sizerElement);
    // only reset if the user is definitely not hovering over it
    setTimeout(() => {
      if (!this.tableElementEventState.selectedColumnSizer && !columnSizer.isSizerHovered) {
        ColumnSizerOverlayEvents.unsetColorDuringTransition(columnSizer);
        ColumnSizerElement.hideWhenCellNotHovered(columnSizer, isHovered);
      }
    }, ColumnSizerOverlayEvents.MOUSE_PASSTHROUGH_TIME_ML);
  }

  // prettier-ignore
  private static getRightColumnLimit(etc: EditableTableComponent, leftHeader: HTMLElement,
      rightHeader?: HTMLElement, headerAfterRight = false) {
    // WORK - take into consideration border size and padding
    const cellRightBorderOffset = leftHeader.offsetLeft + leftHeader.offsetWidth;
    if (etc.tableDimensions.width || Browser.IS_SAFARI) {
      let rightLimit = rightHeader?.offsetWidth || 0;
      if (!headerAfterRight) {
        // these ain't going to change so can store them in state
        rightLimit += Number.parseInt(leftHeader.style.borderRightWidth) || 0;
      }
      return rightLimit;
    }
    const parentOffset = (etc.parentElement as HTMLElement).offsetWidth;
    const offsetInParent = etc.offsetLeft;
    return parentOffset - offsetInParent - cellRightBorderOffset;
  }

  private static getLeftLimit(leftHeader: HTMLElement, headerBeforeLeft?: boolean) {
    let leftLimit = -leftHeader.offsetWidth;
    if (!headerBeforeLeft) {
      // these ain't going to change so can store them in state
      leftLimit -= Number.parseInt(leftHeader.style.borderLeftWidth) || 0;
    }
    return leftLimit;
  }

  public static overlayMouseDown(this: EditableTableComponent, sizerId: string) {
    const {columnSizer, sizerNumber} = ColumnSizerGenericUtils.getSizerDetailsViaElementId(sizerId, this.columnsDetails);
    const {element: sizerElement, styles: sizerStyles} = columnSizer;
    MovableColumnSizerElement.display(this.tableBodyElementRef as HTMLElement, columnSizer, this.displayAddRowCell);
    ColumnSizerElement.unsetElementsToDefault(sizerElement, sizerStyles.default.width);
    ColumnSizerElement.setBackgroundImage(sizerElement, sizerStyles.default.backgroundImage);
    // WORK
    // take note of cell and table borders
    // last column should not have the next sizer if it is
    // use the number instead of overreaching
    const headerBeforeLeft = this.columnsDetails[sizerNumber - 1];
    const leftHeader = this.columnsDetails[sizerNumber].elements[0];
    const rightHeader = this.columnsDetails[sizerNumber + 1]?.elements[0];
    const headerAfterRight = this.columnsDetails[sizerNumber + 2];
    // column is centered and starts with an offset, hence mouseMoveOffset starts with that offset in order to place
    // the vertical line at the correct left limit
    const columnSizerOffset = columnSizer.movableElement.offsetLeft;
    this.tableElementEventState.selectedColumnSizer = {
      element: sizerElement,
      moveLimits: {
        left: ColumnSizerOverlayEvents.getLeftLimit(leftHeader, !!headerBeforeLeft) + columnSizerOffset,
        right:
          ColumnSizerOverlayEvents.getRightColumnLimit(this, leftHeader, rightHeader, !!headerAfterRight) +
          columnSizerOffset,
      },
      initialOffset: columnSizerOffset,
      mouseMoveOffset: columnSizerOffset,
    };
  }
}
