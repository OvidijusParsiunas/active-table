import {CellDropdownHorizontalScrollFix} from './cellDropdownHorizontalScrollFix';
import {ScrollbarUtils} from '../../../utils/scrollbar/scrollbarUtils';
import {CellDropdownI} from '../../../types/cellDropdownInternal';

export class CellDropdownScrollbar {
  public static setProperties(cellDropdown: CellDropdownI) {
    const {element: dropdownEl, scrollbarPresence} = cellDropdown;
    // REF-4
    CellDropdownHorizontalScrollFix.setPropertiesIfHorizontalScrollPresent(cellDropdown);
    scrollbarPresence.vertical = ScrollbarUtils.isVerticalPresent(dropdownEl);
  }
}
