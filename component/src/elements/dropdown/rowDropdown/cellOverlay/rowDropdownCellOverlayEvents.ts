import {RowDropdownCellOverlay} from './rowDropdownCellOverlay';
import {ActiveTable} from '../../../../activeTable';
import {RowDropdown} from '../rowDropdown';

export class RowDropdownCellOverlayEvents {
  private static mouseLeave(this: ActiveTable, rowIndex: number, rowDropdownCellOverlay: HTMLElement) {
    RowDropdownCellOverlay.hide(this, rowIndex);
    delete this._hoveredElements.leftMostCell;
    RowDropdownCellOverlay.resetDefaultColor(this.rowDropdown.displaySettings, rowDropdownCellOverlay);
  }

  private static mouseEnter(this: ActiveTable, leftMostCell: HTMLElement, rowDropdownCellOverlay: HTMLElement) {
    this._hoveredElements.leftMostCell = leftMostCell;
    RowDropdownCellOverlay.setHoverColor(this.rowDropdown.displaySettings, rowDropdownCellOverlay);
  }

  // prettier-ignore
  public static setOverlayEvents(at: ActiveTable, rowIndex: number, leftMostCell: HTMLElement) {
    const rowDropdownCellOverlay = at._rowDropdownCellOverlays[rowIndex].element;
    rowDropdownCellOverlay.onmouseenter = RowDropdownCellOverlayEvents.mouseEnter.bind(
      at, leftMostCell, rowDropdownCellOverlay);
    rowDropdownCellOverlay.onmouseleave = RowDropdownCellOverlayEvents.mouseLeave.bind(
      at, rowIndex, rowDropdownCellOverlay);
    rowDropdownCellOverlay.onclick = RowDropdown.display.bind(at, rowIndex, leftMostCell);
    return rowDropdownCellOverlay;
  }

  private static cellMouseLeave(this: ActiveTable, rowIndex: number) {
    RowDropdownCellOverlay.hide(this, rowIndex);
    delete this._hoveredElements.leftMostCell;
  }

  private static cellMouseEnter(this: ActiveTable, rowIndex: number, leftMostCell: HTMLElement) {
    RowDropdownCellOverlay.display(this, rowIndex);
    this._hoveredElements.leftMostCell = leftMostCell;
  }

  // This method is adding more events to existing cells instead of overwriting them, the reason for using this approach is
  // because we would instead need to add logic inside data cell events, select/label events, header events and more as
  // row dropdown overlay can appear above them if index column is not displayed
  // Interestingly using setting events like .onmousenter does not overwrite the events that have been added via
  // addEventListener, hence they need to be removed here before adding again
  public static addCellEvents(at: ActiveTable, rowIndex: number, leftMostCell: HTMLElement) {
    const {displaySettings, canEditHeaderRow} = at.rowDropdown;
    if (!displaySettings.isAvailable || (!canEditHeaderRow && rowIndex === 0)) return;
    const overlayProperties = at._rowDropdownCellOverlays[rowIndex];
    if (overlayProperties?.cellElement) {
      const {cellElement, enter, leave} = overlayProperties;
      // need to use the element that has been added with the events as upon inserting a new row at, the new row index
      // does not adhere to the original element that was initially binded with the corresponding current index events
      cellElement.removeEventListener('mouseenter', enter);
      cellElement.removeEventListener('mouseleave', leave);
    }
    overlayProperties.cellElement = leftMostCell;
    overlayProperties.enter = RowDropdownCellOverlayEvents.cellMouseEnter.bind(at, rowIndex, leftMostCell);
    overlayProperties.leave = RowDropdownCellOverlayEvents.cellMouseLeave.bind(at, rowIndex);
    leftMostCell.addEventListener('mouseenter', overlayProperties.enter);
    leftMostCell.addEventListener('mouseleave', overlayProperties.leave);
  }
}
