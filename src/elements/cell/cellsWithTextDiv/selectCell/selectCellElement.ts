import {CategoryDropdownItem} from '../../../dropdown/categoryDropdown/categoryDropdownItem';
import {CellStructureUtils} from '../../../../utils/columnType/cellStructureUtils';
import {EditableTableComponent} from '../../../../editable-table-component';
import {CellTextElement} from '../text/cellTextElement';
import {SelectCellEvents} from './selectCellEvents';

// the logic for cell and text divs is handled here
export class SelectCellElement {
  // the reason for using a text div instead of just adding text to the cell element is incase
  // an icon will be added to the cell to support the dropdown experience (however if using cell
  // in the future, please take note there will be a need for some refactoring as some of
  // the dropdown logic is using text divs)
  // prettier-ignore
  public static setCellSelectStructure(etc: EditableTableComponent,
      cellElement: HTMLElement, rowIndex: number, columnIndex: number) {
    const {isCellTextEditable} = etc.columnsDetails[columnIndex].settings
    CellTextElement.setCellTextAsAnElement(cellElement, isCellTextEditable);
    SelectCellEvents.setEvents(etc, cellElement, rowIndex, columnIndex);
  }

  public static setColumnSelectStructure(etc: EditableTableComponent, columnIndex: number) {
    CellStructureUtils.setColumn(etc, columnIndex, SelectCellElement.setCellSelectStructure);
  }

  public static finaliseEditedText(etc: EditableTableComponent, textElement: HTMLElement, columnIndex: number) {
    const {categoryDropdown, activeType} = etc.columnsDetails[columnIndex];
    if (!activeType.categories?.options) {
      CategoryDropdownItem.addNewCategory(etc, textElement, categoryDropdown, textElement.style.backgroundColor);
    }
  }
}
