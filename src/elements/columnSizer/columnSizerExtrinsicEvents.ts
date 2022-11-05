import {UpdateRowElement} from '../../utils/insertRemoveStructure/update/updateRowElement';
import {ColumnSizerT, SelectedColumnSizerT} from '../../types/columnSizer';
import {EditableTableComponent} from '../../editable-table-component';
import {MovableColumnSizerElement} from './movableColumnSizerElement';
import {ColumnSizerGenericUtils} from './columnSizerGenericUtils';
import {TableDimensions} from '../../types/tableDimensions';
import {SEMI_TRANSPARENT_COLOR} from '../../consts/colors';
import {ColumnsDetailsT} from '../../types/columnDetails';
import {ColumnSizerSetWidth} from './columnSizerSetWidth';
import {ColumnSizerElement} from './columnSizerElement';

export class ColumnSizerExtrinsicEvents {
  private static moveMovableElement(selectedColumnSizer: HTMLElement, columnsDetails: ColumnsDetailsT, newLeft: number) {
    const {columnSizer} = ColumnSizerGenericUtils.getSizerDetailsViaElementId(selectedColumnSizer.id, columnsDetails);
    columnSizer.movableElement.style.left = `${newLeft}px`;
  }

  // prettier-ignore
  public static windowMouseMove(etc: EditableTableComponent, newXMovement: number) {
    const {tableElementEventState: {selectedColumnSizer}, columnsDetails} = etc;
    if (selectedColumnSizer) {
      const {moveLimits, element} = selectedColumnSizer;
      selectedColumnSizer.mouseMoveOffset += newXMovement;
      if (selectedColumnSizer.mouseMoveOffset >= moveLimits.left
          && selectedColumnSizer.mouseMoveOffset <= moveLimits.right) {
        ColumnSizerExtrinsicEvents.moveMovableElement(element, columnsDetails, selectedColumnSizer.mouseMoveOffset);
      }
    }
  }

  // prettier-ignore
  private static setWidth(selectedColumnSizer: SelectedColumnSizerT, tableElement: HTMLElement,
      tableDimensions: TableDimensions, leftHeader: HTMLElement, rightHeader?: HTMLElement) {
    ColumnSizerElement.unsetTransitionTime(selectedColumnSizer.element);
    ColumnSizerSetWidth.set(selectedColumnSizer, tableElement, tableDimensions, leftHeader, rightHeader);
    // header cell size can increase or decrease as the width is changed
    setTimeout(() => UpdateRowElement.updateHeaderHeight(leftHeader.parentElement as HTMLElement));
  }

  // prettier-ignore
  private static mouseUp(etc: EditableTableComponent) {
    const {tableElementEventState, columnsDetails, tableDimensions, tableElementRef} = etc;
    const selectedColumnSizer = tableElementEventState.selectedColumnSizer as SelectedColumnSizerT;
    const {columnSizer, headerCell, sizerNumber} = ColumnSizerGenericUtils.getSizerDetailsViaElementId(
      selectedColumnSizer.element.id, columnsDetails);
    ColumnSizerExtrinsicEvents.setWidth(selectedColumnSizer, tableElementRef as HTMLElement, tableDimensions,
      headerCell, columnsDetails[sizerNumber + 1]?.elements[0]);
    MovableColumnSizerElement.hide(columnSizer.movableElement);
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
    const {columnSizer} = ColumnSizerGenericUtils.getSizerDetailsViaElementId(
      (etc.tableElementEventState.selectedColumnSizer as SelectedColumnSizerT).element.id, etc.columnsDetails);
    ColumnSizerExtrinsicEvents.mouseUp(etc);
    ColumnSizerExtrinsicEvents.mouseUpNotOnSizer(columnSizer);
    delete etc.tableElementEventState.selectedColumnSizer;
  }

  private static mouseUpOnSizer(columnSizer: ColumnSizerT) {
    ColumnSizerExtrinsicEvents.setSizerStyleToHoverNoAnimation(columnSizer);
    columnSizer.isMouseUpOnSizer = true;
    setTimeout(() => {
      columnSizer.isMouseUpOnSizer = false;
      ColumnSizerElement.setTransitionTime(columnSizer.element);
    });
  }

  // this method is used to get what exact element was clicked on as window events just returns the component as the target
  // prettier-ignore
  public static tableMouseUp(etc: EditableTableComponent, target: HTMLElement) {
    const selectedColumnSizer = etc.tableElementEventState.selectedColumnSizer as SelectedColumnSizerT;
    const {columnSizer} = ColumnSizerGenericUtils.getSizerDetailsViaElementId(
      selectedColumnSizer.element.id, etc.columnsDetails);
    ColumnSizerExtrinsicEvents.mouseUp(etc);
    // when autorise happens - the sizer usually moves out of the cursor area
    if (MovableColumnSizerElement.isMovableColumnSizer(target) && !selectedColumnSizer.wasAutoresized) {
      ColumnSizerExtrinsicEvents.mouseUpOnSizer(columnSizer);
    } else {
      ColumnSizerExtrinsicEvents.mouseUpNotOnSizer(columnSizer);
    }
    delete etc.tableElementEventState.selectedColumnSizer;
  }
}
