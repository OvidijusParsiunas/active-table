import {FocusedCellUtils} from '../../../../utils/focusedElements/focusedCellUtils';
import {EditableTableComponent} from '../../../../editable-table-component';
import {ColumnDropdownCellOverlay} from './columnDropdownCellOverlay';
import {ColumnDetailsT} from '../../../../types/columnDetails';
import {ColumnDropdown} from '../columnDropdown';

export class ColumnDropdownCellOverlayEvents {
  private static mouseClick(this: EditableTableComponent, columnIndex: number, columnDetails: ColumnDetailsT) {
    ColumnDropdown.display(this, columnIndex);
    const headerCellElement = columnDetails.elements[0];
    setTimeout(() => FocusedCellUtils.setHeaderCell(this.focusedElements.cell, headerCellElement, columnIndex));
  }

  // prettier-ignore
  private static mouseLeave(this: EditableTableComponent, columnDetails: ColumnDetailsT) {
    ColumnDropdownCellOverlay.hide(this, columnDetails);
    delete this.hoveredElements.headerCell;
    ColumnDropdownCellOverlay.resetDefaultColor(this.columnDropdownDisplaySettings,
      columnDetails.columnDropdownCellOverlay);
  }

  private static mouseEnter(this: EditableTableComponent, columnDetails: ColumnDetailsT) {
    const headerCellElement = columnDetails.elements[0];
    this.hoveredElements.headerCell = headerCellElement;
    ColumnDropdownCellOverlay.setHoverColor(this.columnDropdownDisplaySettings, columnDetails);
  }

  public static setEvents(etc: EditableTableComponent, columnIndex: number) {
    const columnDetails = etc.columnsDetails[columnIndex];
    const {columnDropdownCellOverlay} = columnDetails;
    columnDropdownCellOverlay.onmouseenter = ColumnDropdownCellOverlayEvents.mouseEnter.bind(etc, columnDetails);
    columnDropdownCellOverlay.onmouseleave = ColumnDropdownCellOverlayEvents.mouseLeave.bind(etc, columnDetails);
    columnDropdownCellOverlay.onclick = ColumnDropdownCellOverlayEvents.mouseClick.bind(etc, columnIndex, columnDetails);
  }
}
