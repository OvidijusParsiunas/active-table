import {EditableTableComponent} from '../../editable-table-component';
import {ColumnSizerState} from '../../types/overlayElements';
import {ColumnSizerElements} from './columnSizerElements';

export class ColumnSizerEvents {
  public static hide(etc: EditableTableComponent, columnIndex: number) {
    const columnSizerLeft = etc.overlayElements.columnSizers[columnIndex - 1];
    const columnSizerRight = etc.overlayElements.columnSizers[columnIndex];
    setTimeout(() => {
      if (columnSizerLeft && !columnSizerLeft.isMouseHovered) columnSizerLeft.element.style.display = 'none';
      if (!columnSizerRight.isMouseHovered) columnSizerRight.element.style.display = 'none';
    });
  }

  private static displayElement(headerCell: HTMLElement, cellRect: DOMRect, columnSizer: HTMLElement, left: string) {
    columnSizer.style.height = `${headerCell.offsetHeight}px`;
    columnSizer.style.top = `${cellRect.top}px`;
    columnSizer.style.left = left;
    columnSizer.style.display = 'block';
  }

  public static display(etc: EditableTableComponent, columnIndex: number, event: MouseEvent) {
    const headerCellElement = event.target as HTMLElement;
    const cellRect = headerCellElement.getBoundingClientRect();
    const columnSizerLeft = etc.overlayElements.columnSizers[columnIndex - 1];
    if (columnSizerLeft) {
      ColumnSizerEvents.displayElement(headerCellElement, cellRect, columnSizerLeft.element, `${cellRect.left}px`);
    }
    const columnSizerRight = etc.overlayElements.columnSizers[columnIndex];
    const columnRightSizerLeft = `${cellRect.left + cellRect.width}px`;
    ColumnSizerEvents.displayElement(headerCellElement, cellRect, columnSizerRight.element, columnRightSizerLeft);
  }

  public static onMouseEnter(this: ColumnSizerElements, columnSizerState: ColumnSizerState) {
    columnSizerState.isMouseHovered = true;
    columnSizerState.element.style.transition = `0.2s`;
    // only remove the background image if the user is definitely hovering over it
    setTimeout(() => {
      if (columnSizerState.isMouseHovered) columnSizerState.element.style.backgroundImage = 'none';
    }, 50);
  }

  public static onMouseLeave(this: ColumnSizerElements, columnSizerState: ColumnSizerState) {
    columnSizerState.isMouseHovered = false;
    // only reset the background image if the user is definitely not hovering over it
    setTimeout(() => {
      if (!columnSizerState.isMouseHovered) {
        columnSizerState.element.style.transition = `0.0s`;
        columnSizerState.element.style.backgroundImage = ColumnSizerElements.BACKGROUND_IMAGE;
      }
    }, 100);
  }
}
