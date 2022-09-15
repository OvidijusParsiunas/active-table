import {OverlayElements} from '../../types/overlayElements';

export class OverlayElementsState {
  public static createNew(): OverlayElements {
    return {visibleColumnSizers: new Set()};
  }
}
