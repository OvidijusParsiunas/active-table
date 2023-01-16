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
    const {selectDropdown: {selectItems}, settings: {isCellTextEditable}} = at.columnsDetails[columnIndex];
    const backgroundColor = selectItems[CellElement.getText(cellElement)]?.color || '';
    LabelCellTextElement.setCellTextAsAnElement(cellElement, backgroundColor, isCellTextEditable as boolean);
    SelectCell.setPointerCursorIfCantAdd(cellElement, at.columnsDetails[columnIndex].activeType)
  }

  public static setColumnLabelStructure(at: ActiveTable, columnIndex: number) {
    CellStructureUtils.setColumn(at, columnIndex, LabelCellElement.setCellLabelStructure, LabelCellEvents.setEvents);
  }
}
