import {HoverableElementStyleClient} from './hoverableElementStyle';

export interface AuxiliaryTableContentDisplayProps {
  displayAddRowCell?: boolean; // true by default
  // called cells to the client, but cells internally as it is made up of multiple cells
  displayAddColumnCell?: boolean; // true by default
  displayIndexColumn?: boolean; // true by default
}

export interface AuxiliaryTableContentGenericProps {
  styleProps?: HoverableElementStyleClient;
  inheritHeaderStyle?: boolean;
}

// REF-22
// auxiliary content is comprised of index column, add new column column and add new row row
// to be used by the client
export type AuxiliaryTableContent = AuxiliaryTableContentGenericProps & AuxiliaryTableContentDisplayProps;
