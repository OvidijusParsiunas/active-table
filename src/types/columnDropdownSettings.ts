import {StatefulCSSS, CellCSSStyle} from './cssStyle';

type OverlayStyle = Omit<StatefulCSSS<Pick<CellCSSStyle, 'backgroundColor'>>, 'click'>;

export interface ColumnDropdownSettings {
  isAvailable?: boolean; // true by default
  openMethod?: {
    overlayClick?: boolean; // true by default
    cellClick?: boolean; // false by default
  };

  overlayStyle?: OverlayStyle; // use if overlayClick is set to true
}
