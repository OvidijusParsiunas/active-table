import {CategoryDropdownT} from '../../../types/columnDetails';

// REF-4
export class CategoryDropdownHorizontalScroll {
  private static readonly NEW_BOTTOM_PADDING_IF_PRESENT = '12px';
  private static readonly DEFAULT_BOTTOM_PADDING_IF_PRESENT = '1px';
  private static readonly SCROLL_FURTHER_BOTTOM_PX = 14;

  private static isPresent(dropdownElement: HTMLElement) {
    return dropdownElement.scrollWidth > dropdownElement.clientWidth;
  }

  public static setPropertiesIfHorizontalScrollPresent(dropdown: CategoryDropdownT) {
    const {element, isHorizontalScrollPresent} = dropdown;
    if (CategoryDropdownHorizontalScroll.isPresent(element) && !isHorizontalScrollPresent) {
      dropdown.isHorizontalScrollPresent = true;
      element.style.paddingBottom = CategoryDropdownHorizontalScroll.NEW_BOTTOM_PADDING_IF_PRESENT;
    } else {
      element.style.paddingBottom = CategoryDropdownHorizontalScroll.DEFAULT_BOTTOM_PADDING_IF_PRESENT;
    }
  }

  public static scrollDownFurther(dropdownElement: HTMLElement) {
    dropdownElement.scrollTop += CategoryDropdownHorizontalScroll.SCROLL_FURTHER_BOTTOM_PX;
  }
}
