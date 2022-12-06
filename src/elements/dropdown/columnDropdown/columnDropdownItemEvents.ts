import {InsertNewColumn} from '../../../utils/insertRemoveStructure/insert/insertNewColumn';
import {RemoveColumn} from '../../../utils/insertRemoveStructure/remove/removeColumn';
import {ElementSiblingIterator} from '../../../utils/elements/elementSiblingIterator';
import {EditableTableComponent} from '../../../editable-table-component';
import {ColumnDropdownItem} from './columnDropdownItem';
import {Sort} from '../../../utils/columnType/sort';
import {CellEvents} from '../../cell/cellEvents';
import {ColumnDropdown} from './columnDropdown';

export class ColumnDropdownItemEvents {
  private static onClickMiddleware(this: EditableTableComponent, func: Function): void {
    func();
    ColumnDropdown.processTextAndHide(this);
  }

  // prettier-ignore
  public static setItemEvents(etc: EditableTableComponent, columnIndex: number, dropdownElement: HTMLElement) {
    const ascSortItem = dropdownElement.getElementsByClassName(ColumnDropdownItem.SORT_ITEM_CLASS)[0] as HTMLElement;
    const siblingIterator = ElementSiblingIterator.create(ascSortItem);
    siblingIterator.currentElement().onclick = ColumnDropdownItemEvents.onClickMiddleware.bind(
      etc, Sort.sortContentsColumn.bind(this, etc, columnIndex, true));
    siblingIterator.next().onclick = ColumnDropdownItemEvents.onClickMiddleware.bind(
      etc, Sort.sortContentsColumn.bind(this, etc, columnIndex, false));
    siblingIterator.next().onclick = ColumnDropdownItemEvents.onClickMiddleware.bind(
      etc, InsertNewColumn.insert.bind(this, etc, columnIndex + 1));
    siblingIterator.next().onclick = ColumnDropdownItemEvents.onClickMiddleware.bind(
      etc, InsertNewColumn.insert.bind(this, etc, columnIndex));
    siblingIterator.next().onclick = ColumnDropdownItemEvents.onClickMiddleware.bind(
      etc, RemoveColumn.remove.bind(this, etc, columnIndex));
    // TO-DO - potential animation can be useful when a new column is inserted
  }

  // reason why using onInput for updating cells is because it works for paste
  // prettier-ignore
  private static onInput(this: EditableTableComponent,
      columnIndex: number, cellElement: HTMLElement, dropdownElement: HTMLElement, dropdownInutElement: HTMLInputElement) {
    setTimeout(() => {
      CellEvents.updateCell(this, dropdownInutElement.value, 0, columnIndex, { element: cellElement, processText: false });
      // when header cell height changes - dropdown changes position accordingly
      dropdownElement.style.top = ColumnDropdown.getDropdownTopPosition(cellElement);
    });
  }

  // prettier-ignore
  public static setInputItemEvent(etc: EditableTableComponent,
      columnIndex: number, cellElement: HTMLElement, dropdownInutElement: HTMLInputElement, dropdownElement: HTMLElement) {
    // overwrites the oninput event
    dropdownInutElement.oninput = ColumnDropdownItemEvents.onInput.bind(
      etc, columnIndex, cellElement, dropdownElement, dropdownInutElement);
  }
}
