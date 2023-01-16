import {AuxiliaryTableContentColors} from '../../../../utils/auxiliaryTableContent/auxiliaryTableContentColors';
import {InsertNewColumn} from '../../../../utils/insertRemoveStructure/insert/insertNewColumn';
import {CellStateColorsR} from '../../../../types/cellStateColors';
import {ActiveTable} from '../../../../activeTable';

export class AddNewColumnEvents {
  // REF-17
  private static setHeaderStyle(headerCell: HTMLElement, headerColors: CellStateColorsR, isHighlight: boolean) {
    const {default: defaultColors, hover: hoverColors} = headerColors;
    // set here and not on addColumnCol because toggling 'color' on that element does not change cell 'color' style
    // additionally because auxiliary elements header cells can inherit the user set header style, we must set it
    // manually anyway
    headerCell.style.color = isHighlight ? hoverColors.color : defaultColors.color;
    headerCell.style.backgroundColor = isHighlight ? hoverColors.backgroundColor : defaultColors.backgroundColor;
  }

  // REF-17
  public static toggleColor(columnGroup: HTMLElement, isHighlight: boolean, addColumnCellsElementsRef: HTMLElement[]) {
    const addColumnCol = columnGroup.children[columnGroup.children.length - 1] as HTMLElement;
    const {data, header} = AuxiliaryTableContentColors.CELL_COLORS;
    addColumnCol.style.backgroundColor = isHighlight ? data.hover.backgroundColor : data.default.backgroundColor;
    const headerCell = addColumnCellsElementsRef[0];
    if (headerCell) AddNewColumnEvents.setHeaderStyle(headerCell, header, isHighlight);
  }

  public static setEvents(at: ActiveTable, cellElement: HTMLElement): void {
    const {columnGroupRef: columnGroup, addColumnCellsElementsRef} = at;
    if (!columnGroup) return;
    cellElement.onmouseenter = AddNewColumnEvents.toggleColor.bind(this, columnGroup, true, addColumnCellsElementsRef);
    cellElement.onmouseleave = AddNewColumnEvents.toggleColor.bind(this, columnGroup, false, addColumnCellsElementsRef);
    cellElement.onclick = InsertNewColumn.insertEvent.bind(at);
  }
}
