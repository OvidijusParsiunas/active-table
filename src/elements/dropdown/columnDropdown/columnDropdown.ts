import {DropdownItemHighlightUtils} from '../../../utils/color/dropdownItemHighlightUtils';
import {MaximumColumns} from '../../../utils/insertRemoveStructure/insert/maximumColumns';
import {ColumnSettingsUtils} from '../../../utils/columnSettings/columnSettingsUtils';
import {GenericElementUtils} from '../../../utils/elements/genericElementUtils';
import {ElementVisibility} from '../../../utils/elements/elementVisibility';
import {CellHighlightUtils} from '../../../utils/color/cellHighlightUtils';
import {EditableTableComponent} from '../../../editable-table-component';
import {ColumnDropdownItemEvents} from './columnDropdownItemEvents';
import {DropdownItemNavigation} from '../dropdownItemNavigation';
import {ColumnTypeDropdownItem} from './columnTypeDropdownItem';
import {ColumnDropdownEvents} from './columnDropdownEvents';
import {ColumnDropdownItem} from './columnDropdownItem';
import {ColumnTypeDropdown} from './columnTypeDropdown';
import {CellElement} from '../../cell/cellElement';
import {CellEvents} from '../../cell/cellEvents';
import {DropdownItem} from '../dropdownItem';
import {PX} from '../../../types/dimensions';
import {SIDE} from '../../../types/side';
import {Dropdown} from '../dropdown';

export class ColumnDropdown {
  // the reason why this is stored in state is because there is only one column dropdown for the whole table and
  // instead of having to traverse the dropdown element everytime, we can just store their references here
  private static INSERT_COLUMN_ITEMS: [HTMLElement?, HTMLElement?] = [];

  private static resetDropdownPosition(dropdownElement: HTMLElement) {
    dropdownElement.style.left = '';
  }

  private static processText(etc: EditableTableComponent, columnIndex: number, cellElement: HTMLElement) {
    etc.contents[0][columnIndex] = CellElement.getText(cellElement);
    CellEvents.setCellToDefaultIfNeeded(etc, 0, columnIndex as number, cellElement);
  }

  // prettier-ignore
  public static processTextAndHide(etc: EditableTableComponent) {
    const {
      overlayElementsState: {columnDropdown, columnTypeDropdown, fullTableOverlay}, columnsDetails,
      focusedElements: { cell: {element: cellElement, columnIndex} }, shadowRoot } = etc;
    if (!columnDropdown || !fullTableOverlay || !columnTypeDropdown || !cellElement) return;
    if (GenericElementUtils.doesElementExistInDom(cellElement)) {
      ColumnDropdown.processText(etc, columnIndex as number, cellElement);
      // TO-DO when user pastes text via the select mode - this should be called
      ColumnSettingsUtils.changeColumnSettingsIfNameDifferent(etc, cellElement, columnIndex as number);
    }
    CellHighlightUtils.fade(cellElement, columnsDetails[columnIndex as number]?.headerStateColors.default);
    Dropdown.hide(columnDropdown, fullTableOverlay, columnTypeDropdown);
    ColumnTypeDropdownItem.reset(columnTypeDropdown);
    ColumnDropdown.resetDropdownPosition(columnDropdown);
    DropdownItemHighlightUtils.fadeCurrentlyHighlighted(shadowRoot);
  }

  public static create(etc: EditableTableComponent, areHeadersEditable: boolean) {
    const dropdownElement = Dropdown.createBase();
    ColumnDropdownEvents.set(etc, dropdownElement);
    if (areHeadersEditable) DropdownItem.addInputItem(etc.shadowRoot, dropdownElement);
    // WORK - potentially have this as nested dropdown item and the nested dropdown item itself would then have the
    // selected item
    DropdownItem.addTitle(dropdownElement, 'Property type');
    ColumnTypeDropdown.addToColumnDropdown(etc, dropdownElement);
    ColumnDropdownItem.addSortButton(etc.shadowRoot, dropdownElement, 'Ascending');
    ColumnDropdownItem.addSortButton(etc.shadowRoot, dropdownElement, 'Descending');
    // WORK - Include Move Left/Move Right but not as part of default build
    ColumnDropdown.INSERT_COLUMN_ITEMS[0] = DropdownItem.addButtonItem(etc.shadowRoot, dropdownElement, 'Insert Right');
    ColumnDropdown.INSERT_COLUMN_ITEMS[1] = DropdownItem.addButtonItem(etc.shadowRoot, dropdownElement, 'Insert Left');
    DropdownItem.addButtonItem(etc.shadowRoot, dropdownElement, 'Delete');
    return dropdownElement;
  }

  private static updateInsertColumnItemsStyle(etc: EditableTableComponent) {
    const canAddMoreColumns = MaximumColumns.canAddMore(etc);
    ColumnDropdown.INSERT_COLUMN_ITEMS.forEach((item) => {
      if (!item) return;
      if (canAddMoreColumns) {
        item.classList.remove(Dropdown.DISABLED_ITEM_CLASS);
      } else {
        item.classList.add(Dropdown.DISABLED_ITEM_CLASS);
      }
    });
  }

  public static getDropdownTopPosition(cellElement: HTMLElement): PX {
    return `${cellElement.offsetTop + cellElement.offsetHeight}px`;
  }

  private static getLeftPropertyToCenterDropdown(cellElement: HTMLElement) {
    return `${cellElement.offsetLeft + cellElement.offsetWidth / 2 - Dropdown.DROPDOWN_WIDTH / 2}px`;
  }

  // TO-DO will this work correctly when a scrollbar is introduced
  private static displayAndSetDropdownPosition(cellElement: HTMLElement, dropdownElement: HTMLElement) {
    dropdownElement.style.left = ColumnDropdown.getLeftPropertyToCenterDropdown(cellElement);
    dropdownElement.style.top = ColumnDropdown.getDropdownTopPosition(cellElement);
    // needs to be displayed in order to evalute if in view port
    Dropdown.display(dropdownElement);
    const visibilityDetails = ElementVisibility.getDetailsInWindow(dropdownElement);
    if (!visibilityDetails.isFullyVisible) {
      if (visibilityDetails.blockingSides.has(SIDE.LEFT)) {
        dropdownElement.style.left = '0px';
      } else if (visibilityDetails.blockingSides.has(SIDE.RIGHT)) {
        dropdownElement.style.left = `${cellElement.offsetLeft + cellElement.offsetWidth - Dropdown.DROPDOWN_WIDTH}px`;
      }
    }
  }

  public static displayRelevantDropdownElements(etc: EditableTableComponent, columnIndex: number, event: MouseEvent) {
    const fullTableOverlay = etc.overlayElementsState.fullTableOverlay as HTMLElement;
    const dropdownElement = etc.overlayElementsState.columnDropdown as HTMLElement;
    const cellElement = event.target as HTMLElement;
    ColumnDropdownItem.setUp(etc, dropdownElement, columnIndex, cellElement);
    ColumnDropdown.displayAndSetDropdownPosition(cellElement, dropdownElement);
    const inputElement = DropdownItem.getInputElement(dropdownElement);
    if (inputElement) DropdownItemNavigation.focusInputElement(inputElement as HTMLElement);
    ColumnDropdownItemEvents.setItemEvents(etc, columnIndex, dropdownElement);
    ColumnDropdown.updateInsertColumnItemsStyle(etc);
    Dropdown.display(fullTableOverlay);
  }
}
