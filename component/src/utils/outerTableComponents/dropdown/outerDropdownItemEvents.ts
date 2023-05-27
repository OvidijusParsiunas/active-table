import {DropdownItemHighlightUtils} from '../../color/dropdownItemHighlightUtils';
import {ActiveOverlayElements} from '../../../types/activeOverlayElements';
import {OuterDropdownItem} from './outerDropdownItem';
import {ActiveTable} from '../../../activeTable';

type ActionFunc = undefined | ((at: ActiveTable, targetText: string) => void);

type HideFunc = undefined | ((activeOverlayElements: ActiveOverlayElements, items: HTMLElement[]) => void);

export class OuterDropdownItemEvents {
  // prettier-ignore
  public static itemMouseDownCommon(this: ActiveTable, action: ActionFunc, hide: HideFunc, event: MouseEvent) {
    const {_activeOverlayElements: {outerContainerDropdown}} = this;
    const targetText = (event.target as HTMLElement).innerText;
    if (!outerContainerDropdown) return;
    action?.(this, targetText);
    const items = Array.from(outerContainerDropdown.element.children) as HTMLElement[];
    hide?.(this._activeOverlayElements, items);
    OuterDropdownItem.unsetActiveItem(outerContainerDropdown.element);
    OuterDropdownItem.setActive(items, targetText);
    DropdownItemHighlightUtils.fadeCurrentlyHighlighted(this._activeOverlayElements);  
  }
}
