import {SelectDropdownHorizontalScrollFix} from './selectDropdownHorizontalScrollFix';
import {ScrollbarUtils} from '../../../utils/scrollbar/scrollbarUtils';
import {SelectDropdownI} from '../../../types/columnDetails';

export class SelectDropdownScrollbar {
  public static setProperties(selectDropdown: SelectDropdownI) {
    const {element: dropdownEl, scrollbarPresence} = selectDropdown;
    // REF-4
    SelectDropdownHorizontalScrollFix.setPropertiesIfHorizontalScrollPresent(selectDropdown);
    scrollbarPresence.vertical = ScrollbarUtils.isVerticalPresent(dropdownEl);
  }
}
