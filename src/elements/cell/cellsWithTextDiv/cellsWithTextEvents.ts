import {EditableTableComponent} from '../../../editable-table-component';
import {CategoryCellEvents} from './categoryCellEvents';
import {CellDetails} from '../../../types/focusedCell';

export class CellsWithTextEvents {
  public static programmaticBlur(etc: EditableTableComponent) {
    const {rowIndex, columnIndex, element} = etc.focusedElements.cell as CellDetails;
    const textElement = element.children[0] as HTMLElement;
    textElement.blur();
    // the above will not trigger the CategoryCellEvents.blur functionality if dropdown has been focused, but will blur
    // the element in the dom, the following will trigger the required programmatic functionality
    if (etc.focusedElements.categoryDropdown) {
      CategoryCellEvents.blurring(etc, rowIndex, columnIndex, textElement);
      delete etc.focusedElements.categoryDropdown;
    }
  }
}
