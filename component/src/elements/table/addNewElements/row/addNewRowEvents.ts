import {AuxiliaryTableContentColors} from '../../../../utils/auxiliaryTableContent/auxiliaryTableContentColors';
import {InsertNewRow} from '../../../../utils/insertRemoveStructure/insert/insertNewRow';
import {CellHighlightUtils} from '../../../../utils/color/cellHighlightUtils';
import {ActiveTable} from '../../../../activeTable';

export class AddNewRowEvents {
  private static mouseEnterCell(this: ActiveTable, event: MouseEvent) {
    CellHighlightUtils.highlight(event.target as HTMLElement, AuxiliaryTableContentColors.CELL_COLORS.data.hover);
  }

  private static mouseLeaveCell(this: ActiveTable, event: MouseEvent) {
    CellHighlightUtils.fade(event.target as HTMLElement, AuxiliaryTableContentColors.CELL_COLORS.data.default);
  }

  public static setCellEvents(at: ActiveTable, addNewRowCellElement: HTMLElement) {
    addNewRowCellElement.onclick = InsertNewRow.insertEvent.bind(at);
    addNewRowCellElement.onmouseenter = AddNewRowEvents.mouseEnterCell.bind(at);
    addNewRowCellElement.onmouseleave = AddNewRowEvents.mouseLeaveCell.bind(at);
  }
}
