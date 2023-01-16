import {InsertNewColumn} from '../../../utils/insertRemoveStructure/insert/insertNewColumn';
import {RemoveColumn} from '../../../utils/insertRemoveStructure/remove/removeColumn';
import {ElementSiblingIterator} from '../../../utils/elements/elementSiblingIterator';
import {MoveColumn} from '../../../utils/moveStructure/moveColumn';
import {ColumnDropdownItem} from './columnDropdownItem';
import {Sort} from '../../../utils/columnType/sort';
import {ActiveTable} from '../../../activeTable';
import {CellEvents} from '../../cell/cellEvents';
import {ColumnDropdown} from './columnDropdown';

export class ColumnDropdownItemEvents {
  private static onClickMiddleware(this: ActiveTable, func: Function): void {
    func();
    ColumnDropdown.processTextAndHide(this);
  }

  // prettier-ignore
  public static setItemEvents(at: ActiveTable, columnIndex: number, dropdownElement: HTMLElement) {
    const ascSortItem = dropdownElement.getElementsByClassName(ColumnDropdownItem.SORT_ITEM_CLASS)[0] as HTMLElement;
    const siblingIterator = ElementSiblingIterator.create(ascSortItem);
    siblingIterator.currentElement().onclick = ColumnDropdownItemEvents.onClickMiddleware.bind(
      at, Sort.sortContentsColumn.bind(this, at, columnIndex, true));
    siblingIterator.next().onclick = ColumnDropdownItemEvents.onClickMiddleware.bind(
      at, Sort.sortContentsColumn.bind(this, at, columnIndex, false));
    siblingIterator.next().onclick = ColumnDropdownItemEvents.onClickMiddleware.bind(
      at, InsertNewColumn.insert.bind(this, at, columnIndex));
    siblingIterator.next().onclick = ColumnDropdownItemEvents.onClickMiddleware.bind(
      at, InsertNewColumn.insert.bind(this, at, columnIndex + 1));
    siblingIterator.next().onclick = ColumnDropdownItemEvents.onClickMiddleware.bind(
      at, MoveColumn.move.bind(this, at, columnIndex, false));
    siblingIterator.next().onclick = ColumnDropdownItemEvents.onClickMiddleware.bind(
      at, MoveColumn.move.bind(this, at, columnIndex, true));
    siblingIterator.next().onclick = ColumnDropdownItemEvents.onClickMiddleware.bind(
      at, RemoveColumn.remove.bind(this, at, columnIndex));
    // TO-DO - potential animation can be useful when a new column is inserted
  }

  // reason why using onInput for updating cells is because it works for paste
  // prettier-ignore
  private static onInput(this: ActiveTable,
      columnIndex: number, cellElement: HTMLElement, dropdownElement: HTMLElement, dropdownInutElement: HTMLInputElement) {
    setTimeout(() => {
      CellEvents.updateCell(this, dropdownInutElement.value, 0, columnIndex, { element: cellElement, processText: false });
      // when header cell height changes - dropdown changes position accordingly
      dropdownElement.style.top = ColumnDropdown.getDropdownTopPosition(cellElement);
    });
  }

  // prettier-ignore
  public static setInputItemEvent(at: ActiveTable,
      columnIndex: number, cellElement: HTMLElement, dropdownInutElement: HTMLInputElement, dropdownElement: HTMLElement) {
    // overwrites the oninput event
    dropdownInutElement.oninput = ColumnDropdownItemEvents.onInput.bind(
      at, columnIndex, cellElement, dropdownElement, dropdownInutElement);
  }
}
