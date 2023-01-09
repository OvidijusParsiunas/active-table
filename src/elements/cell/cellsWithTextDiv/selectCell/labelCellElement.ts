import {SelectDropdownItem} from '../../../dropdown/selectDropdown/selectDropdownItem';
import {CellStructureUtils} from '../../../../utils/columnType/cellStructureUtils';
import {EditableTableComponent} from '../../../../editable-table-component';
import {CellTextElement} from '../text/cellTextElement';
import {EMPTY_STRING} from '../../../../consts/text';
import {SelectCellEvents} from './selectCellEvents';
import {CellElement} from '../../cellElement';

// the logic for cell and text divs is handled here
export class LabelCellElement {
  private static readonly LABEL_TEXT_DIV_CLASS = 'label-text-div';

  public static isLabelText(element: HTMLElement) {
    return element.classList.contains(LabelCellElement.LABEL_TEXT_DIV_CLASS);
  }

  private static setCellTextAsAnElement(cellElement: HTMLElement, backgroundColor: string, isCellTextEditable: boolean) {
    const textElement = CellTextElement.setCellTextAsAnElement(cellElement, isCellTextEditable);
    textElement.classList.add(LabelCellElement.LABEL_TEXT_DIV_CLASS);
    textElement.style.backgroundColor = backgroundColor;
  }

  // prettier-ignore
  public static setCellLabelStructure(etc: EditableTableComponent,
      cellElement: HTMLElement, rowIndex: number, columnIndex: number) {
    const {selectDropdown: {selectItem}, settings: {isCellTextEditable}} = etc.columnsDetails[columnIndex];
    const backgroundColor = selectItem[CellElement.getText(cellElement)]?.color || '';
    LabelCellElement.setCellTextAsAnElement(cellElement, backgroundColor, isCellTextEditable as boolean);
    SelectCellEvents.setEvents(etc, cellElement, rowIndex, columnIndex);
  }

  public static setColumnLabelStructure(etc: EditableTableComponent, columnIndex: number) {
    CellStructureUtils.setColumn(etc, columnIndex, LabelCellElement.setCellLabelStructure);
  }

  // prettier-ignore
  public static finaliseEditedText(etc: EditableTableComponent, textElement: HTMLElement, columnIndex: number,
      processMatching = false) {
    const {selectDropdown,
      activeType: {select}, settings: {defaultText, isDefaultTextRemovable}} = etc.columnsDetails[columnIndex];
    const color = selectDropdown.selectItem[CellElement.getText(textElement)]?.color;
    if (CellElement.getText(textElement) === EMPTY_STRING
        || (isDefaultTextRemovable && CellElement.getText(textElement) === defaultText)) {
      textElement.style.backgroundColor = '';
    } else if (processMatching && color) {
      textElement.style.backgroundColor = color;
       // not using staticItems state as this method may be called before it is available, if not, then refactor
    } else if (!select?.options) {
      // if a label is deleted and then added with an already existing text element, use its current background
      SelectDropdownItem.addNewSelectItem(etc, textElement, selectDropdown, textElement.style.backgroundColor);
    }
  }
}
