import {RowDropdownCellOverlayEvents} from '../dropdown/rowDropdown/cellOverlay/rowDropdownCellOverlayEvents';
import {AuxiliaryTableContentColors} from '../../utils/auxiliaryTableContent/auxiliaryTableContentColors';
import {CellHighlightUtils} from '../../utils/color/cellHighlightUtils';
import {RowDropdown} from '../dropdown/rowDropdown/rowDropdown';
import {ActiveTable} from '../../activeTable';
import {Dropdown} from '../dropdown/dropdown';

export class IndexColumnEvents {
  private static mouseEnterCell(this: ActiveTable, rowIndex: number, event: MouseEvent) {
    const cellColors = AuxiliaryTableContentColors.getColorsBasedOnParam(rowIndex);
    const cellElement = event.target as HTMLElement;
    CellHighlightUtils.highlight(cellElement, cellColors.hover);
  }

  private static mouseLeaveCell(this: ActiveTable, rowIndex: number, event: MouseEvent) {
    if (!Dropdown.isDisplayed(this.activeOverlayElements.rowDropdown)) {
      const cellColors = AuxiliaryTableContentColors.getColorsBasedOnParam(rowIndex);
      CellHighlightUtils.fade(event.target as HTMLElement, cellColors.default);
    }
  }

  public static setEvents(at: ActiveTable, cellElement: HTMLElement, rowIndex: number) {
    cellElement.onmouseenter = IndexColumnEvents.mouseEnterCell.bind(at, rowIndex);
    cellElement.onmouseleave = IndexColumnEvents.mouseLeaveCell.bind(at, rowIndex);
    const {displaySettings, canEditHeaderRow} = at.rowDropdown;
    if (!canEditHeaderRow && rowIndex === 0) return;
    if (displaySettings.isAvailable && displaySettings.openMethod?.cellClick) {
      cellElement.onclick = RowDropdown.display.bind(at, rowIndex, cellElement);
    } else {
      RowDropdownCellOverlayEvents.addCellEvents(at, rowIndex, cellElement);
    }
  }
}
