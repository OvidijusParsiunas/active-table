import {ConvertCellTypeUtils} from '../../../../../utils/columnType/convertCellTypeUtils';
import {CellStructureUtils} from '../../../../../utils/columnType/cellStructureUtils';
import {LabelCellTextElement} from './labelCellTextElement';
import {ActiveTable} from '../../../../../activeTable';
import {LabelCellEvents} from './labelCellEvents';
import {CellElement} from '../../../cellElement';
import {SelectCell} from '../selectCell';

export class LabelCellElement {
  // prettier-ignore
  public static setCellLabelStructure(at: ActiveTable, cellElement: HTMLElement, columnIndex: number) {
    ConvertCellTypeUtils.preprocessCell(cellElement);
    const {cellDropdown: {itemsDetails}, settings: {isCellTextEditable}} = at._columnsDetails[columnIndex];
    const backgroundColor = itemsDetails[CellElement.getText(cellElement)]?.backgroundColor || '';
    LabelCellTextElement.setCellTextAsAnElement(cellElement, backgroundColor, isCellTextEditable as boolean);
    SelectCell.setPointerCursorIfCantAdd(cellElement, at._columnsDetails[columnIndex].activeType)
  }

  public static setColumnLabelStructure(at: ActiveTable, columnIndex: number) {
    CellStructureUtils.setColumn(at, columnIndex, LabelCellElement.setCellLabelStructure, LabelCellEvents.setEvents);
  }
}
