import {AuxiliaryTableContentColors} from '../../../../utils/auxiliaryTableContent/auxiliaryTableContentColors';
import {InsertNewRow} from '../../../../utils/insertRemoveStructure/insert/insertNewRow';
import {CellHighlightUtils} from '../../../../utils/color/cellHighlightUtils';
import {EditableTableComponent} from '../../../../editable-table-component';

export class AddNewRowEvents {
  private static mouseEnterCell(this: EditableTableComponent, event: MouseEvent) {
    CellHighlightUtils.highlight(event.target as HTMLElement, AuxiliaryTableContentColors.CELL_COLORS.data.hover);
  }

  private static mouseLeaveCell(this: EditableTableComponent, event: MouseEvent) {
    CellHighlightUtils.fade(event.target as HTMLElement, AuxiliaryTableContentColors.CELL_COLORS.data.default);
  }

  public static setCellEvents(etc: EditableTableComponent, addNewRowCellElement: HTMLElement) {
    addNewRowCellElement.onclick = InsertNewRow.insertEvent.bind(etc);
    addNewRowCellElement.onmouseenter = AddNewRowEvents.mouseEnterCell.bind(etc);
    addNewRowCellElement.onmouseleave = AddNewRowEvents.mouseLeaveCell.bind(etc);
  }
}
