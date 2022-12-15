import {AuxiliaryTableContentColors} from '../../../utils/auxiliaryTableContent/auxiliaryTableContentColors';
import {DropdownItemHighlightUtils} from '../../../utils/color/dropdownItemHighlightUtils';
import {FocusedCellUtils} from '../../../utils/focusedElements/focusedCellUtils';
import {CellHighlightUtils} from '../../../utils/color/cellHighlightUtils';
import {EditableTableComponent} from '../../../editable-table-component';
import {ElementOffset} from '../../../utils/elements/elementOffset';
import {RowDropdownEvents} from './rowDropdownEvents';
import {RowDropdownItem} from './rowDropdownItem';
import {DropdownItem} from '../dropdownItem';
import {Dropdown} from '../dropdown';

export class RowDropdown {
  // prettier-ignore
  public static hide(etc: EditableTableComponent) {
    const {activeOverlayElements: {rowDropdown, fullTableOverlay}, focusedElements: {cell: {element, rowIndex}}} = etc;
    Dropdown.hide(rowDropdown as HTMLElement, fullTableOverlay as HTMLElement);
    const cellColors = AuxiliaryTableContentColors.getColorsBasedOnParam(rowIndex as number);
    CellHighlightUtils.fade(element as HTMLElement, cellColors.default);
    DropdownItemHighlightUtils.fadeCurrentlyHighlighted(etc.activeOverlayElements);
    setTimeout(() => {
      // in a timeout because upon pressing esc/enter key on dropdown, the window event is fired after which checks it
      delete etc.focusedElements.rowDropdown;
      FocusedCellUtils.purge(etc.focusedElements.cell);
    });
  }

  // TO-DO will this work correctly when a scrollbar is introduced
  private static displayAndSetDropdownPosition(cellElement: HTMLElement, dropdownElement: HTMLElement) {
    dropdownElement.style.top = `${ElementOffset.processTop(cellElement.offsetTop)}px`;
    dropdownElement.style.left = `${ElementOffset.processWidth(cellElement.offsetWidth)}px`;
  }

  public static display(this: EditableTableComponent, rowIndex: number, event: MouseEvent) {
    const dropdownElement = this.activeOverlayElements.rowDropdown as HTMLElement;
    const fullTableOverlayElement = this.activeOverlayElements.fullTableOverlay as HTMLElement;
    RowDropdownItem.update(this, dropdownElement, rowIndex);
    const cellElement = event.target as HTMLElement;
    RowDropdown.displayAndSetDropdownPosition(cellElement, dropdownElement);
    Dropdown.display(dropdownElement, fullTableOverlayElement);
    setTimeout(() => FocusedCellUtils.setIndexCell(this.focusedElements.cell, cellElement, rowIndex));
  }

  public static create(etc: EditableTableComponent) {
    const dropdownElement = Dropdown.createBase();
    RowDropdownEvents.set(etc, dropdownElement);
    DropdownItem.addButtonItem(etc, dropdownElement, 'Insert Up');
    DropdownItem.addButtonItem(etc, dropdownElement, 'Insert Down');
    DropdownItem.addButtonItem(etc, dropdownElement, 'Move Up');
    DropdownItem.addButtonItem(etc, dropdownElement, 'Move Down');
    DropdownItem.addButtonItem(etc, dropdownElement, 'Delete');
    RowDropdownItem.setUpItems(etc.rowDropdownSettings, dropdownElement);
    return dropdownElement;
  }
}
