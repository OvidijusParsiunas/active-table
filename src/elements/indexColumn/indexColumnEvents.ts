import {AuxiliaryTableContent} from '../../utils/auxiliaryTableContent/auxiliaryTableContent';
import {EditableTableComponent} from '../../editable-table-component';
import {CellHighlightUtil} from '../../utils/color/cellHighlightUtil';
import {RowDropdown} from '../dropdown/rowDropdown/rowDropdown';
import {Dropdown} from '../dropdown/dropdown';

export class IndexColumnEvents {
  private static mouseEnterCell(this: EditableTableComponent, event: MouseEvent) {
    CellHighlightUtil.highlight(event.target as HTMLElement, AuxiliaryTableContent.EVENT_COLORS.hoverColor);
  }

  private static mouseLeaveCell(this: EditableTableComponent, event: MouseEvent) {
    if (!Dropdown.isDisplayed(this.overlayElementsState.rowDropdown)) {
      CellHighlightUtil.fade(event.target as HTMLElement, AuxiliaryTableContent.EVENT_COLORS.defaultColor);
    }
  }

  public static setEvents(etc: EditableTableComponent, cellElement: HTMLElement, rowIndex: number) {
    cellElement.onmouseenter = IndexColumnEvents.mouseEnterCell.bind(etc);
    cellElement.onmouseleave = IndexColumnEvents.mouseLeaveCell.bind(etc);
    cellElement.onclick = RowDropdown.display.bind(etc, rowIndex);
  }
}
