import {EditableTableComponent} from '../../../../editable-table-component';
import {RowDropdownCellOverlay} from './rowDropdownCellOverlay';
import {RowDropdown} from '../rowDropdown';

export class RowDropdownCellOverlayEvents {
  private static mouseLeave(this: EditableTableComponent, rowIndex: number, rowDropdownCellOverlay: HTMLElement) {
    RowDropdownCellOverlay.hide(this, rowIndex);
    delete this.hoveredElements.leftMostCell;
    RowDropdownCellOverlay.resetDefaultColor(this.rowDropdownSettings.displaySettings, rowDropdownCellOverlay);
  }

  private static mouseEnter(this: EditableTableComponent, leftMostCell: HTMLElement, rowDropdownCellOverlay: HTMLElement) {
    this.hoveredElements.leftMostCell = leftMostCell;
    RowDropdownCellOverlay.setHoverColor(this.rowDropdownSettings.displaySettings, rowDropdownCellOverlay);
  }

  // prettier-ignore
  public static setOverlayEvents(etc: EditableTableComponent, rowIndex: number, leftMostCell: HTMLElement) {
    const rowDropdownCellOverlay = etc.rowDropdownCellOverlays[rowIndex].element;
    rowDropdownCellOverlay.onmouseenter = RowDropdownCellOverlayEvents.mouseEnter.bind(
      etc, leftMostCell, rowDropdownCellOverlay);
    rowDropdownCellOverlay.onmouseleave = RowDropdownCellOverlayEvents.mouseLeave.bind(
      etc, rowIndex, rowDropdownCellOverlay);
    rowDropdownCellOverlay.onclick = RowDropdown.display.bind(etc, rowIndex, leftMostCell);
  }

  private static cellMouseLeave(this: EditableTableComponent, rowIndex: number) {
    RowDropdownCellOverlay.hide(this, rowIndex);
    delete this.hoveredElements.leftMostCell;
  }

  private static cellMouseEnter(this: EditableTableComponent, rowIndex: number, leftMostCell: HTMLElement) {
    RowDropdownCellOverlay.display(this, rowIndex);
    this.hoveredElements.leftMostCell = leftMostCell;
  }

  // This method is adding more events to existing cells instead of overwriting them, the reason for using this approach is
  // because we would instead need to add logic inside data cell events, select events, header events and more as
  // row dropdown overlay can appear above them if index column is not displayed
  // Interestingly using setting events like .onmousenter does not overwrite the events that have been added via
  // addEventListener, hence they need to be removed here before adding again
  public static addCellEvents(etc: EditableTableComponent, rowIndex: number, leftMostCell: HTMLElement) {
    const {displaySettings, isHeaderRowEditable} = etc.rowDropdownSettings;
    if (!displaySettings.isAvailable || (!isHeaderRowEditable && rowIndex === 0)) return;
    const overlayProperties = etc.rowDropdownCellOverlays[rowIndex];
    if (overlayProperties?.cellElement) {
      const {cellElement, enter, leave} = overlayProperties;
      // need to use the element that has been added with the events as upon inserting a new row etc, the new row index
      // does not adhere to the original element that was initially binded with the corresponding current index events
      cellElement.removeEventListener('mouseenter', enter);
      cellElement.removeEventListener('mouseleave', leave);
    }
    overlayProperties.cellElement = leftMostCell;
    overlayProperties.enter = RowDropdownCellOverlayEvents.cellMouseEnter.bind(etc, rowIndex, leftMostCell);
    overlayProperties.leave = RowDropdownCellOverlayEvents.cellMouseLeave.bind(etc, rowIndex);
    leftMostCell.addEventListener('mouseenter', overlayProperties.enter);
    leftMostCell.addEventListener('mouseleave', overlayProperties.leave);
  }
}
