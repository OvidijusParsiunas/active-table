import {ColumnDropdownCellOverlay} from '../../dropdown/columnDropdown/cellOverlay/columnDropdownCellOverlay';
import {FocusedCellUtils} from '../../../utils/focusedElements/focusedCellUtils';
import {ColumnSizerCellEvents} from '../../columnSizer/columnSizerCellEvents';
import {ColumnDropdown} from '../../dropdown/columnDropdown/columnDropdown';
import {CellHighlightUtils} from '../../../utils/color/cellHighlightUtils';
import {DragColumn} from '../../../utils/moveStructure/drag/dragColumn';
import {ActiveTable} from '../../../activeTable';
import {Dropdown} from '../../dropdown/dropdown';
import {CellEvents} from '../cellEvents';

export class HeaderCellEvents {
  public static mouseEnterCell(this: ActiveTable, columnIndex: number, event: MouseEvent) {
    if (!this._activeOverlayElements.selectedColumnSizer) {
      const columnDetails = this._columnsDetails[columnIndex];
      const cellElement = event.target as HTMLElement;
      CellHighlightUtils.highlight(cellElement, columnDetails.headerStateColors?.hover);
      ColumnSizerCellEvents.cellMouseEnter(this._columnsDetails, columnIndex);
      const openViaOverlayClick = this._defaultColumnsSettings.columnDropdown?.displaySettings?.openMethod?.overlayClick;
      if (openViaOverlayClick) ColumnDropdownCellOverlay.display(columnDetails);
      this._hoveredElements.headerCell = cellElement;
    }
  }

  public static mouseLeaveCell(this: ActiveTable, columnIndex: number, event: MouseEvent) {
    if (!Dropdown.isDisplayed(this._activeOverlayElements.columnDropdown)) {
      CellHighlightUtils.fade(event.target as HTMLElement, this._columnsDetails[columnIndex].headerStateColors?.default);
      ColumnDropdownCellOverlay.hide(this, this._columnsDetails[columnIndex]);
      const openViaOverlayClick = this._defaultColumnsSettings.columnDropdown?.displaySettings?.openMethod?.overlayClick;
      if (openViaOverlayClick) delete this._hoveredElements.headerCell;
    }
    if (!this._activeOverlayElements.selectedColumnSizer) {
      ColumnSizerCellEvents.cellMouseLeave(this._columnsDetails, columnIndex);
    }
  }

  public static mouseClick(this: ActiveTable, columnIndex: number, event: MouseEvent) {
    const cellElement = event.target as HTMLElement;
    CellEvents.removeTextIfDefault(this, 0, columnIndex, cellElement);
    const openViaCellClick = this._defaultColumnsSettings.columnDropdown?.displaySettings?.openMethod?.cellClick;
    if (openViaCellClick) ColumnDropdown.display(this, columnIndex);
    setTimeout(() => FocusedCellUtils.setHeaderCell(this._focusedElements.cell, cellElement, columnIndex));
  }

  public static setEvents(at: ActiveTable, cellElement: HTMLElement, columnIndex: number) {
    cellElement.onmouseenter = HeaderCellEvents.mouseEnterCell.bind(at, columnIndex);
    cellElement.onmouseleave = HeaderCellEvents.mouseLeaveCell.bind(at, columnIndex);
    cellElement.onclick = HeaderCellEvents.mouseClick.bind(at, columnIndex);
    DragColumn.applyEventsToCell(at, cellElement);
  }
}
