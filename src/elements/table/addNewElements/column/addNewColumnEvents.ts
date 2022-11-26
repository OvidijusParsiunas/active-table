import {AuxiliaryTableContent} from '../../../../utils/auxiliaryTableContent/auxiliaryTableContent';
import {InsertNewColumn} from '../../../../utils/insertRemoveStructure/insert/insertNewColumn';
import {EditableTableComponent} from '../../../../editable-table-component';

export class AddNewColumnEvents {
  // REF-17
  public static toggleColor(columnGroup: HTMLElement, isHighlight: boolean, addColumnCellsElementsRef: HTMLElement[]) {
    const addColumnCol = columnGroup.children[columnGroup.children.length - 1] as HTMLElement;
    const {defaultColor, hoverColor} = AuxiliaryTableContent.EVENT_COLORS;
    addColumnCol.style.backgroundColor = isHighlight ? hoverColor.backgroundColor : defaultColor.backgroundColor;
    const headerCell = addColumnCellsElementsRef[0];
    // set here and not on addColumnCol because toggling 'color' on that element does not work
    if (headerCell) headerCell.style.color = isHighlight ? hoverColor.color : defaultColor.color;
  }

  public static setEvents(etc: EditableTableComponent, cellElement: HTMLElement): void {
    const {columnGroupRef: columnGroup, addColumnCellsElementsRef} = etc;
    if (!columnGroup) return;
    cellElement.onmouseenter = AddNewColumnEvents.toggleColor.bind(this, columnGroup, true, addColumnCellsElementsRef);
    cellElement.onmouseleave = AddNewColumnEvents.toggleColor.bind(this, columnGroup, false, addColumnCellsElementsRef);
    cellElement.onclick = InsertNewColumn.insertEvent.bind(etc);
  }
}
