import {EditableTableComponent} from '../../../../editable-table-component';
import {RowDropdownCellOverlay} from './rowDropdownCellOverlay';
import {RowDropdown} from '../rowDropdown';

export class RowDropdownCellOverlayEvents {
  private static mouseLeave(this: EditableTableComponent, rowIndex: number) {
    RowDropdownCellOverlay.hide(this, rowIndex);
    delete this.hoveredElements.leftMostCell;
  }

  private static mouseEnter(this: EditableTableComponent, leftMostCell: HTMLElement) {
    this.hoveredElements.leftMostCell = leftMostCell;
  }

  public static setEvents(etc: EditableTableComponent, rowIndex: number, leftMostCell: HTMLElement) {
    const rowDropdownCellOverlay = etc.activeOverlayElements.rowDropdownCellOverlays[rowIndex];
    rowDropdownCellOverlay.onmouseenter = RowDropdownCellOverlayEvents.mouseEnter.bind(etc, leftMostCell);
    rowDropdownCellOverlay.onmouseleave = RowDropdownCellOverlayEvents.mouseLeave.bind(etc, rowIndex);
    rowDropdownCellOverlay.onclick = RowDropdown.display.bind(etc, rowIndex, leftMostCell);
  }
}
