import {StatefulCSS, NoDimensionCSSStyle} from './cssStyle';

export type DropdownCellOverlayStyles = Omit<StatefulCSS<Pick<NoDimensionCSSStyle, 'backgroundColor'>>, 'click'>;

export interface DropdownDisplaySettings {
  isAvailable?: boolean; // true by default
  openMethod?: {
    overlayClick?: boolean; // false by default
    cellClick?: boolean; // true by default
  };
  overlayStyles?: DropdownCellOverlayStyles; // use if overlayClick is set to true
}
