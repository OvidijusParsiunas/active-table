import {SizerMoveLimits} from './columnSizer';

export interface TableElementEventState {
  // WORK - should probably use date picker state here
  columnSizer: {
    // the reason why this is here and not in ColumnSizerT is because it is more efficient to access these values here
    selected?: HTMLElement;
    moveLimits?: SizerMoveLimits;
  };
}
