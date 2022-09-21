import {OverlayElements} from '../../types/overlayElements';

export class OverlayElementsState {
  public static createNew(): OverlayElements {
    return {};
  }

  // table body elements are recreated after a render
  public static resetTableBodyProperties(overlayElements: OverlayElements) {
    delete overlayElements.fullTableOverlay;
  }
}
