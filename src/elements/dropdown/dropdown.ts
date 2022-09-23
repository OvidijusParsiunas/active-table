import {EditableTableComponent} from '../../editable-table-component';
import {ElementViewPort} from '../../utils/elements/elementViewPort';
import {HeaderCellEvents} from '../cell/headerCellEvents';
import {COLUMN_TYPE} from '../../enums/columnTypes';
import {CellEvents} from '../cell/cellEvents';
import {DropdownItem} from './dropdownItem';
import {SIDE} from '../../types/side';

export class Dropdown {
  private static readonly ENTER_KEY = 'Enter';
  private static readonly ESCAPE_KEY = 'Escape';
  private static readonly TAB_KEY = 'Tab';
  // there will only ever be one dropdown instance within the shadow dom
  private static readonly DROPDOWN_ID = 'editable-table-component-dropdown';
  private static readonly CSS_DISPLAY_VISIBLE = 'block';
  private static readonly DROPDOWN_WIDTH = 176;

  public static isDisplayed(columnDropdown?: HTMLElement) {
    return columnDropdown?.style.display === Dropdown.CSS_DISPLAY_VISIBLE;
  }

  public static isPartOfDropdownElement(element: HTMLElement) {
    return element.id === Dropdown.DROPDOWN_ID || element.classList.contains(DropdownItem.DROPDOWN_ITEM_CLASS);
  }

  private static hideElements(...elements: HTMLElement[]) {
    elements.forEach((element: HTMLElement) => (element.style.display = 'none'));
  }

  private static onKeyDown(this: EditableTableComponent, dropdownElement: HTMLElement, event: KeyboardEvent) {
    if (event.key === Dropdown.ENTER_KEY) {
      const itemElement = event.target as HTMLElement;
      if (itemElement.classList.contains(DropdownItem.DROPDOWN_INPUT_CLASS)) {
        Dropdown.processTextAndHide(this);
      } else {
        itemElement.click();
      }
    } else if (event.key === Dropdown.ESCAPE_KEY) {
      Dropdown.processTextAndHide(this);
    } else if (event.key === Dropdown.TAB_KEY) {
      DropdownItem.focusNextItem(dropdownElement, event);
    }
  }

  public static create(etc: EditableTableComponent, areHeadersEditable: boolean) {
    const dropdownElement = document.createElement('div');
    dropdownElement.id = Dropdown.DROPDOWN_ID;
    // using width to be able to center the dropdown relative to the cell
    // alternative approach is to use a parent div for the dropdown which would be centered relativer to the cell
    // and there would be no need for an equation to center the dropdown using its width, but this is simpler
    dropdownElement.style.width = `${Dropdown.DROPDOWN_WIDTH}px`;
    dropdownElement.onkeydown = Dropdown.onKeyDown.bind(etc, dropdownElement);
    if (areHeadersEditable) DropdownItem.addInputItem(dropdownElement);
    DropdownItem.addTitle(dropdownElement, 'Property type');
    DropdownItem.addSelectionItem(dropdownElement, String(COLUMN_TYPE.Any));
    DropdownItem.addButtonItem(dropdownElement, 'Ascending');
    DropdownItem.addButtonItem(dropdownElement, 'Descending');
    DropdownItem.addButtonItem(dropdownElement, 'Insert Right');
    DropdownItem.addButtonItem(dropdownElement, 'Insert Left');
    DropdownItem.addButtonItem(dropdownElement, 'Delete');
    Dropdown.hideElements(dropdownElement);
    return dropdownElement;
  }

  private static resetDropdownPosition(dropdownElement: HTMLElement) {
    dropdownElement.style.left = '';
  }

  // prettier-ignore
  public static processTextAndHide(etc: EditableTableComponent) {
    const {
      overlayElementsState: {columnDropdown, fullTableOverlay},
      highlightedHeaderCell: {element: cellElement, columnIndex}} = etc;
    // setCellToDefaultIfNeeded will not work without etc.contents containing trimmed text
    etc.contents[0][columnIndex as number] = (cellElement?.textContent as string).trim();
    CellEvents.setCellToDefaultIfNeeded(etc, 0, columnIndex as number, cellElement as HTMLElement);
    HeaderCellEvents.fadeCell(cellElement as HTMLElement);
    Dropdown.hideElements(columnDropdown as HTMLElement, fullTableOverlay as HTMLElement);
    Dropdown.resetDropdownPosition(columnDropdown as HTMLElement);
  }

  private static getLeftPropertyToCenterDropdown(cellDimensions: DOMRect) {
    return `${cellDimensions.left + cellDimensions.width / 2 - Dropdown.DROPDOWN_WIDTH / 2}px`;
  }

  // TO-DO will this work correctly when a scrollbar is introduced
  private static displayAndSetDropdownPosition(cellElement: HTMLElement, dropdownElement: HTMLElement, type: COLUMN_TYPE) {
    const dimensions = cellElement.getBoundingClientRect();
    dropdownElement.style.left = Dropdown.getLeftPropertyToCenterDropdown(dimensions);
    dropdownElement.style.top = `${dimensions.bottom}px`;
    dropdownElement.children[2].textContent = COLUMN_TYPE[type];
    // needs to be displayed in order to evalute if in view port
    dropdownElement.style.display = Dropdown.CSS_DISPLAY_VISIBLE;
    const visibilityDetails = ElementViewPort.getVisibilityDetails(dropdownElement);
    if (!visibilityDetails.isFullyVisible) {
      const tableElement = dropdownElement.parentElement as HTMLElement;
      if (visibilityDetails.blockingSide === SIDE.LEFT) {
        dropdownElement.style.left = `${tableElement.getBoundingClientRect().left}px`;
      } else if (visibilityDetails.blockingSide === SIDE.RIGHT) {
        dropdownElement.style.left = `${tableElement.getBoundingClientRect().right - Dropdown.DROPDOWN_WIDTH}px`;
      }
    }
  }

  // prettier-ignore
  // WORK - how will this positioning work with scrolling
  public static displayRelevantDropdownElements(etc: EditableTableComponent, columnIndex: number, event: MouseEvent) {
    const fullTableOverlay = etc.overlayElementsState.fullTableOverlay as HTMLElement;
    const dropdownElement = etc.overlayElementsState.columnDropdown as HTMLElement;
    const dropdownInputElement = dropdownElement.getElementsByClassName(
      DropdownItem.DROPDOWN_INPUT_CLASS)[0] as HTMLInputElement;
    const cellElement = event.target as HTMLElement;
    Dropdown.displayAndSetDropdownPosition(cellElement, dropdownElement, etc.columnsDetails[columnIndex].type);
    if (dropdownInputElement) DropdownItem.setUpInputElement(
      etc, columnIndex, cellElement, dropdownInputElement, dropdownElement);
    DropdownItem.focusInputElement(dropdownElement);
    DropdownItem.rebindButtonItems(etc, columnIndex, dropdownElement);
    fullTableOverlay.style.display = Dropdown.CSS_DISPLAY_VISIBLE;
  }
}
