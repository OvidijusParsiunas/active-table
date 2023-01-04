import {AuxiliaryTableContentColors} from '../../../utils/auxiliaryTableContent/auxiliaryTableContentColors';
import {DropdownItemHighlightUtils} from '../../../utils/color/dropdownItemHighlightUtils';
import {FullTableOverlayElement} from '../../fullTableOverlay/fullTableOverlayElement';
import {FocusedCellUtils} from '../../../utils/focusedElements/focusedCellUtils';
import {ElementVisibility} from '../../../utils/elements/elementVisibility';
import {CellHighlightUtils} from '../../../utils/color/cellHighlightUtils';
import {EditableTableComponent} from '../../../editable-table-component';
import {ElementOffset} from '../../../utils/elements/elementOffset';
import {Browser} from '../../../utils/browser/browser';
import {RowDropdownEvents} from './rowDropdownEvents';
import {TableElement} from '../../table/tableElement';
import {RowDropdownItem} from './rowDropdownItem';
import {SIDE} from '../../../types/side';
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
    const initialTopValue = `${ElementOffset.processTop(cellElement.offsetTop)}px`;
    dropdown.style.top = initialTopValue;
    dropdown.style.left = `${ElementOffset.processWidth(cellClick ? cellElement.offsetWidth : 5)}px`;
    // needs to be displayed here to evalute if in view port
    Dropdown.display(dropdown);
    const visibilityDetails = ElementVisibility.getDetailsInWindow(dropdown);
    if (!visibilityDetails.isFullyVisible && visibilityDetails.blockingSides.has(SIDE.BOTTOM)) {
      const tableTopOffset = (dropdown.parentElement as HTMLElement).offsetTop + TableElement.BORDER_DIMENSIONS.topWidth;
      let newTopValue = window.pageYOffset + window.innerHeight - tableTopOffset - dropdown.offsetHeight;
      if (Browser.IS_FIREFOX) newTopValue += TableElement.BORDER_DIMENSIONS.topWidth;
      dropdown.style.top = `${newTopValue}px`;
      const visibilityDetails = ElementVisibility.getDetailsInWindow(dropdown);
      if (!visibilityDetails.isFullyVisible && visibilityDetails.blockingSides.has(SIDE.TOP)) {
        dropdown.style.top = initialTopValue;
      }
    }
  }

  public static display(this: EditableTableComponent, rowIndex: number, cellElement: HTMLElement) {
    const dropdownElement = this.activeOverlayElements.rowDropdown as HTMLElement;
    RowDropdownItem.update(this, dropdownElement, rowIndex);
    const cellClick = this.rowDropdownSettings.displaySettings.openMethod?.cellClick as boolean;
    RowDropdown.displayAndSetDropdownPosition(cellElement, dropdownElement, cellClick);
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
