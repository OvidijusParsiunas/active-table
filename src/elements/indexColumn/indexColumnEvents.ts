import {AuxiliaryTableContent} from '../../utils/auxiliaryTableContent/auxiliaryTableContent';
import {EditableTableComponent} from '../../editable-table-component';
import {CellHighlightUtil} from '../../utils/color/cellHighlightUtil';
import {RowDropdown} from '../dropdown/rowDropdown/rowDropdown';
import {Dropdown} from '../dropdown/dropdown';

export class IndexColumnEvents {
  private static mouseEnterCell(this: EditableTableComponent, rowIndex: number, event: MouseEvent) {
    const eventColors = AuxiliaryTableContent.getCellColors(rowIndex);
    CellHighlightUtil.highlight(event.target as HTMLElement, eventColors.hoverColor);
  }

  private static mouseLeaveCell(this: EditableTableComponent, rowIndex: number, event: MouseEvent) {
    if (!Dropdown.isDisplayed(this.overlayElementsState.rowDropdown)) {
      const eventColors = AuxiliaryTableContent.getCellColors(rowIndex);
      CellHighlightUtil.fade(event.target as HTMLElement, eventColors.defaultColor);
    }
  }

  public static setEvents(etc: EditableTableComponent, cellElement: HTMLElement, rowIndex: number) {
    cellElement.onmouseenter = IndexColumnEvents.mouseEnterCell.bind(etc, rowIndex);
    cellElement.onmouseleave = IndexColumnEvents.mouseLeaveCell.bind(etc, rowIndex);
    cellElement.onclick = RowDropdown.display.bind(etc, rowIndex);
  }
}
