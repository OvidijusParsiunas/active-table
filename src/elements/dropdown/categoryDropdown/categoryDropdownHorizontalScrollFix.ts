import {CategoryDropdownT} from '../../../types/columnDetails';

// REF-4
export class CategoryDropdownHorizontalScrollFix {
  private static readonly NEW_BOTTOM_PADDING_IF_PRESENT = '12px';
  private static readonly DEFAULT_BOTTOM_PADDING_IF_PRESENT = '1px';
  private static readonly SCROLL_FURTHER_BOTTOM_PX = 14;

  private static isVerticalScrollPresent(dropdownElement: HTMLElement) {
    return dropdownElement.scrollHeight > dropdownElement.clientHeight;
  }

  private static isHorizontalScrollPresent(dropdownElement: HTMLElement) {
    return dropdownElement.scrollWidth > dropdownElement.clientWidth;
  }

  // prettier-ignore
  public static setPropertiesIfHorizontalScrollPresent(dropdown: CategoryDropdownT) {
    const {element} = dropdown;
    // fix is only needed when both horizontal and vertical scrolls are present
    if (CategoryDropdownHorizontalScrollFix.isHorizontalScrollPresent(element)
        && CategoryDropdownHorizontalScrollFix.isVerticalScrollPresent(element)) {
      dropdown.isHorizontalScrollPresent = true;
      element.style.paddingBottom = CategoryDropdownHorizontalScrollFix.NEW_BOTTOM_PADDING_IF_PRESENT;
    } else {
      dropdown.isHorizontalScrollPresent = false;
      element.style.paddingBottom = CategoryDropdownHorizontalScrollFix.DEFAULT_BOTTOM_PADDING_IF_PRESENT;
    }
  }

  public static scrollDownFurther(dropdownElement: HTMLElement) {
    dropdownElement.scrollTop += CategoryDropdownHorizontalScrollFix.SCROLL_FURTHER_BOTTOM_PX;
  }
}
