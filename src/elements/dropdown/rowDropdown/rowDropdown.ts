import {AuxiliaryTableContentColors} from '../../../utils/auxiliaryTableContent/auxiliaryTableContentColors';
import {DropdownItemHighlightUtils} from '../../../utils/color/dropdownItemHighlightUtils';
import {MaximumRows} from '../../../utils/insertRemoveStructure/insert/maximumRows';
import {FocusedCellUtils} from '../../../utils/focusedElements/focusedCellUtils';
import {CellHighlightUtils} from '../../../utils/color/cellHighlightUtils';
import {EditableTableComponent} from '../../../editable-table-component';
import {RowDropdownItemEvents} from './rowDropdownItemEvents';
import {RowDropdownEvents} from './rowDropdownEvents';
import {DropdownItem} from '../dropdownItem';
import {Dropdown} from '../dropdown';

export class RowDropdown {
  private static INSERT_ROW_ITEMS: [HTMLElement?, HTMLElement?] = [];

  // prettier-ignore
  public static hide(etc: EditableTableComponent) {
    const {overlayElementsState: {rowDropdown, fullTableOverlay}, focusedElements: {cell: {element, rowIndex}}} = etc;
    Dropdown.hide(rowDropdown as HTMLElement, fullTableOverlay as HTMLElement);
    const cellColors = AuxiliaryTableContentColors.getColorsBasedOnParam(rowIndex as number);
    CellHighlightUtils.fade(element as HTMLElement, cellColors.default);
    DropdownItemHighlightUtils.fadeCurrentlyHighlighted(etc.tableElementEventState);
    setTimeout(() => {
      // in a timeout because upon pressing esc/enter key on dropdown, the window event is fired after which checks it
      delete etc.focusedElements.rowDropdown;
      FocusedCellUtils.purge(etc.focusedElements.cell);
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
    RowDropdownItemEvents.set(this, rowIndex, dropdownElement);
    RowDropdown.updateItemsStyle(this);
    const cellElement = event.target as HTMLElement;
    RowDropdown.displayAndSetDropdownPosition(cellElement, dropdownElement);
    Dropdown.display(dropdownElement, fullTableOverlayElement);
    setTimeout(() => FocusedCellUtils.setIndexCell(this.focusedElements.cell, cellElement, rowIndex));
  }

  public static create(etc: EditableTableComponent) {
    const dropdownElement = Dropdown.createBase();
    RowDropdownEvents.set(etc, dropdownElement);
    // WORK - include Move Up/Move Down, but not part of default build
    RowDropdown.INSERT_ROW_ITEMS[0] = DropdownItem.addButtonItem(etc, dropdownElement, 'Insert Above');
    RowDropdown.INSERT_ROW_ITEMS[1] = DropdownItem.addButtonItem(etc, dropdownElement, 'Insert Below');
    DropdownItem.addButtonItem(etc, dropdownElement, 'Delete');
    return dropdownElement;
  }
}
