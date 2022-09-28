import {GenericElementUtils} from '../../../utils/elements/genericElementUtils';
import {EditableTableComponent} from '../../../editable-table-component';
import {ColumnCategories} from '../../../types/columnDetails';
import {TableContents} from '../../../types/tableContents';
import {CellEvents} from '../../cell/cellEvents';
import {DropdownItem} from '../dropdownItem';
import {Dropdown} from '../dropdown';

// TO-DO allow dev to control whether additional elements are allowed to be added
// WORK - refactor here
export class CategoryDropdown extends Dropdown {
  // open with first one focused, if enter - use that key
  // if user starts typing - no focus is needed

  private static addItems(uniqueCategories: ColumnCategories, categoryDropdown: HTMLElement) {
    Object.keys(uniqueCategories).forEach((content) => {
      DropdownItem.addButtonItem(categoryDropdown as HTMLElement, content as string);
    });
  }

  private static aggregateUniqueCategories(contents: TableContents, columnIndex: number, defaultCellValue: string) {
    const uniqueCategories: ColumnCategories = {};
    contents.slice(1).forEach((row) => {
      const cellText = row[columnIndex] as string;
      uniqueCategories[cellText] = true;
    });
    delete uniqueCategories[defaultCellValue];
    return uniqueCategories;
  }

  // prettier-ignore
  public static populateItems(etc: EditableTableComponent, columnIndex: number) {
    const { overlayElementsState: { categoryDropdown }, contents, defaultCellValue, columnsDetails } = etc;
    const uniqueCategories = CategoryDropdown.aggregateUniqueCategories(contents, columnIndex, defaultCellValue);
    columnsDetails[columnIndex].categories = uniqueCategories;
    CategoryDropdown.addItems(uniqueCategories, categoryDropdown as HTMLElement);
  }

  // Will need to populate upfront if user has set a column as category upfront
  public static create() {
    const dropdownElement = Dropdown.createBase();
    dropdownElement.style.maxHeight = '150px';
    dropdownElement.style.overflow = 'auto';
    return dropdownElement;
  }

  // WORK - probably can change param to categoryDropdown;
  // might need closable elements function
  public static hide(etc: EditableTableComponent) {
    const categoryDropdown = etc.overlayElementsState.categoryDropdown as HTMLElement;
    GenericElementUtils.hideElements(categoryDropdown);
  }

  private static setPosition(categoryDropdown: HTMLElement, cellElement: HTMLElement) {
    const rect = cellElement.getBoundingClientRect();
    categoryDropdown.style.left = `${rect.right}px`;
    categoryDropdown.style.top = `${rect.top}px`;
  }

  // instead of binding click event handlers with the context of current row index to individual item elements every
  // time the dropdown is displayed, click events are handled on the dropdown instead, the reason for this is
  // because it can be expensive to rebind an arbitrary amount of items e.g. 10000+
  private static dropdownClick(this: EditableTableComponent, rowIndex: number, columnIndex: number, event: MouseEvent) {
    const newText = (event.target as HTMLElement).textContent as string;
    const {contents, columnsDetails} = this;
    const cellElement = columnsDetails[columnIndex].elements[rowIndex];
    if ((contents[rowIndex][columnIndex] as string) !== newText) {
      CellEvents.updateCell(this, newText, rowIndex, columnIndex, {processText: false, element: cellElement});
    }
    CategoryDropdown.hide(this);
  }

  public static display(etc: EditableTableComponent, rowIndex: number, columnIndex: number, cellElement: HTMLElement) {
    const columnDetails = etc.columnsDetails[columnIndex];
    if (Object.keys(columnDetails.categories).length > 0) {
      const categoryDropdown = etc.overlayElementsState.categoryDropdown as HTMLElement;
      CategoryDropdown.setPosition(categoryDropdown, cellElement);
      categoryDropdown.style.display = 'block';
      categoryDropdown.onclick = CategoryDropdown.dropdownClick.bind(etc, rowIndex, columnIndex);
    } else if (Dropdown.isDisplayed(etc.overlayElementsState.categoryDropdown)) {
      CategoryDropdown.hide(etc);
    }
  }
}
