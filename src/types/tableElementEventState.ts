import {SelectedColumnSizer} from './columnSizer';

export interface TableElementEventState {
  // WORK - should probably use date picker state here
  // the reason why this is here and not in ColumnSizerT is because it is more efficient to access these values here
  selectedColumnSizer?: SelectedColumnSizer;
}
