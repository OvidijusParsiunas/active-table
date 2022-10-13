import {CategoryDropdownHorizontalScrollFix} from './categoryDropdownHorizontalScrollFix';
import {ScrollbarUtils} from '../../../utils/scrollbar/scrollbarUtils';
import {CategoryDropdownT} from '../../../types/columnDetails';

export class CategoryDropdownScrollbar {
  public static setProperties(categoryDropdown: CategoryDropdownT) {
    const {element: dropdownEl, scrollbarPresence} = categoryDropdown;
    // REF-4
    CategoryDropdownHorizontalScrollFix.setPropertiesIfHorizontalScrollPresent(categoryDropdown);
    scrollbarPresence.vertical = ScrollbarUtils.isVerticalPresent(dropdownEl);
  }
}
