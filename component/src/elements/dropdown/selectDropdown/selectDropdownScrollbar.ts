import {SelectDropdownHorizontalScrollFix} from './selectDropdownHorizontalScrollFix';
import {ScrollbarUtils} from '../../../utils/scrollbar/scrollbarUtils';
import {SelectDropdownT} from '../../../types/columnDetails';

export class SelectDropdownScrollbar {
  public static setProperties(selectDropdown: SelectDropdownT) {
    const {element: dropdownEl, scrollbarPresence} = selectDropdown;
    // REF-4
    SelectDropdownHorizontalScrollFix.setPropertiesIfHorizontalScrollPresent(selectDropdown);
    scrollbarPresence.vertical = ScrollbarUtils.isVerticalPresent(dropdownEl);
  }
}
