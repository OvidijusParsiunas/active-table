import {CellDropdownItem} from '../../../../dropdown/cellDropdown/cellDropdownItem';
import {CellTextElement} from '../../text/cellTextElement';
import {EMPTY_STRING} from '../../../../../consts/text';
import {ActiveTable} from '../../../../../activeTable';
import {CellElement} from '../../../cellElement';

export class SelectCellTextElement {
  private static readonly TEXT_CLASS = 'select-cell-text';

  public static setCellTextAsAnElement(at: ActiveTable, cellElement: HTMLElement, columnIndex: number) {
    const {isCellTextEditable} = at._columnsDetails[columnIndex].settings;
    const textElement = CellTextElement.setCellTextAsAnElement(cellElement, isCellTextEditable);
    textElement.classList.add(SelectCellTextElement.TEXT_CLASS);
  }

  // prettier-ignore
  public static finaliseEditedText(at: ActiveTable, textElement: HTMLElement, columnIndex: number) {
    const columnDetails = at._columnsDetails[columnIndex];
    const {cellDropdown, activeType, settings} = columnDetails;
    const text = CellElement.getText(textElement);
    const isPresent = !!cellDropdown.itemsDetails[text]?.backgroundColor;
    if (activeType.cellDropdownProps?.canAddMoreOptions && text !== EMPTY_STRING && !isPresent
        && (!settings.isDefaultTextRemovable || text !== settings.defaultText)) {
      CellDropdownItem.addNewItem(at, textElement, columnDetails, textElement.style.backgroundColor);
    }
  }
}
