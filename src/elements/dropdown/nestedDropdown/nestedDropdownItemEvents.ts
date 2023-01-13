import {DropdownItemHighlightUtils} from '../../../utils/color/dropdownItemHighlightUtils';
import {EditableTableComponent} from '../../../editable-table-component';
import {NestedDropdown} from './nestedDropdown';

export class NestedDropdownItemEvents {
  // prettier-ignore
  public static addEvents(etc: EditableTableComponent, element: HTMLElement) {
    element.addEventListener('mouseenter', NestedDropdown.displayAndSetDropdownPosition.bind(etc));
    element.addEventListener('mouseleave', NestedDropdown.hideDropdown);
    // this is required because when the user hovers over the item with mouse and then hovers over the nested dropdown,
    // upon hovering the item again - the above would not fire mouse enter as the dropdown is within the item element
    const itemContents = element.children[1] as HTMLElement;
    itemContents.addEventListener('mouseenter',
      DropdownItemHighlightUtils.highlightNew.bind(this, etc.activeOverlayElements, element)
    );
  }
}
