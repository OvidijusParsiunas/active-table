import {CategoryDropdownHorizontalScrollFix} from './categoryDropdownHorizontalScrollFix';
import {ActiveCategoryItems, CategoryDropdownT} from '../../../types/columnDetails';
import {ElementVisibility} from '../../../utils/elements/elementVisibility';
import {CategoryDeleteButton} from './categoryDeleteButton';
import {SIDE} from '../../../types/side';

export class CategoryDropdownItemEvents {
  // prettier-ignore
  public static blurItem(dropdown: CategoryDropdownT, typeOfItem: keyof ActiveCategoryItems, event?: MouseEvent) {
    const { activeItems, scrollbarPresence } = dropdown;
    const itemElement = activeItems[typeOfItem] as HTMLElement;
    if (itemElement !== undefined) {
      if (typeOfItem === 'matchingWithCellText'
          || (typeOfItem === 'hovered' && itemElement !== activeItems.matchingWithCellText)) {
        itemElement.style.backgroundColor = '';
        delete activeItems[typeOfItem];
      }
    }
    if (event && !dropdown.staticItems) CategoryDeleteButton.changeVisibility(event, scrollbarPresence.vertical, false);
  }

  // prettier-ignore
  private static scrollToItem(shadow: Document, itemElement: HTMLElement,
      isHorizontalScrollPresent: boolean, dropdownElement: HTMLElement, event: MouseEvent) {
    // not automatically scrolling when user hovers their mouse over a partial item as it is bad UX
    if (event.isTrusted) return; 
    const visibilityDetails = ElementVisibility.isVerticallyVisibleInsideParent(itemElement, shadow);
    if (!visibilityDetails.isFullyVisible) {
      itemElement.scrollIntoView({block: 'nearest'});
      // REF-4
      if (isHorizontalScrollPresent && visibilityDetails.blockingSides.has(SIDE.BOTTOM)) {
        CategoryDropdownHorizontalScrollFix.scrollDownFurther(dropdownElement)
      }
    }
  }

  private static highlightItem(this: Document, color: string, dropdown: CategoryDropdownT, event: MouseEvent) {
    const {scrollbarPresence, activeItems} = dropdown;
    // this is used for a case where an item is highlighted via arrow and then mouse hovers over another item
    if (activeItems.hovered) activeItems.hovered.style.backgroundColor = '';
    const itemElement = event.target as HTMLElement;
    itemElement.style.backgroundColor = color;
    const dropdownElement = itemElement.parentElement as HTMLElement;
    CategoryDropdownItemEvents.scrollToItem(this, itemElement, scrollbarPresence.horizontal, dropdownElement, event);
    if (itemElement === activeItems.matchingWithCellText) {
      delete activeItems.hovered;
    } else {
      activeItems.hovered = itemElement;
    }
    if (!dropdown.staticItems) CategoryDeleteButton.changeVisibility(event, scrollbarPresence.vertical, true);
  }

  public static set(shadow: Document, itemElement: HTMLElement, color: string, dropdown: CategoryDropdownT) {
    itemElement.onmouseenter = CategoryDropdownItemEvents.highlightItem.bind(shadow, color, dropdown);
    itemElement.onmouseleave = CategoryDropdownItemEvents.blurItem.bind(this, dropdown, 'hovered');
  }
}
