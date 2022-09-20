import {OverlayElements} from '../../types/overlayElements';

export class OverlayElementsState {
  public static createNew(): OverlayElements {
    return {visibleColumnSizers: new Set()};
  }

  // table body elements are recreated after a render
  public static resetTableBodyProperties(overlayElements: OverlayElements) {
    delete overlayElements.fullTableOverlay;
    overlayElements.visibleColumnSizers = new Set();
  }
}
