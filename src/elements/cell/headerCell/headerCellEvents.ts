import {ColumnDropdownCellOverlay} from '../../dropdown/columnDropdown/cellOverlay/columnDropdownCellOverlay';
import {FocusedCellUtils} from '../../../utils/focusedElements/focusedCellUtils';
import {ColumnSizerCellEvents} from '../../columnSizer/columnSizerCellEvents';
import {ColumnDropdown} from '../../dropdown/columnDropdown/columnDropdown';
import {CellHighlightUtils} from '../../../utils/color/cellHighlightUtils';
import {EditableTableComponent} from '../../../editable-table-component';
import {Dropdown} from '../../dropdown/dropdown';
import {CellEvents} from '../cellEvents';

export class HeaderCellEvents {
  public static mouseEnterCell(this: EditableTableComponent, columnIndex: number, event: MouseEvent) {
    if (!this.activeOverlayElements.selectedColumnSizer) {
      const columnDetails = this.columnsDetails[columnIndex];
      const cellElement = event.target as HTMLElement;
      CellHighlightUtils.highlight(cellElement, columnDetails.headerStateColors?.hover);
      ColumnSizerCellEvents.cellMouseEnter(this.columnsDetails, columnIndex);
      if (this.columnDropdownDisplaySettings.openMethod?.overlayClick) ColumnDropdownCellOverlay.display(columnDetails);
      this.hoveredElements.headerCell = cellElement;
    }
  }

  public static mouseLeaveCell(this: EditableTableComponent, columnIndex: number, event: MouseEvent) {
    if (!Dropdown.isDisplayed(this.activeOverlayElements.columnDropdown)) {
      CellHighlightUtils.fade(event.target as HTMLElement, this.columnsDetails[columnIndex].headerStateColors?.default);
      ColumnDropdownCellOverlay.hide(this, this.columnsDetails[columnIndex]);
      if (this.columnDropdownDisplaySettings.openMethod?.overlayClick) delete this.hoveredElements.headerCell;
    }
    if (!this.activeOverlayElements.selectedColumnSizer) {
      ColumnSizerCellEvents.cellMouseLeave(this.columnsDetails, columnIndex);
    }
  }

  public static mouseClick(this: EditableTableComponent, columnIndex: number, event: MouseEvent) {
    const cellElement = event.target as HTMLElement;
    CellEvents.removeTextIfDefault(this, 0, columnIndex, cellElement);
    if (this.columnDropdownDisplaySettings.openMethod?.cellClick) ColumnDropdown.display(this, columnIndex);
    setTimeout(() => FocusedCellUtils.setHeaderCell(this.focusedElements.cell, cellElement, columnIndex));
  }

  public static setEvents(etc: EditableTableComponent, cellElement: HTMLElement, columnIndex: number) {
    cellElement.onmouseenter = HeaderCellEvents.mouseEnterCell.bind(etc, columnIndex);
    cellElement.onmouseleave = HeaderCellEvents.mouseLeaveCell.bind(etc, columnIndex);
    cellElement.onclick = HeaderCellEvents.mouseClick.bind(etc, columnIndex);
  }
}
