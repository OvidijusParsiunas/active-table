import {InsertNewRow} from '../../../../utils/insertRemoveStructure/insert/insertNewRow';
import {CellHighlightUtils} from '../../../../utils/color/cellHighlightUtils';
import {CellStateColorsR} from '../../../../types/cellStateColors';
import {ActiveTable} from '../../../../activeTable';

export class AddNewRowEvents {
  private static mouseEnterCell(dataColors: CellStateColorsR, event: MouseEvent) {
    CellHighlightUtils.highlight(event.target as HTMLElement, dataColors.hover);
  }

  private static mouseLeaveCell(dataColors: CellStateColorsR, event: MouseEvent) {
    CellHighlightUtils.fade(event.target as HTMLElement, dataColors.default);
  }

  public static setCellEvents(at: ActiveTable, addNewRowCellElement: HTMLElement) {
    addNewRowCellElement.onclick = InsertNewRow.insertEvent.bind(at);
    const dataColors = at._frameComponents.cellColors.data;
    addNewRowCellElement.onmouseenter = AddNewRowEvents.mouseEnterCell.bind(this, dataColors);
    addNewRowCellElement.onmouseleave = AddNewRowEvents.mouseLeaveCell.bind(this, dataColors);
  }
}
