import {CellDropdownHorizontalScrollFix} from './cellDropdownHorizontalScrollFix';
import {ScrollbarUtils} from '../../../utils/scrollbar/scrollbarUtils';
import {_CellDropdown} from '../../../types/cellDropdownInternal';

export class CellDropdownScrollbar {
  public static setProperties(cellDropdown: _CellDropdown) {
    const {element: dropdownEl, scrollbarPresence} = cellDropdown;
    // REF-4
    CellDropdownHorizontalScrollFix.setPropertiesIfHorizontalScrollPresent(cellDropdown);
    scrollbarPresence.vertical = ScrollbarUtils.isVerticalPresent(dropdownEl);
  }
}
