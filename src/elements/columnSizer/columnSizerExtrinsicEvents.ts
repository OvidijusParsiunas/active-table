import {UpdateRowElement} from '../../utils/insertRemoveStructure/update/updateRowElement';
import {ColumnSizerT, SelectedColumnSizer} from '../../types/columnSizer';
import {TableElementEventState} from '../../types/tableElementEventState';
import {EditableTableComponent} from '../../editable-table-component';
import {MovableColumnSizerElement} from './movableColumnSizerElement';
import {ColumnSizerEventsUtils} from './columnSizerEventsUtils';
import {SEMI_TRANSPARENT_COLOR} from '../../consts/colors';
import {ColumnsDetailsT} from '../../types/columnDetails';
import {ColumnSizerElement} from './columnSizerElement';

export class ColumnSizerExtrinsicEvents {
  private static moveMovableElement(selectedColumnSizer: HTMLElement, columnsDetails: ColumnsDetailsT, newLeft: number) {
    const {columnSizer} = ColumnSizerEventsUtils.getSizerDetailsViaElementId(selectedColumnSizer.id, columnsDetails);
    columnSizer.movableElement.style.left = `${newLeft}px`;
  }

  // prettier-ignore
  public static windowMouseMove(etc: EditableTableComponent, newXMovement: number) {
    const {tableElementEventState: {selectedColumnSizer}, columnsDetails} = etc;
    if (selectedColumnSizer) {
      const {moveLimits, element} = selectedColumnSizer;
      selectedColumnSizer.mouseMoveOffset += newXMovement;
      if (selectedColumnSizer.mouseMoveOffset > moveLimits.left
          && selectedColumnSizer.mouseMoveOffset < moveLimits.right) {
        ColumnSizerExtrinsicEvents.moveMovableElement(element, columnsDetails, selectedColumnSizer.mouseMoveOffset);
      }
    }
  }

  public static setWidth(selectedColumnSizer: SelectedColumnSizer, headerCell: HTMLElement) {
    ColumnSizerElement.unsetTransitionTime(selectedColumnSizer.element);
    ColumnSizerEventsUtils.changeElementWidth(selectedColumnSizer, headerCell);
    // header cell size can increase or decrease as the width is changed
    setTimeout(() => UpdateRowElement.updateHeaderHeight(headerCell.parentElement as HTMLElement));
  }

  // WORK - remove
  // prettier-ignore
  // private static mouseMoveStaticTableWidthFunc(selectedColumnSizer: HTMLElement,
  //     columnsDetails: ColumnsDetailsT, newXMovement: number, etc: EditableTableComponent) {
  //   const { columnSizer, headerCell, sizerNumber } = ColumnSizerEventsUtils.getSizerDetailsViaElementId(
  //     selectedColumnSizer.id, columnsDetails);
  //   // StaticTableWidthColumnSizerEvents.changeNextColumnSize(etc, columnsDetails[sizerNumber + 1], newXMovement,
  //   //   columnSizer.siblingCellsTotalWidth as number, headerCell as HTMLElement);
  // }

  // WORK - remove
  // prettier-ignore
  // private static mouseMoveDynamicTableWidthFunc(
  //     selectedColumnSizer: HTMLElement, columnsDetails: ColumnsDetailsT, newXMovement: number) {
  //   const { columnSizer, headerCell } = ColumnSizerEventsUtils.getSizerDetailsViaElementId(
  //     selectedColumnSizer.id, columnsDetails);
  //   ColumnSizerEvents.setWidth(columnSizer, newXMovement, headerCell);
  // }

  // prettier-ignore
  private static mouseUp(tableElementEventState: TableElementEventState, headerCell: HTMLElement,
      movableSizer: HTMLElement) {
    ColumnSizerExtrinsicEvents.setWidth(tableElementEventState.selectedColumnSizer as SelectedColumnSizer, headerCell);
    MovableColumnSizerElement.hide(movableSizer);
    delete tableElementEventState.selectedColumnSizer;
  }

  private static setSizerStyleToHoverNoAnimation(columnSizer: ColumnSizerT, anotherColor?: string) {
    const {width} = columnSizer.styles.hover;
    ColumnSizerElement.setHoverStyle(columnSizer.element, width, false, anotherColor);
    ColumnSizerElement.unsetBackgroundImage(columnSizer.element);
  }

  private static mouseUpNotOnSizer(columnSizer: ColumnSizerT) {
    // ColumnSizerElement.hide(selectedColumnSizer as HTMLElement);
    const {element: sizerElement, styles: sizerStyles, movableElement} = columnSizer;
    ColumnSizerExtrinsicEvents.setSizerStyleToHoverNoAnimation(columnSizer, movableElement.style.backgroundColor);
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
  public static windowMouseUp(etc: EditableTableComponent) {
    const {tableElementEventState, columnsDetails} = etc;
    const {columnSizer, headerCell} = ColumnSizerEventsUtils.getSizerDetailsViaElementId(
      (tableElementEventState.selectedColumnSizer as SelectedColumnSizer).element.id, columnsDetails);
    ColumnSizerExtrinsicEvents.mouseUp(tableElementEventState, headerCell, columnSizer.movableElement);
    ColumnSizerExtrinsicEvents.mouseUpNotOnSizer(columnSizer);
  }

  private static mouseUpOnSizer(columnSizer: ColumnSizerT) {
    ColumnSizerExtrinsicEvents.setSizerStyleToHoverNoAnimation(columnSizer);
    columnSizer.isMouseUpOnSizer = true;
    setTimeout(() => {
      columnSizer.isMouseUpOnSizer = false;
      ColumnSizerElement.setTransitionTime(columnSizer.element);
    });
  }

  // this method is used to get what exact element was clicked on as window events just return the component as the target
  // prettier-ignore
  public static tableMouseUp(etc: EditableTableComponent, target: HTMLElement) {
    const {tableElementEventState, columnsDetails} = etc;
    const {columnSizer, headerCell} = ColumnSizerEventsUtils.getSizerDetailsViaElementId(
      (tableElementEventState.selectedColumnSizer as SelectedColumnSizer).element.id, columnsDetails);
    ColumnSizerExtrinsicEvents.mouseUp(tableElementEventState, headerCell, columnSizer.movableElement);
    if (MovableColumnSizerElement.isMovableColumnSizer(target)) {
      ColumnSizerExtrinsicEvents.mouseUpOnSizer(columnSizer);
    } else {
      ColumnSizerExtrinsicEvents.mouseUpNotOnSizer(columnSizer);
    }
  }
}
