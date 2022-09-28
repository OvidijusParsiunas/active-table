import {InsertNewColumn} from '../../../utils/insertRemoveStructure/insert/insertNewColumn';
import {RemoveColumn} from '../../../utils/insertRemoveStructure/remove/removeColumn';
import {ElementSiblingIterator} from '../../../utils/elements/elementSiblingIterator';
import {EditableTableComponent} from '../../../editable-table-component';
import {UserSetCellType} from '../../../utils/cellType/userSetCellType';
import {USER_SET_COLUMN_TYPE} from '../../../enums/columnType';
import {ColumnDetailsT} from '../../../types/columnDetails';
import {CELL_TYPE} from '../../../enums/cellType';
import {CellEvents} from '../../cell/cellEvents';
import {ColumnDropdown} from './columnDropdown';
import {Sort} from '../../../utils/array/sort';
import {DropdownItem} from '../dropdownItem';

export class ColumnDropdownItem extends DropdownItem {
  private static readonly SORT_ITEM_CLASS = 'dropdown-sort-item';
  private static readonly COLUMN_TYPE_ITEM_CLASS = 'dropdown-column-type-item';

  // prettier-ignore
  public static addColumnTypeNestedDropdownItem(dropdownElement: HTMLElement) {
    const nestedDropdownKeys = Object.keys(USER_SET_COLUMN_TYPE);
    return DropdownItem.addNestedDropdownItem(
      dropdownElement, '', nestedDropdownKeys, ColumnDropdownItem.COLUMN_TYPE_ITEM_CLASS);
  }

  // this is used as an ancher to identify the location of below buttons
  public static addSortButton(dropdownElement: HTMLElement, text: string) {
    DropdownItem.addButtonItem(dropdownElement, text, ColumnDropdownItem.SORT_ITEM_CLASS);
  }

  // reason why using onInput for updating cells is because it works for paste
  // prettier-ignore
  private static onInput(this: EditableTableComponent,
      columnIndex: number, cellElement: HTMLElement, dropdownElement: HTMLElement, dropdownInutElement: HTMLInputElement) {
    setTimeout(() => {
      CellEvents.updateCell(this, dropdownInutElement.value, 0, columnIndex, { element: cellElement, processText: false });
      // when the header cell height changes - the dropdown moves up and
      const dimensions = cellElement.getBoundingClientRect();
      dropdownElement.style.top = `${dimensions.bottom}px`;
    });
  }

  // prettier-ignore
  private static setUpInputElement(etc: EditableTableComponent,
      columnIndex: number, cellElement: HTMLElement, dropdownInutElement: HTMLInputElement, dropdownElement: HTMLElement) {
    dropdownInutElement.value = etc.contents[0][columnIndex] as string;
    // overwrites the oninput event
    dropdownInutElement.oninput = ColumnDropdownItem.onInput.bind(
      etc, columnIndex, cellElement, dropdownElement, dropdownInutElement);
  }

  private static onClickMiddleware(this: EditableTableComponent, func: Function): void {
    func();
    ColumnDropdown.processTextAndHide(this);
  }

  // prettier-ignore
  public static rebindButtonItems(etc: EditableTableComponent, columnIndex: number, dropdownElement: HTMLElement) {
    const ascSortItem = dropdownElement.getElementsByClassName(ColumnDropdownItem.SORT_ITEM_CLASS)[0] as HTMLElement;
    const siblingIterator = ElementSiblingIterator.create(ascSortItem);
    siblingIterator.currentElement().onclick = ColumnDropdownItem.onClickMiddleware.bind(
      etc, Sort.sortContentsColumn.bind(this, etc, columnIndex, true));
    siblingIterator.next().onclick = ColumnDropdownItem.onClickMiddleware.bind(
      etc, Sort.sortContentsColumn.bind(this, etc, columnIndex, false));
    siblingIterator.next().onclick = ColumnDropdownItem.onClickMiddleware.bind(
      etc, InsertNewColumn.insert.bind(this, etc, columnIndex + 1));
    siblingIterator.next().onclick = ColumnDropdownItem.onClickMiddleware.bind(
      etc, InsertNewColumn.insert.bind(this, etc, columnIndex));
    siblingIterator.next().onclick = ColumnDropdownItem.onClickMiddleware.bind(
      etc, RemoveColumn.remove.bind(this, etc, columnIndex));
    // TO-DO - potential animation can be useful when a new column is inserted
  }

  private static setActiveUserChosenColumnType(nestedDropdownChildren: HTMLElement[], columnDetails: ColumnDetailsT) {
    const userChosenColumnTypeString = USER_SET_COLUMN_TYPE[columnDetails.userSetColumnType];
    DropdownItem.setActiveNestedDropdownItem(nestedDropdownChildren, userChosenColumnTypeString);
  }

  // prettier-ignore
  private static rebindColumnTypeDropdownButtonItems(etc: EditableTableComponent, nestedDropdownChildren: HTMLElement[],
      columnIndex: number) {
    nestedDropdownChildren.forEach((dropdownChildElement) => {
      const dropdownItem = dropdownChildElement as HTMLElement;
      dropdownItem.onclick = ColumnDropdownItem.onClickMiddleware.bind(etc,
        UserSetCellType.setIfNew.bind(etc, dropdownItem.textContent as string, columnIndex));
    })
  }

  private static setUpColumnTypeDropdown(etc: EditableTableComponent, dropdownElement: HTMLElement, columnIndex: number) {
    const nestedDropdownChilrenArr = Array.from(dropdownElement.children) as HTMLElement[];
    ColumnDropdownItem.rebindColumnTypeDropdownButtonItems(etc, nestedDropdownChilrenArr, columnIndex);
    ColumnDropdownItem.setActiveUserChosenColumnType(nestedDropdownChilrenArr, etc.columnsDetails[columnIndex]);
  }

  private static setUpColumnType(etc: EditableTableComponent, dropdownElement: HTMLElement, columnIndex: number) {
    const columnTypeItem = dropdownElement.getElementsByClassName(ColumnDropdownItem.COLUMN_TYPE_ITEM_CLASS)[0];
    const textElement = columnTypeItem.children[0];
    textElement.textContent = CELL_TYPE[etc.columnsDetails[columnIndex].activeColumnType];
    ColumnDropdownItem.setUpColumnTypeDropdown(etc, textElement.nextSibling as HTMLElement, columnIndex);
  }

  // prettier-ignore
  public static setUpContent(etc: EditableTableComponent,
      dropdownElement: HTMLElement, columnIndex: number, cellElement: HTMLElement) {
    ColumnDropdownItem.setUpColumnType(etc, dropdownElement, columnIndex);
    const dropdownInputElement = dropdownElement.getElementsByClassName(
      DropdownItem.DROPDOWN_INPUT_CLASS)[0] as HTMLInputElement;
    if (dropdownInputElement) {
      ColumnDropdownItem.setUpInputElement(etc, columnIndex, cellElement, dropdownInputElement, dropdownElement);
    }
  }
}
