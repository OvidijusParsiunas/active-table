import {DropdownItemHighlightUtils} from '../../../utils/color/dropdownItemHighlightUtils';
import {SelectDropdownHorizontalScrollFix} from './selectDropdownHorizontalScrollFix';
import {ActiveSelectItems, SelectDropdownT} from '../../../types/columnDetails';
import {ElementVisibility} from '../../../utils/elements/elementVisibility';
import {SelectButton} from './buttons/selectButton';
import {SIDE} from '../../../types/side';

export class SelectDropdownItemEvents {
  // prettier-ignore
  public static blurItem(dropdown: SelectDropdownT, typeOfItem: keyof ActiveSelectItems, event?: MouseEvent) {
    const {activeItems, labelDetails} = dropdown;
    if (labelDetails?.colorPickerContainer) return; // do not blur if color picker open
    const itemElement = activeItems[typeOfItem] as HTMLElement;
    if (itemElement !== undefined) {
      if (typeOfItem === 'matchingWithCellText'
          || (typeOfItem === 'hovered' && itemElement !== activeItems.matchingWithCellText)) {
        itemElement.style.backgroundColor = '';
        if (!labelDetails) itemElement.style.color = '';
        delete activeItems[typeOfItem];
      }
    }
    if (event && dropdown.canAddMoreOptions) SelectButton.changeVisibility(event, dropdown);
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
        SelectDropdownHorizontalScrollFix.scrollDownFurther(dropdownElement)
      }
    }
  }

  private static highlightItem(this: Document, dropdown: SelectDropdownT, event: MouseEvent) {
    const {scrollbarPresence, activeItems, labelDetails, canAddMoreOptions, element, itemsDetails} = dropdown;
    if (labelDetails?.colorPickerContainer) return; // do not highlight new if color picker open
    // this is used for a case where an item is highlighted via arrow and then mouse hovers over another item
    if (activeItems.hovered) {
      activeItems.hovered.style.backgroundColor = '';
      if (!labelDetails) activeItems.hovered.style.color = '';
    }
    const itemElement = event.target as HTMLElement;
    const text = (itemElement.children[0] as HTMLElement).innerText;
    itemElement.style.backgroundColor = itemsDetails[text].backgroundColor;
    const dropdownElement = itemElement.parentElement as HTMLElement;
    SelectDropdownItemEvents.scrollToItem(this, itemElement, scrollbarPresence.horizontal, dropdownElement, event);
    if (itemElement === activeItems.matchingWithCellText) {
      if (!labelDetails) itemElement.style.color = 'white';
      delete activeItems.hovered;
    } else {
      if (!labelDetails) itemElement.style.backgroundColor = DropdownItemHighlightUtils.HOVER_BACKGROUND_COLOR;
      activeItems.hovered = itemElement;
    }
    if (canAddMoreOptions) SelectButton.changeVisibility(event, dropdown, element);
  }

  public static set(shadow: Document, itemElement: HTMLElement, dropdown: SelectDropdownT) {
    itemElement.onmouseenter = SelectDropdownItemEvents.highlightItem.bind(shadow, dropdown);
    itemElement.onmouseleave = SelectDropdownItemEvents.blurItem.bind(this, dropdown, 'hovered');
  }
}
