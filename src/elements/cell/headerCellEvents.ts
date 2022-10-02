import {FocusedCellUtils} from '../../utils/focusedCell/focusedCellUtils';
import {ColumnDropdown} from '../dropdown/columnDropdown/columnDropdown';
import {EditableTableComponent} from '../../editable-table-component';
import {ColumnSizerEvents} from '../columnSizer/columnSizerEvents';
import {Dropdown} from '../dropdown/dropdown';
import {CellEvents} from './cellEvents';

export class HeaderCellEvents {
  private static readonly HOVER_BACKGROUND_COLOR = '#f7f7f7';

  public static fadeCell(cellElement: HTMLElement) {
    cellElement.style.backgroundColor = '';
  }

  private static highlightCell(cellElement: HTMLElement) {
    cellElement.style.backgroundColor = HeaderCellEvents.HOVER_BACKGROUND_COLOR;
  }

  private static mouseEnterCell(this: EditableTableComponent, columnIndex: number, event: MouseEvent) {
    HeaderCellEvents.highlightCell(event.target as HTMLElement);
    ColumnSizerEvents.cellMouseEnter(this.columnsDetails, columnIndex, event);
  }

  private static mouseLeaveCell(this: EditableTableComponent, columnIndex: number, event: MouseEvent) {
    if (!Dropdown.isDisplayed(this.overlayElementsState.columnDropdown)) {
      HeaderCellEvents.fadeCell(event.target as HTMLElement);
    }
    ColumnSizerEvents.cellMouseLeave(this.columnsDetails, columnIndex);
  }

  private static mouseClick(this: EditableTableComponent, columnIndex: number, event: MouseEvent) {
    const cellElement = event.target as HTMLElement;
    CellEvents.removeTextIfDefault(this, 0, columnIndex, cellElement);
    ColumnDropdown.displayRelevantDropdownElements(this, columnIndex, event);
    setTimeout(() => FocusedCellUtils.setHeaderCell(this.focusedCell, cellElement, columnIndex));
  }

  public static set(etc: EditableTableComponent, cellElement: HTMLElement, columnIndex: number) {
    cellElement.onmouseenter = HeaderCellEvents.mouseEnterCell.bind(etc, columnIndex);
    cellElement.onmouseleave = HeaderCellEvents.mouseLeaveCell.bind(etc, columnIndex);
    cellElement.onclick = HeaderCellEvents.mouseClick.bind(etc, columnIndex);
  }
}
