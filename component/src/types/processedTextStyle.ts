import {NoDimensionCSSStyle} from './cssStyle';

// only operates on data cells and not on header cells
// this is cell style that is dependant on the text within it
export type CellProcessedTextStyle = {isValid: boolean; lastAppliedStyle: NoDimensionCSSStyle};

export type ColProcessedTextStyle = CellProcessedTextStyle[];
