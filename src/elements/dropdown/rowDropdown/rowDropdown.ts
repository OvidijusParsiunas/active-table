import {AuxiliaryTableContentColors} from '../../../utils/auxiliaryTableContent/auxiliaryTableContentColors';
import {DropdownItemHighlightUtils} from '../../../utils/color/dropdownItemHighlightUtils';
import {FullTableOverlayElement} from '../../fullTableOverlay/fullTableOverlayElement';
import {FocusedCellUtils} from '../../../utils/focusedElements/focusedCellUtils';
import {CellHighlightUtils} from '../../../utils/color/cellHighlightUtils';
import {EditableTableComponent} from '../../../editable-table-component';
import {DropdownCellOverlay} from '../cellOverlay/dropdownCellOverlay';
import {ElementOffset} from '../../../utils/elements/elementOffset';
import {RowDropdownEvents} from './rowDropdownEvents';
import {RowDropdownItem} from './rowDropdownItem';
import {Dropdown} from '../dropdown';

export class RowDropdown {
  // prettier-ignore
  public static hide(etc: EditableTableComponent) {
    const {activeOverlayElements: {rowDropdown, fullTableOverlay}, focusedElements: {cell: {element, rowIndex}}} = etc;
    if (!rowDropdown || !fullTableOverlay || !element) return
    Dropdown.hide(rowDropdown, fullTableOverlay);
    const cellColors = AuxiliaryTableContentColors.getColorsBasedOnParam(rowIndex as number);
    if (etc.auxiliaryTableContentInternal.displayIndexColumn) CellHighlightUtils.fade(element, cellColors.default);
    DropdownItemHighlightUtils.fadeCurrentlyHighlighted(etc.activeOverlayElements);
    setTimeout(() => {
      // in a timeout because upon pressing esc/enter key on dropdown, the window event is fired after which checks it
      delete etc.focusedElements.rowDropdown;
      FocusedCellUtils.purge(etc.focusedElements.cell);
    });
  }

  private static focusCell(etc: EditableTableComponent, rowIndex: number, cellElement: HTMLElement) {
    const {auxiliaryTableContentInternal, focusedElements, columnsDetails} = etc;
    if (auxiliaryTableContentInternal.displayIndexColumn) {
      FocusedCellUtils.setIndexCell(focusedElements.cell, cellElement, rowIndex);
    } else {
      FocusedCellUtils.set(focusedElements.cell, cellElement, rowIndex, 0, columnsDetails[0].types);
    }
  }

  private static displayAndSetDropdownPosition(cellElement: HTMLElement, dropdown: HTMLElement, cellClick: boolean) {
    dropdown.style.top = `${ElementOffset.processTop(cellElement.offsetTop)}px`;
    dropdown.style.left = `${ElementOffset.processWidth(
      cellClick ? cellElement.offsetWidth : DropdownCellOverlay.OFFSET
    )}px`;
  }

  public static display(this: EditableTableComponent, rowIndex: number, cellElement: HTMLElement) {
    const dropdownElement = this.activeOverlayElements.rowDropdown as HTMLElement;
    RowDropdownItem.update(this, dropdownElement, rowIndex);
    const cellClick = this.rowDropdownSettings.displaySettings.openMethod?.cellClick as boolean;
    RowDropdown.displayAndSetDropdownPosition(cellElement, dropdownElement, cellClick);
    Dropdown.display(dropdownElement);
    FullTableOverlayElement.display(this);
    setTimeout(() => RowDropdown.focusCell(this, rowIndex, cellElement));
  }

  public static create(etc: EditableTableComponent) {
    const dropdownElement = Dropdown.createBase();
    RowDropdownEvents.set(etc, dropdownElement);
    RowDropdownItem.setUpItems(etc, dropdownElement);
    return dropdownElement;
  }
}
