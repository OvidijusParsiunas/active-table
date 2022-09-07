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

  // prettier-ignore
  public static display(etc: EditableTableComponent, columnIndex: number, event: MouseEvent) {
    const headerCellElement = event.target as HTMLElement;
    const cellRect = headerCellElement.getBoundingClientRect();
    const columnSizerLeft = etc.overlayElements.columnSizers[columnIndex - 1];
    if (columnSizerLeft) {
      ColumnSizerEvents.displayElement(headerCellElement, cellRect, columnSizerLeft.element, `${cellRect.left}px`);
    }
    const columnSizerRight = etc.overlayElements.columnSizers[columnIndex];
    ColumnSizerEvents.displayElement(
      headerCellElement, cellRect, columnSizerRight.element, `${cellRect.left + cellRect.width}px`);
  }

  public static onMouseEnter(this: ColumnSizerElements, columnSizerState: ColumnSizerState) {
    columnSizerState.isMouseHovered = true;
    columnSizerState.element.style.transition = `0.2s`;
  }

  public static onMouseLeave(this: ColumnSizerElements, columnSizerState: ColumnSizerState) {
    columnSizerState.isMouseHovered = false;
    setTimeout(() => (columnSizerState.element.style.transition = `0.0s`));
  }
}
