import {DropdownItemHighlightUtil} from '../../../utils/color/dropdownItemHighlightUtil';
import {MaximumRows} from '../../../utils/insertRemoveStructure/insert/maximumRows';
import {FocusedCellUtils} from '../../../utils/focusedElements/focusedCellUtils';
import {EditableTableComponent} from '../../../editable-table-component';
import {CellHighlightUtil} from '../../../utils/color/cellHighlightUtil';
import {KEYBOARD_KEY} from '../../../consts/keyboardKeys';
import {RowDropdownItem} from './rowDropdownItem';
import {DropdownItem} from '../dropdownItem';
import {Dropdown} from '../dropdown';

export class RowDropdown {
  private static INSERT_ROW_ITEMS: [HTMLElement?, HTMLElement?] = [];
  private static LAST_ITEM: HTMLElement;

  // prettier-ignore
  public static hide(etc: EditableTableComponent) {
    const {overlayElementsState: {rowDropdown, fullTableOverlay}, focusedElements: {cell: {element: cellElement}}} = etc;
    Dropdown.hide(rowDropdown as HTMLElement, fullTableOverlay as HTMLElement);
    CellHighlightUtil.fade(cellElement as HTMLElement);
    setTimeout(() => {
      // in a timeout because upon pressing esc/enter key on dropdown, the window event is fired after which checks it
      delete etc.focusedElements.rowDropdown;
      FocusedCellUtils.purge(etc.focusedElements.cell);
      DropdownItemHighlightUtil.fadeCurrentlyHighlighted(etc.shadowRoot);
    });
  }

  private static updateItemsStyle(etc: EditableTableComponent) {
    const canAddMoreRows = MaximumRows.canAddMore(etc);
    RowDropdown.INSERT_ROW_ITEMS.forEach((item) => {
      if (!item) return;
      if (canAddMoreRows) {
        item.classList.remove(Dropdown.DISABLED_ITEM_CLASS);
      } else {
        item.classList.add(Dropdown.DISABLED_ITEM_CLASS);
      }
    });
  }

  // TO-DO will this work correctly when a scrollbar is introduced
  private static displayAndSetDropdownPosition(cellElement: HTMLElement, dropdownElement: HTMLElement) {
    dropdownElement.style.top = `${cellElement.offsetTop}px`;
    dropdownElement.style.left = `${cellElement.offsetWidth}px`;
  }

  public static display(this: EditableTableComponent, rowIndex: number, event: MouseEvent) {
    const dropdownElement = this.overlayElementsState.rowDropdown as HTMLElement;
    const fullTableOverlayElement = this.overlayElementsState.fullTableOverlay as HTMLElement;
    RowDropdownItem.rebindButtonItems(this, rowIndex, dropdownElement);
    RowDropdown.updateItemsStyle(this);
    const cellElement = event.target as HTMLElement;
    RowDropdown.displayAndSetDropdownPosition(cellElement, dropdownElement);
    Dropdown.display(dropdownElement, fullTableOverlayElement);
    setTimeout(() => FocusedCellUtils.setIndexCell(this.focusedElements.cell, cellElement, rowIndex));
  }

  // the reason why we track window key events is because the table is not actually focused when it is displayed,
  // (unlike column dropdown which has an input), hence initially clicking tab does not focus the dropdown and
  // instead we need to focus it programmatically here. Once focused, the actual dropdown events can take over.
  // prettier-ignore
  public static windowOnKeyDown(etc: EditableTableComponent, event: KeyboardEvent) {
    const {overlayElementsState: {rowDropdown, fullTableOverlay}, shadowRoot} = etc;
    if (etc.focusedElements.rowDropdown || !rowDropdown || !fullTableOverlay) return;
    if (event.key === KEYBOARD_KEY.ENTER || event.key === KEYBOARD_KEY.ESCAPE) {
      RowDropdown.hide(etc);
    } else if (event.key === KEYBOARD_KEY.TAB) {
      event.preventDefault();
      etc.focusedElements.rowDropdown = rowDropdown;
      // the reason why the last item is used is because the next item that is going to be focused will be the first item
      if (!shadowRoot?.activeElement) DropdownItem.focusNextItem(RowDropdown.LAST_ITEM as HTMLElement, rowDropdown);
    } else if (event.key === KEYBOARD_KEY.ARROW_DOWN) {
      
    } else if (event.key === KEYBOARD_KEY.ARROW_UP) {
      
    }
  }

  // WORK - ARROW UP AND DOWN for dropdowns and arrow right for nested dropdown
  public static dropdownOnKeyDown(this: EditableTableComponent, dropdownElement: HTMLElement, event: KeyboardEvent) {
    if (event.key === KEYBOARD_KEY.ENTER) {
      const itemElement = event.target as HTMLElement;
      itemElement.dispatchEvent(new Event('mouseenter'));
      itemElement.dispatchEvent(new Event('click'));
    } else if (event.key === KEYBOARD_KEY.ESCAPE) {
      RowDropdown.hide(this);
    } else if (event.key === KEYBOARD_KEY.TAB) {
      event.preventDefault();
      DropdownItem.focusNextItem(event.target as HTMLElement, dropdownElement);
    }
  }

  public static create(etc: EditableTableComponent) {
    const dropdownElement = Dropdown.createBase();
    dropdownElement.onkeydown = RowDropdown.dropdownOnKeyDown.bind(etc, dropdownElement);
    RowDropdown.INSERT_ROW_ITEMS[0] = DropdownItem.addButtonItem(etc.shadowRoot, dropdownElement, 'Insert Above');
    RowDropdown.INSERT_ROW_ITEMS[1] = DropdownItem.addButtonItem(etc.shadowRoot, dropdownElement, 'Insert Below');
    RowDropdown.LAST_ITEM = DropdownItem.addButtonItem(etc.shadowRoot, dropdownElement, 'Delete');
    return dropdownElement;
  }
}
