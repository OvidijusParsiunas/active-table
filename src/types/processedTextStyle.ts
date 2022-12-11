import {CSSStyle} from './cssStyle';

// this is cell style that is dependant on the text within it
export type CellProcessedTextStyle = {isValid: boolean; lastAppliedStyle: CSSStyle};

export type ColProcessedTextStyle = CellProcessedTextStyle[];
