import {DropdownItemHighlightUtils} from '../../../utils/color/dropdownItemHighlightUtils';
import {ActiveTable} from '../../../activeTable';
import {NestedDropdown} from './nestedDropdown';

export class NestedDropdownItemEvents {
  // prettier-ignore
  public static addEvents(at: ActiveTable, element: HTMLElement) {
    element.addEventListener('mouseenter', NestedDropdown.displayAndSetDropdownPosition.bind(at));
    element.addEventListener('mouseleave', NestedDropdown.hideDropdown);
    // this is required because when the user hovers over the item with mouse and then hovers over the nested dropdown,
    // upon hovering the item again - the above would not fire mouse enter as the dropdown is within the item element
    const itemContent = element.children[1] as HTMLElement;
    itemContent.addEventListener('mouseenter',
      DropdownItemHighlightUtils.highlightNew.bind(this, at.activeOverlayElements, element)
    );
  }
}
