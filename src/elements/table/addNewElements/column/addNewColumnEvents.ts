import {AuxiliaryTableContent} from '../../../../utils/auxiliaryTableContent/auxiliaryTableContent';
import {InsertNewColumn} from '../../../../utils/insertRemoveStructure/insert/insertNewColumn';
import {EditableTableComponent} from '../../../../editable-table-component';

export class AddNewColumnEvents {
  // REF-17
  public static toggleBackground(columnGroup: HTMLElement, isHighlight: boolean) {
    const addColumnCol = columnGroup.children[columnGroup.children.length - 1] as HTMLElement;
    const {default: defaultColor, hover: hoverColor} = AuxiliaryTableContent.EVENT_COLORS;
    addColumnCol.style.backgroundColor = isHighlight ? hoverColor : defaultColor;
  }

  public static setEvents(etc: EditableTableComponent, cellElement: HTMLElement): void {
    const {columnGroupRef: columnGroup} = etc;
    if (!columnGroup) return;
    cellElement.onmouseenter = AddNewColumnEvents.toggleBackground.bind(this, columnGroup, true);
    cellElement.onmouseleave = AddNewColumnEvents.toggleBackground.bind(this, columnGroup, false);
    cellElement.onclick = InsertNewColumn.insertEvent.bind(etc);
  }
}
