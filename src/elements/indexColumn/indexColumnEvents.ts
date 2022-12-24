import {AuxiliaryTableContentColors} from '../../utils/auxiliaryTableContent/auxiliaryTableContentColors';
import {RowDropdownCellOverlay} from '../dropdown/rowDropdown/cellOverlay/rowDropdownCellOverlay';
import {CellHighlightUtils} from '../../utils/color/cellHighlightUtils';
import {EditableTableComponent} from '../../editable-table-component';
import {RowDropdown} from '../dropdown/rowDropdown/rowDropdown';
import {Dropdown} from '../dropdown/dropdown';

export class IndexColumnEvents {
  private static mouseEnterCell(this: EditableTableComponent, rowIndex: number, event: MouseEvent) {
    const cellColors = AuxiliaryTableContentColors.getColorsBasedOnParam(rowIndex);
    const cellElement = event.target as HTMLElement;
    CellHighlightUtils.highlight(cellElement, cellColors.hover);
    RowDropdownCellOverlay.display(this, rowIndex);
    this.hoveredElements.leftMostCell = cellElement;
  }

  private static mouseLeaveCell(this: EditableTableComponent, rowIndex: number, event: MouseEvent) {
    if (!Dropdown.isDisplayed(this.activeOverlayElements.rowDropdown)) {
      const cellColors = AuxiliaryTableContentColors.getColorsBasedOnParam(rowIndex);
      CellHighlightUtils.fade(event.target as HTMLElement, cellColors.default);
      RowDropdownCellOverlay.hide(this, rowIndex);
      delete this.hoveredElements.leftMostCell;
    }
  }

  public static setEvents(etc: EditableTableComponent, cellElement: HTMLElement, rowIndex: number) {
    cellElement.onmouseenter = IndexColumnEvents.mouseEnterCell.bind(etc, rowIndex);
    cellElement.onmouseleave = IndexColumnEvents.mouseLeaveCell.bind(etc, rowIndex);
    if (etc.rowDropdownSettings.isDisplayed) cellElement.onclick = RowDropdown.display.bind(etc, rowIndex, cellElement);
  }
}
