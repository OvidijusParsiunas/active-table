import {FocusedCellUtils} from '../../../utils/focusedElements/focusedCellUtils';
import {ColumnSizerCellEvents} from '../../columnSizer/columnSizerCellEvents';
import {ColumnDropdown} from '../../dropdown/columnDropdown/columnDropdown';
import {EditableTableComponent} from '../../../editable-table-component';
import {CellHighlightUtil} from '../../../utils/color/cellHighlightUtil';
import {Dropdown} from '../../dropdown/dropdown';
import {CellEvents} from '../cellEvents';

export class HeaderCellEvents {
  public static mouseEnterCell(this: EditableTableComponent, columnIndex: number, event: MouseEvent) {
    if (!this.tableElementEventState.selectedColumnSizer) {
      CellHighlightUtil.highlight(event.target as HTMLElement, this.columnsDetails[columnIndex].headerStateColors?.hover);
      ColumnSizerCellEvents.cellMouseEnter(this.columnsDetails, columnIndex);
    }
  }

  private static mouseLeaveCell(this: EditableTableComponent, columnIndex: number, event: MouseEvent) {
    if (!Dropdown.isDisplayed(this.overlayElementsState.columnDropdown)) {
      CellHighlightUtil.fade(event.target as HTMLElement, this.columnsDetails[columnIndex].headerStateColors?.default);
    }
    if (!this.tableElementEventState.selectedColumnSizer) {
      ColumnSizerCellEvents.cellMouseLeave(this.columnsDetails, columnIndex);
    }
  }

  private static mouseClick(this: EditableTableComponent, columnIndex: number, event: MouseEvent) {
    const cellElement = event.target as HTMLElement;
    CellEvents.removeTextIfDefault(this, 0, columnIndex, cellElement);
    ColumnDropdown.displayRelevantDropdownElements(this, columnIndex, event);
    setTimeout(() => FocusedCellUtils.setHeaderCell(this.focusedElements.cell, cellElement, columnIndex));
  }

  public static setEvents(etc: EditableTableComponent, cellElement: HTMLElement, columnIndex: number) {
    cellElement.onmouseenter = HeaderCellEvents.mouseEnterCell.bind(etc, columnIndex);
    cellElement.onmouseleave = HeaderCellEvents.mouseLeaveCell.bind(etc, columnIndex);
    cellElement.onclick = HeaderCellEvents.mouseClick.bind(etc, columnIndex);
  }
}
