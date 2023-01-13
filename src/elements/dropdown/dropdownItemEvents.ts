import {DropdownItemHighlightUtils} from '../../utils/color/dropdownItemHighlightUtils';
import {ActiveOverlayElements} from '../../types/activeOverlayElements';

export class DropdownItemEvents {
  // prettier-ignore
  public static addItemEvents(activeOverlayElements: ActiveOverlayElements, element: HTMLElement) {
    element.addEventListener('mouseenter',
      DropdownItemHighlightUtils.highlightNew.bind(this, activeOverlayElements, element));
    // the reason why we need mouse leave on the item as well as on mouse enter is because the mouse can leave the dropdown
    // without entering another item
    element.addEventListener('mouseleave',
      DropdownItemHighlightUtils.fadeCurrentlyHighlighted.bind(this, activeOverlayElements));
  }
}
