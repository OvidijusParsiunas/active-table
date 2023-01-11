import {SelectDropdownItem} from '../../../../dropdown/selectDropdown/selectDropdownItem';
import {EditableTableComponent} from '../../../../../editable-table-component';
import {CellTextElement} from '../../text/cellTextElement';

export class SelectCellTextElement {
  private static readonly TEXT_CLASS = 'select-cell-text';

  public static setCellTextAsAnElement(etc: EditableTableComponent, cellElement: HTMLElement, columnIndex: number) {
    const {isCellTextEditable} = etc.columnsDetails[columnIndex].settings;
    const textElement = CellTextElement.setCellTextAsAnElement(cellElement, isCellTextEditable);
    textElement.classList.add(SelectCellTextElement.TEXT_CLASS);
  }

  public static finaliseEditedText(etc: EditableTableComponent, textElement: HTMLElement, columnIndex: number) {
    const {selectDropdown, activeType} = etc.columnsDetails[columnIndex];
    if (activeType.selectProps?.canAddMoreOptions) {
      SelectDropdownItem.addNewSelectItem(etc, textElement, selectDropdown, textElement.style.backgroundColor);
    }
  }
}
