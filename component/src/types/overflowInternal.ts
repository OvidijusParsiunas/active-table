import {Overflow} from './overflow';

export interface OverflowInternal extends Overflow {
  overflowContainer: HTMLElement;
  isWidthPercentage?: boolean;
  isHeightPercentage?: boolean;
}
