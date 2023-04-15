import {InsertNewColumn} from '../../../../utils/insertRemoveStructure/insert/insertNewColumn';
import {FrameComponentsCellsColors} from '../../../../types/frameComponentsCellsColors';
import {CellStateColorsR} from '../../../../types/cellStateColors';
import {ActiveTable} from '../../../../activeTable';

export class AddNewColumnEvents {
  private static readonly NUMBER_OF_HIGHLIGHT_CHUNKS = 3;

  private static setHeaderCellStyle(headerCell: HTMLElement, headerColors: CellStateColorsR, isHighlight: boolean) {
    const {default: defaultColors, hover: hoverColors} = headerColors;
    // set here and not on addColumnCol because toggling 'color' on that element does not change cell 'color' style
    // additionally because frame elements header cells can inherit the user set header style, we must set it
    // manually anyway
    headerCell.style.color = isHighlight ? hoverColors.color : defaultColors.color;
    headerCell.style.backgroundColor = isHighlight ? hoverColors.backgroundColor : defaultColors.backgroundColor;
  }

  private static setDataCellStyle(elements: HTMLElement[], backgroundColor: string) {
    // executed asynchronously
    setTimeout(() => {
      elements.forEach((element) => {
        element.style.backgroundColor = backgroundColor;
      });
    });
  }

  // prettier-ignore
  private static setDataCellsStyle(isHighlight: boolean, addColumnCellsElementsRef: HTMLElement[],
      data: CellStateColorsR) {
    const backgroundColor = isHighlight ? data.hover.backgroundColor : data.default.backgroundColor;
    const dataArray = addColumnCellsElementsRef.slice(1);
    const chunkSize = Math.ceil(dataArray.length / AddNewColumnEvents.NUMBER_OF_HIGHLIGHT_CHUNKS);
    // The reason why we are not using web workers is because they only accept serializable arguments and not dom elements
    for (let i = 0; i < dataArray.length; i += chunkSize) {
      const chunk = dataArray.slice(i, i + chunkSize);
      AddNewColumnEvents.setDataCellStyle(chunk, backgroundColor);
    }
  }

  // prettier-ignore
  public static toggleColor(isHighlight: boolean, addColumnCellsElementsRef: HTMLElement[],
      cellColors: FrameComponentsCellsColors) {
    const {data, header} = cellColors;
    const headerCell = addColumnCellsElementsRef[0];
    if (headerCell) AddNewColumnEvents.setHeaderCellStyle(headerCell, header, isHighlight);
    if (addColumnCellsElementsRef.length > 1) {
      AddNewColumnEvents.setDataCellsStyle(isHighlight, addColumnCellsElementsRef, data);
    }
  }

  // prettier-ignore
  public static setEvents(at: ActiveTable, cellElement: HTMLElement): void {
    const {_addColumnCellsElementsRef: ref, _frameComponents: {cellColors}} = at;
    cellElement.onmouseenter = AddNewColumnEvents.toggleColor.bind(this, true, ref, cellColors);
    cellElement.onmouseleave = AddNewColumnEvents.toggleColor.bind(this, false, ref, cellColors);
    cellElement.onclick = InsertNewColumn.insertEvent.bind(at);
  }
}
