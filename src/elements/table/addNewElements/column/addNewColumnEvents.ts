import {AuxiliaryTableContent} from '../../../../utils/auxiliaryTableContent/auxiliaryTableContent';
import {InsertNewColumn} from '../../../../utils/insertRemoveStructure/insert/insertNewColumn';
import {AuxiliaryContentCellColors} from '../../../../types/auxiliaryTableContentCellsColors';
import {EditableTableComponent} from '../../../../editable-table-component';

export class AddNewColumnEvents {
  // REF-17
  private static setHeaderStyle(headerCell: HTMLElement, colors: AuxiliaryContentCellColors, isHighlight: boolean) {
    const {hoverColor, defaultColor} = colors;
    // set here and not on addColumnCol because toggling 'color' on that element does not change cell 'color' style
    // additionally because auxiliary elements header cells can inherit the user set header style, we must set it
    // manually anyway
    headerCell.style.color = isHighlight ? hoverColor.color : defaultColor.color;
    headerCell.style.backgroundColor = isHighlight ? hoverColor.backgroundColor : defaultColor.backgroundColor;
  }

  // REF-17
  public static toggleColor(columnGroup: HTMLElement, isHighlight: boolean, addColumnCellsElementsRef: HTMLElement[]) {
    const addColumnCol = columnGroup.children[columnGroup.children.length - 1] as HTMLElement;
    const {data, header} = AuxiliaryTableContent.EVENT_COLORS;
    addColumnCol.style.backgroundColor = isHighlight ? data.hoverColor.backgroundColor : data.defaultColor.backgroundColor;
    const headerCell = addColumnCellsElementsRef[0];
    if (headerCell) AddNewColumnEvents.setHeaderStyle(headerCell, header, isHighlight);
  }

  public static setEvents(etc: EditableTableComponent, cellElement: HTMLElement): void {
    const {columnGroupRef: columnGroup, addColumnCellsElementsRef} = etc;
    if (!columnGroup) return;
    cellElement.onmouseenter = AddNewColumnEvents.toggleColor.bind(this, columnGroup, true, addColumnCellsElementsRef);
    cellElement.onmouseleave = AddNewColumnEvents.toggleColor.bind(this, columnGroup, false, addColumnCellsElementsRef);
    cellElement.onclick = InsertNewColumn.insertEvent.bind(etc);
  }
}
