import {HoverableElementStyleClient} from './hoverableElementStyle';

// auxiliary content is comprised of index column, add new column column and add new row row
export interface AuxiliaryTableContent {
  style?: HoverableElementStyleClient;
  inheritHeaderStyle?: boolean;
}
