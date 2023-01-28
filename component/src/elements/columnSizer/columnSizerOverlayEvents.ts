import {ColumnSizerGenericUtils} from './utils/columnSizerGenericUtils';
import {MovableColumnSizerElement} from './movableColumnSizerElement';
import {SelectedColumnSizer} from './utils/selectedColumnSizer';
import {SEMI_TRANSPARENT_COLOR} from '../../consts/colors';
import {ColumnSizerElement} from './columnSizerElement';
import {ColumnSizerT} from '../../types/columnSizer';
import {ActiveTable} from '../../activeTable';

export class ColumnSizerOverlayEvents {
  public static readonly MOUSE_PASSTHROUGH_TIME_ML = 50;

  public static overlayMouseEnter(this: ActiveTable, columnSizer: ColumnSizerT) {
    columnSizer.isSizerHovered = true;
    // mouse up on sizer triggers this event, but we do not want to execute it here as the animation will not be correct
    if (columnSizer.isMouseUpOnSizer || this.activeOverlayElements.selectedColumnSizer) return;
    const {width} = columnSizer.styles.hover;
    ColumnSizerElement.display(columnSizer.element);
    ColumnSizerElement.setTransitionTime(columnSizer.element);
    setTimeout(() => {
      if (columnSizer.isSizerHovered) ColumnSizerElement.setHoverStyle(columnSizer, width, false);
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
        ColumnSizerElement.setBackgroundColor(columnSizer.element, SEMI_TRANSPARENT_COLOR);
      }, ColumnSizerElement.HALF_TRANSITION_TIME_ML);
    }, ColumnSizerElement.HALF_TRANSITION_TIME_ML);
  }

  public static overlayMouseLeave(this: ActiveTable, columnSizer: ColumnSizerT) {
    columnSizer.isSizerHovered = false;
    // in safari - mouse leave is fired after mouse up, hence we have thie columnSizer.isMouseUpOnSizer check
    if (this.activeOverlayElements.selectedColumnSizer || columnSizer.isMouseUpOnSizer) return;
    const {element: sizerElement, styles: sizerStyles} = columnSizer;
    ColumnSizerElement.unsetElementsToDefault(sizerElement, sizerStyles.default.width);
    // cannot use columnSizer.isSizerHovered because it can be set to false before this method is called, hence using
    // the background image as an indicator and then checking if the sizer is in fact not hovered in a timeout
    const isHovered = ColumnSizerElement.isHovered(sizerElement);
    // only reset if the user is definitely not hovering over it
    setTimeout(() => {
      if (!this.activeOverlayElements.selectedColumnSizer && !columnSizer.isSizerHovered) {
        ColumnSizerOverlayEvents.unsetColorDuringTransition(columnSizer);
        ColumnSizerElement.hideWhenCellNotHovered(columnSizer, isHovered);
      }
    }, ColumnSizerOverlayEvents.MOUSE_PASSTHROUGH_TIME_ML);
  }

  // we need to pass down the sizer element instead of the id as the id can change when columns are inserted/removed
  // prettier-ignore
  public static overlayMouseDown(this: ActiveTable, sizer: HTMLElement) {
    const {columnsDetails, tableBodyElementRef, auxiliaryTableContentInternal: {displayAddRowCell}} = this;
    const {columnSizer, sizerNumber} = ColumnSizerGenericUtils.getSizerDetailsViaElementId(sizer.id, columnsDetails);
    const {element: sizerElement, styles: sizerStyles} = columnSizer;
    MovableColumnSizerElement.display(tableBodyElementRef as HTMLElement, columnSizer, displayAddRowCell);
    ColumnSizerElement.unsetElementsToDefault(sizerElement, sizerStyles.default.width);
    ColumnSizerElement.setBackgroundImage(sizerElement, sizerStyles.default.backgroundImage);
    this.activeOverlayElements.selectedColumnSizer = SelectedColumnSizer.get(this, sizerNumber);
  }
}
