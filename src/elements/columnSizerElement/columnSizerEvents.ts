import {ColumnsDetails, ColumnSizerT} from '../../types/columnDetails';
import {EditableTableComponent} from '../../editable-table-component';
import {ColumnSizerElement} from './columnSizerElement';
import {ElementSet} from '../../types/elementSet';
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

  private static hideColumnSizer(columnSizer: ColumnSizerT, visibleSizers: ElementSet) {
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
        visibleSizers.delete(columnSizer.element);
      }
    });
  }

  public static cellMouseLeave(columnsDetails: ColumnsDetails, columnIndex: number, visibleSizers: ElementSet) {
    ColumnSizerEvents.hideColumnSizer(columnsDetails[columnIndex - 1]?.columnSizer, visibleSizers);
    ColumnSizerEvents.hideColumnSizer(columnsDetails[columnIndex].columnSizer, visibleSizers);
  }

  private static displayColumnSizer(columnSizer: ColumnSizerT, height: PX, visibleSizers: ElementSet) {
    if (!columnSizer) return;
    ColumnSizerElement.display(columnSizer.element, height);
    columnSizer.isSideCellHovered = true;
    visibleSizers.add(columnSizer.element);
  }

  // prettier-ignore
  public static cellMouseEnter(
      columnsDetails: ColumnsDetails, columnIndex: number, visibleSizers: ElementSet, event: MouseEvent) {
    const headerCellElement = event.target as HTMLElement;
    const height: PX = `${headerCellElement.offsetHeight}px`;
    ColumnSizerEvents.displayColumnSizer(columnsDetails[columnIndex - 1]?.columnSizer, height, visibleSizers);
    ColumnSizerEvents.displayColumnSizer(columnsDetails[columnIndex].columnSizer, height, visibleSizers);
  }

  private static setNewColumnWidth(columnElement: HTMLElement, colWidth: number, newXMovement: number) {
    const newWidth = `${colWidth + newXMovement}px`;
    columnElement.style.width = newWidth;
  }

  private static getColumnDetailsViaElementId(id: string, columnsDetails: ColumnsDetails) {
    const sizerNumber = Number(id.replace(/\D/g, ''));
    return columnsDetails[sizerNumber];
  }

  // the reason why table events are used to track mouse move events on column sizers is because otherwise when
  // the mouse moves quickly - it can leave the column sizer and events would stop firing
  // prettier-ignore
  public static tableOnMouseMove(selectedColumnSizer: HTMLElement, columnsDetails: ColumnsDetails, newXMovement: number) {
    const { columnSizer, elements: [columnElement] } =
      ColumnSizerEvents.getColumnDetailsViaElementId(selectedColumnSizer.id, columnsDetails);
    ColumnSizerElement.unsetTransitionTime(columnSizer.element);
    const {width, height} = columnElement.getBoundingClientRect();
    ColumnSizerEvents.setNewColumnWidth(columnElement, width, newXMovement);
    // if the header cell size increases or decreases as the width is changed
    // the reason why it is set in a timeout is in order to try to minimize the upfront operations for performance
    setTimeout(() => (selectedColumnSizer.style.height = `${height}px`));
  }

  // the following method allows us to track when the user stops dragging mouse even when not on the column sizer
  public static tableOnMouseUp(selectedColumnSizer: HTMLElement, columnsDetails: ColumnsDetails, target: HTMLElement) {
    ColumnSizerElement.setTransitionTime(selectedColumnSizer);
    const {columnSizer} = ColumnSizerEvents.getColumnDetailsViaElementId(selectedColumnSizer.id, columnsDetails);
    // if mouse up on a different element
    if (target !== selectedColumnSizer) {
      ColumnSizerElement.setDefaultProperties(selectedColumnSizer, columnSizer.styles.default.width);
      ColumnSizerElement.setPropertiesAfterBlurAnimation(selectedColumnSizer, columnSizer.styles.default.backgroundImage);
      ColumnSizerElement.hideAfterBlurAnimation(columnSizer.element);
    }
  }

  // in addition to the above method, the following allows us to track when the mouse has left the table
  public static tableOnMouseLeave(selectedColumnSizer: HTMLElement, columnsDetails: ColumnsDetails) {
    const {columnSizer} = ColumnSizerEvents.getColumnDetailsViaElementId(selectedColumnSizer.id, columnsDetails);
    ColumnSizerElement.setTransitionTime(selectedColumnSizer);
    ColumnSizerElement.setDefaultProperties(selectedColumnSizer, columnSizer.styles.default.width);
    ColumnSizerElement.setPropertiesAfterBlurAnimation(selectedColumnSizer, columnSizer.styles.default.backgroundImage);
  }

  public static sizerOnMouseEnter(this: EditableTableComponent, columnSizer: ColumnSizerT) {
    columnSizer.isSizerHovered = true;
    // if selected and hovered over another
    if (this.tableElementEventState.selectedColumnSizer) return;
    ColumnSizerElement.setHoverProperties(columnSizer.element, columnSizer.styles.hover.width);
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
    const wasHovered = ColumnSizerElement.isHovered(columnSizer.element);
    // only reset if the user is definitely not hovering over it
    setTimeout(() => {
      if (!this.tableElementEventState.selectedColumnSizer && !columnSizer.isSizerHovered) {
        ColumnSizerElement.setPropertiesAfterBlurAnimation(columnSizer.element,
          columnSizer.styles.default.backgroundImage);
        ColumnSizerEvents.hideWhenCellNotHovered(columnSizer, wasHovered);
      }
    }, ColumnSizerEvents.MOUSE_PASSTHROUGH_TIME_ML);
  }
}
