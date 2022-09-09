import {OverlayElements} from '../../types/overlayElements';

export class OverlayElementsState {
  public static createNew(): OverlayElements {
    return {columnSizers: {list: [], currentlyVisibleElements: new Set()}};
  }
}
