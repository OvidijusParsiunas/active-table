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

  private static mouseLeave(this: EditableTableComponent, columnDetails: ColumnDetailsT) {
    ColumnDropdownCellOverlay.hide(this, columnDetails);
    delete this.hoveredElements.headerCell;
  }

  private static mouseEnter(this: EditableTableComponent, columnDetails: ColumnDetailsT) {
    const headerCellElement = columnDetails.elements[0];
    this.hoveredElements.headerCell = headerCellElement;
  }

  public static setEvents(etc: EditableTableComponent, columnIndex: number, overlayElement: HTMLElement) {
    const columnDetails = etc.columnsDetails[columnIndex];
    overlayElement.onmouseenter = ColumnDropdownCellOverlayEvents.mouseEnter.bind(etc, columnDetails);
    overlayElement.onmouseleave = ColumnDropdownCellOverlayEvents.mouseLeave.bind(etc, columnDetails);
    overlayElement.onclick = ColumnDropdownCellOverlayEvents.mouseClick.bind(etc, columnIndex, columnDetails);
  }
}
