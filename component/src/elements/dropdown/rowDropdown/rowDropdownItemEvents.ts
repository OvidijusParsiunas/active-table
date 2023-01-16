import {ElementSiblingIterator} from '../../../utils/elements/elementSiblingIterator';
import {InsertNewRow} from '../../../utils/insertRemoveStructure/insert/insertNewRow';
import {RemoveRow} from '../../../utils/insertRemoveStructure/remove/removeRow';
import {MoveRow} from '../../../utils/moveStructure/moveRow';
import {ActiveTable} from '../../../activeTable';
import {DropdownItem} from '../dropdownItem';
import {RowDropdown} from './rowDropdown';

export class RowDropdownItemEvents {
  private static onClickMiddleware(this: ActiveTable, func: Function): void {
    func();
    RowDropdown.hide(this);
  }

  // prettier-ignore
  public static set(at: ActiveTable, dropdownElement: HTMLElement, rowIndex: number) {
    const firstItem = dropdownElement.getElementsByClassName(DropdownItem.DROPDOWN_ITEM_CLASS)[0] as HTMLElement;
    const siblingIterator = ElementSiblingIterator.create(firstItem);
    siblingIterator.currentElement().onclick = RowDropdownItemEvents.onClickMiddleware.bind(
      at, InsertNewRow.insert.bind(this, at, rowIndex, true));
    siblingIterator.next().onclick = RowDropdownItemEvents.onClickMiddleware.bind(
      at, InsertNewRow.insert.bind(this, at, rowIndex + 1, true));
    siblingIterator.next().onclick = RowDropdownItemEvents.onClickMiddleware.bind(
      at, MoveRow.move.bind(this, at, rowIndex, false));
    siblingIterator.next().onclick = RowDropdownItemEvents.onClickMiddleware.bind(
      at, MoveRow.move.bind(this, at, rowIndex, true));
    siblingIterator.next().onclick = RowDropdownItemEvents.onClickMiddleware.bind(
      at, RemoveRow.remove.bind(this, at, rowIndex));
    // TO-DO - potential animation can be useful when a row column is inserted
  }
}
