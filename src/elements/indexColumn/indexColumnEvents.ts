import {AuxiliaryTableContentColors} from '../../utils/auxiliaryTableContent/auxiliaryTableContentColors';
import {CellHighlightUtils} from '../../utils/color/cellHighlightUtils';
import {EditableTableComponent} from '../../editable-table-component';
import {RowDropdown} from '../dropdown/rowDropdown/rowDropdown';
import {Dropdown} from '../dropdown/dropdown';

export class IndexColumnEvents {
  private static mouseEnterCell(this: EditableTableComponent, rowIndex: number, event: MouseEvent) {
    const cellColors = AuxiliaryTableContentColors.getColorsBasedOnParam(rowIndex);
    CellHighlightUtils.highlight(event.target as HTMLElement, cellColors.hover);
  }

  private static mouseLeaveCell(this: EditableTableComponent, rowIndex: number, event: MouseEvent) {
    if (!Dropdown.isDisplayed(this.overlayElementsState.rowDropdown)) {
      const cellColors = AuxiliaryTableContentColors.getColorsBasedOnParam(rowIndex);
      CellHighlightUtils.fade(event.target as HTMLElement, cellColors.hover);
    }
  }

  public static setEvents(etc: EditableTableComponent, cellElement: HTMLElement, rowIndex: number) {
    cellElement.onmouseenter = IndexColumnEvents.mouseEnterCell.bind(etc, rowIndex);
    cellElement.onmouseleave = IndexColumnEvents.mouseLeaveCell.bind(etc, rowIndex);
    cellElement.onclick = RowDropdown.display.bind(etc, rowIndex);
  }
}
