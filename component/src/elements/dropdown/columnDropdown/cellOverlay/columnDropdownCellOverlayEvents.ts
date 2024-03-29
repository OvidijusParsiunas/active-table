import {FocusedCellUtils} from '../../../../utils/focusedElements/focusedCellUtils';
import {ColumnDropdownCellOverlay} from './columnDropdownCellOverlay';
import {ColumnDetailsT} from '../../../../types/columnDetails';
import {ActiveTable} from '../../../../activeTable';
import {ColumnDropdown} from '../columnDropdown';

export class ColumnDropdownCellOverlayEvents {
  private static mouseClick(this: ActiveTable, columnIndex: number, columnDetails: ColumnDetailsT) {
    ColumnDropdown.display(this, columnIndex);
    const headerCellElement = columnDetails.elements[0];
    setTimeout(() => FocusedCellUtils.setHeaderCell(this._focusedElements.cell, headerCellElement, columnIndex));
  }

  // prettier-ignore
  private static mouseLeave(this: ActiveTable, columnDetails: ColumnDetailsT) {
    ColumnDropdownCellOverlay.hide(this, columnDetails);
    delete this._hoveredElements.headerCell;
    ColumnDropdownCellOverlay.resetDefaultColor(
      columnDetails.columnDropdownCellOverlay, this._defaultColumnsSettings.columnDropdown?.displaySettings);
  }

  private static mouseEnter(this: ActiveTable, columnDetails: ColumnDetailsT) {
    const headerCellElement = columnDetails.elements[0];
    this._hoveredElements.headerCell = headerCellElement;
    ColumnDropdownCellOverlay.setHoverColor(columnDetails, this._defaultColumnsSettings.columnDropdown?.displaySettings);
  }

  public static setEvents(at: ActiveTable, columnIndex: number) {
    const columnDetails = at._columnsDetails[columnIndex];
    const {columnDropdownCellOverlay} = columnDetails;
    if (!columnDropdownCellOverlay) return; // can occur if pasting multiple headers and creating multiple columns
    columnDropdownCellOverlay.onmouseenter = ColumnDropdownCellOverlayEvents.mouseEnter.bind(at, columnDetails);
    columnDropdownCellOverlay.onmouseleave = ColumnDropdownCellOverlayEvents.mouseLeave.bind(at, columnDetails);
    columnDropdownCellOverlay.onclick = ColumnDropdownCellOverlayEvents.mouseClick.bind(at, columnIndex, columnDetails);
  }
}
