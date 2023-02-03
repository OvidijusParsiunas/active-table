import {RowDropdownCellOverlayEvents} from '../dropdown/rowDropdown/cellOverlay/rowDropdownCellOverlayEvents';
import {FrameComponentsColors} from '../../utils/frameComponents/frameComponentsColors';
import {CellHighlightUtils} from '../../utils/color/cellHighlightUtils';
import {RowDropdown} from '../dropdown/rowDropdown/rowDropdown';
import {ActiveTable} from '../../activeTable';
import {Dropdown} from '../dropdown/dropdown';

export class IndexColumnEvents {
  private static mouseEnterCell(this: ActiveTable, rowIndex: number, event: MouseEvent) {
    const cellElement = event.target as HTMLElement;
    const {cellColors} = this.frameComponentsInternal;
    const colors = FrameComponentsColors.getColorsBasedOnParam(cellColors, rowIndex);
    CellHighlightUtils.highlight(cellElement, colors.hover);
  }

  private static mouseLeaveCell(this: ActiveTable, rowIndex: number, event: MouseEvent) {
    if (!Dropdown.isDisplayed(this.activeOverlayElements.rowDropdown)) {
      const {cellColors} = this.frameComponentsInternal;
      const colors = FrameComponentsColors.getColorsBasedOnParam(cellColors, rowIndex);
      CellHighlightUtils.fade(event.target as HTMLElement, colors.default);
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
