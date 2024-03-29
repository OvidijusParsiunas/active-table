import {CellDropdownItem} from '../../../../dropdown/cellDropdown/cellDropdownItem';
import {CellTextElement} from '../../text/cellTextElement';
import {EMPTY_STRING} from '../../../../../consts/text';
import {ActiveTable} from '../../../../../activeTable';
import {CellElement} from '../../../cellElement';

export class LabelCellTextElement {
  private static readonly TEXT_CLASS = 'label-cell-text';

  public static isLabelText(element: HTMLElement) {
    return element.classList.contains(LabelCellTextElement.TEXT_CLASS);
  }

  public static setCellTextAsAnElement(cellElement: HTMLElement, backgroundColor: string, isCellTextEditable: boolean) {
    const textElement = CellTextElement.setCellTextAsAnElement(cellElement, isCellTextEditable);
    textElement.classList.add(LabelCellTextElement.TEXT_CLASS);
    textElement.style.backgroundColor = backgroundColor;
  }

  // prettier-ignore
  public static finaliseEditedText(at: ActiveTable, textElement: HTMLElement, columnIndex: number,
      processMatching = false) {
    const columnDetails = at._columnsDetails[columnIndex];
    const {cellDropdown, activeType: {cellDropdownProps}, settings: {defaultText, isDefaultTextRemovable}} = columnDetails;
    const color = cellDropdown.itemsDetails[CellElement.getText(textElement)]?.backgroundColor;
    if (CellElement.getText(textElement) === EMPTY_STRING
        || (isDefaultTextRemovable && CellElement.getText(textElement) === defaultText)) {
      textElement.style.backgroundColor = '';
    } else if (processMatching && color) {
      textElement.style.backgroundColor = color;
      // not using staticItems state as this method may be called before it is available, if not, then refactor
    } else if (cellDropdownProps?.canAddMoreOptions) {
      // if a label is deleted and then added with an already existing text element, use its current background
      CellDropdownItem.addNewItem(at, textElement, columnDetails, textElement.style.backgroundColor);
    }
  }
}
