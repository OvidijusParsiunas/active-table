import {SelectDropdownItem} from '../../../../dropdown/selectDropdown/selectDropdownItem';
import {EditableTableComponent} from '../../../../../editable-table-component';
import {CellTextElement} from '../../text/cellTextElement';
import {EMPTY_STRING} from '../../../../../consts/text';
import {CellElement} from '../../../cellElement';

export class SelectCellTextElement {
  private static readonly TEXT_CLASS = 'select-cell-text';

  public static setCellTextAsAnElement(etc: EditableTableComponent, cellElement: HTMLElement, columnIndex: number) {
    const {isCellTextEditable} = etc.columnsDetails[columnIndex].settings;
    const textElement = CellTextElement.setCellTextAsAnElement(cellElement, isCellTextEditable);
    textElement.classList.add(SelectCellTextElement.TEXT_CLASS);
  }

  // prettier-ignore
  public static finaliseEditedText(etc: EditableTableComponent, textElement: HTMLElement, columnIndex: number) {
    const {selectDropdown, activeType, settings} = etc.columnsDetails[columnIndex];
    const text = CellElement.getText(textElement);
    const isPresent = !!selectDropdown.selectItem[text]?.color;
    if (activeType.selectProps?.canAddMoreOptions && text !== EMPTY_STRING && !isPresent
        && (!settings.isDefaultTextRemovable || text !== settings.defaultText)) {
      SelectDropdownItem.addNewSelectItem(etc, textElement, selectDropdown, textElement.style.backgroundColor);
    }
  }
}
