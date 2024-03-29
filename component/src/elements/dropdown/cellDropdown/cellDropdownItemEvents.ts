import {DropdownItemHighlightUtils} from '../../../utils/color/dropdownItemHighlightUtils';
import {_CellDropdown, ActiveCellDropdownItems} from '../../../types/cellDropdownInternal';
import {CellDropdownHorizontalScrollFix} from './cellDropdownHorizontalScrollFix';
import {ElementVisibility} from '../../../utils/elements/elementVisibility';
import {OptionButton} from './buttons/optionButton';
import {SIDE} from '../../../types/side';

export class CellDropdownItemEvents {
  // prettier-ignore
  public static blurItem(dropdown: _CellDropdown, typeOfItem: keyof ActiveCellDropdownItems, event?: MouseEvent) {
    const {activeItems, labelDetails} = dropdown;
    if (labelDetails?.colorPickerContainer) return; // do not blur if color picker open
    const itemElement = activeItems[typeOfItem] as HTMLElement;
    if (itemElement !== undefined) {
      if (typeOfItem === 'matchingWithCellText'
          || (typeOfItem === 'hovered' && itemElement !== activeItems.matchingWithCellText)) {
        itemElement.style.backgroundColor = '';
        if (!labelDetails) itemElement.style.color = dropdown.customItemStyle?.textColor || '';
        delete activeItems[typeOfItem];
      }
    }
    if (event && dropdown.canAddMoreOptions) OptionButton.changeVisibility(event, dropdown);
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
        CellDropdownHorizontalScrollFix.scrollDownFurther(dropdownElement)
      }
    }
  }

  private static highlightItem(this: Document, dropdown: _CellDropdown, event: MouseEvent) {
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
    CellDropdownItemEvents.scrollToItem(this, itemElement, scrollbarPresence.horizontal, dropdownElement, event);
    if (itemElement === activeItems.matchingWithCellText) {
      if (!labelDetails) itemElement.style.color = 'white';
      delete activeItems.hovered;
    } else {
      if (!labelDetails) itemElement.style.backgroundColor = DropdownItemHighlightUtils.HOVER_BACKGROUND_COLOR;
      activeItems.hovered = itemElement;
    }
    if (canAddMoreOptions) OptionButton.changeVisibility(event, dropdown, element);
  }

  public static set(shadow: Document, itemElement: HTMLElement, dropdown: _CellDropdown) {
    itemElement.onmouseenter = CellDropdownItemEvents.highlightItem.bind(shadow, dropdown);
    itemElement.onmouseleave = CellDropdownItemEvents.blurItem.bind(this, dropdown, 'hovered');
  }
}
