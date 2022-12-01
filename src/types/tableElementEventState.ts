import {SelectedColumnSizerT} from './columnSizer';

export interface TableElementEventState {
  // the reason why this is here and not in ColumnSizerT is because it is more efficient to access these values here
  selectedColumnSizer?: SelectedColumnSizerT;
  activeDropdownIcon?: HTMLElement;
}
