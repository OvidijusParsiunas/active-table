import {InsertNewRow} from '../../../../utils/insertRemoveStructure/insert/insertNewRow';
import {EditableTableComponent} from '../../../../editable-table-component';
import {CellHighlightUtil} from '../../../../utils/color/cellHighlightUtil';
import {TableElement} from '../../tableElement';

export class AddNewRowEvents {
  private static mouseEnterCell(this: EditableTableComponent, event: MouseEvent) {
    CellHighlightUtil.highlight(event.target as HTMLElement, TableElement.AUXILIARY_CONTENT_EVENT_COLORS.hover);
  }

  private static mouseLeaveCell(this: EditableTableComponent, event: MouseEvent) {
    CellHighlightUtil.fade(event.target as HTMLElement, TableElement.AUXILIARY_CONTENT_EVENT_COLORS.default);
  }

  public static setEvents(etc: EditableTableComponent, addNewRowRowElement: HTMLElement) {
    addNewRowRowElement.onclick = InsertNewRow.insertEvent.bind(etc);
    addNewRowRowElement.onmouseenter = AddNewRowEvents.mouseEnterCell.bind(etc);
    addNewRowRowElement.onmouseleave = AddNewRowEvents.mouseLeaveCell.bind(etc);
  }
}
