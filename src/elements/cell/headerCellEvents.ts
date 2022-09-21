import {HighlightedHeaderCell} from '../../types/highlightedHeaderCell';
import {EditableTableComponent} from '../../editable-table-component';
import {ColumnSizerEvents} from '../columnSizer/columnSizerEvents';
import {Dropdown} from '../dropdown/dropdown';
import {CellEvents} from './cellEvents';

export class HeaderCellEvents {
  private static readonly HOVER_BACKGROUND_COLOR = '#f7f7f7';

  public static fadeCell(cellElement: HTMLElement) {
    cellElement.style.backgroundColor = '';
  }

  // prettier-ignore
  private static highlightCell(
      highlightedHeaderCell: HighlightedHeaderCell, cellElement: HTMLElement, columnIndex: number) {
    cellElement.style.backgroundColor = HeaderCellEvents.HOVER_BACKGROUND_COLOR;
    highlightedHeaderCell.element = cellElement;
    highlightedHeaderCell.columnIndex = columnIndex;
  }

  // prettier-ignore
  private static mouseEnterCell(this: EditableTableComponent, columnIndex: number, event: MouseEvent) {
    HeaderCellEvents.highlightCell(this.highlightedHeaderCell, event.target as HTMLElement, columnIndex);
    ColumnSizerEvents.cellMouseEnter(
      this.columnsDetails, columnIndex, this.overlayElementsState.visibleColumnSizers, event);
  }

  private static mouseLeaveCell(this: EditableTableComponent, columnIndex: number, event: MouseEvent) {
    if (!Dropdown.isDisplayed(this.overlayElementsState.columnDropdown)) {
      HeaderCellEvents.fadeCell(event.target as HTMLElement);
    }
    ColumnSizerEvents.cellMouseLeave(this.columnsDetails, columnIndex, this.overlayElementsState.visibleColumnSizers);
  }

  private static mouseClick(this: EditableTableComponent, columnIndex: number, event: MouseEvent) {
    CellEvents.removeTextIfCellDefault.bind(this)(0, columnIndex, event);
    Dropdown.displayRelevantDropdownElements(this, columnIndex, event);
  }

  public static set(etc: EditableTableComponent, cellElement: HTMLElement, columnIndex: number) {
    cellElement.onmouseenter = HeaderCellEvents.mouseEnterCell.bind(etc, columnIndex);
    cellElement.onmouseleave = HeaderCellEvents.mouseLeaveCell.bind(etc, columnIndex);
    cellElement.onclick = HeaderCellEvents.mouseClick.bind(etc, columnIndex);
  }
}
