import {CellCSSStyle} from './cssStyle';

// this is cell style that is dependant on the text within it
export type CellProcessedTextStyle = {isValid: boolean; lastAppliedStyle: CellCSSStyle};

export type ColProcessedTextStyle = CellProcessedTextStyle[];
