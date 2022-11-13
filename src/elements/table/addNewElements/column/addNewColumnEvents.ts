import {InsertNewColumn} from '../../../../utils/insertRemoveStructure/insert/insertNewColumn';
import {EditableTableComponent} from '../../../../editable-table-component';

export class AddNewColumnEvents {
  private static readonly ADD_NEW_COLUMN_HOVER_CLASS = 'hovered-add-column-cells';

  // REF-17
  private static toggleBackground(columnGroup: HTMLElement, backgroundAction: 'highlight' | 'fade') {
    const addColumnCol = columnGroup.children[columnGroup.children.length - 1];
    const classAction = backgroundAction === 'highlight' ? 'add' : 'remove';
    addColumnCol.classList[classAction](AddNewColumnEvents.ADD_NEW_COLUMN_HOVER_CLASS);
  }

  public static setEvents(etc: EditableTableComponent, cellElement: HTMLElement): void {
    const {columnGroupRef: columnGroup} = etc;
    if (!columnGroup) return;
    cellElement.addEventListener('mouseenter', AddNewColumnEvents.toggleBackground.bind(this, columnGroup, 'highlight'));
    cellElement.addEventListener('mouseleave', AddNewColumnEvents.toggleBackground.bind(this, columnGroup, 'fade'));
    cellElement.onclick = InsertNewColumn.insertEvent.bind(etc);
  }
}
