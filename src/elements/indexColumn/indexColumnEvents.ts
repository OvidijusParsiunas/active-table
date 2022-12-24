import {RowDropdownCellOverlayEvents} from '../dropdown/rowDropdown/cellOverlay/rowDropdownCellOverlayEvents';
import {AuxiliaryTableContentColors} from '../../utils/auxiliaryTableContent/auxiliaryTableContentColors';
import {CellHighlightUtils} from '../../utils/color/cellHighlightUtils';
import {EditableTableComponent} from '../../editable-table-component';
import {RowDropdown} from '../dropdown/rowDropdown/rowDropdown';
import {Dropdown} from '../dropdown/dropdown';

export class IndexColumnEvents {
  private static mouseEnterCell(this: EditableTableComponent, rowIndex: number, event: MouseEvent) {
    const cellColors = AuxiliaryTableContentColors.getColorsBasedOnParam(rowIndex);
    const cellElement = event.target as HTMLElement;
    CellHighlightUtils.highlight(cellElement, cellColors.hover);
  }

  private static mouseLeaveCell(this: EditableTableComponent, rowIndex: number, event: MouseEvent) {
    if (!Dropdown.isDisplayed(this.activeOverlayElements.rowDropdown)) {
      const cellColors = AuxiliaryTableContentColors.getColorsBasedOnParam(rowIndex);
      CellHighlightUtils.fade(event.target as HTMLElement, cellColors.default);
    }
  }

  public static setEvents(etc: EditableTableComponent, cellElement: HTMLElement, rowIndex: number) {
    cellElement.onmouseenter = IndexColumnEvents.mouseEnterCell.bind(etc, rowIndex);
    cellElement.onmouseleave = IndexColumnEvents.mouseLeaveCell.bind(etc, rowIndex);
    const {displaySettings} = etc.rowDropdownSettings;
    if (displaySettings.isAvailable && displaySettings.openMethod?.cellClick) {
      cellElement.onclick = RowDropdown.display.bind(etc, rowIndex, cellElement);
    } else {
      RowDropdownCellOverlayEvents.addCellEvents(etc, rowIndex, cellElement);
    }
  }
}
