import {SelectDropdownItem} from '../../../../dropdown/selectDropdown/selectDropdownItem';
import {CellTextElement} from '../../text/cellTextElement';
import {EMPTY_STRING} from '../../../../../consts/text';
import {ActiveTable} from '../../../../../activeTable';
import {CellElement} from '../../../cellElement';

export class SelectCellTextElement {
  private static readonly TEXT_CLASS = 'select-cell-text';

  public static setCellTextAsAnElement(at: ActiveTable, cellElement: HTMLElement, columnIndex: number) {
    const {isCellTextEditable} = at.columnsDetails[columnIndex].settings;
    const textElement = CellTextElement.setCellTextAsAnElement(cellElement, isCellTextEditable);
    textElement.classList.add(SelectCellTextElement.TEXT_CLASS);
  }

  // prettier-ignore
  public static finaliseEditedText(at: ActiveTable, textElement: HTMLElement, columnIndex: number) {
    const columnDetails = at.columnsDetails[columnIndex];
    const {selectDropdown, activeType, settings} = columnDetails;
    const text = CellElement.getText(textElement);
    const isPresent = !!selectDropdown.itemsDetails[text]?.backgroundColor;
    if (activeType.selectProps?.canAddMoreOptions && text !== EMPTY_STRING && !isPresent
        && (!settings.isDefaultTextRemovable || text !== settings.defaultText)) {
      SelectDropdownItem.addNewSelectItem(at, textElement, columnDetails, textElement.style.backgroundColor);
    }
  }
}
