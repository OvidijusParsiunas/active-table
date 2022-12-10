import {CSSStyle} from './cssStyle';

export type CellTextValidity = {isValid: boolean; lastAppliedStyle: CSSStyle};

export type ColTextValidity = CellTextValidity[];
