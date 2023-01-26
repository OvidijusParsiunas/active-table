import {PX} from './dimensions';

export type SelectOptions = string[];

// if backgroundColor is not provided - a random one is generated
export type LabelOptions = {text: string; backgroundColor?: string}[];

export interface CellDropdownOptionStyle {
  textColor: CSSStyleDeclaration['color'];
}

export interface CellDropdownStyle {
  width?: PX;
  paddingTop?: PX;
  paddingBottom?: PX;
  marginTop?: PX;
  marginLeft?: PX;
  textAlign?: CSSStyleDeclaration['textAlign'];
  border?: CSSStyleDeclaration['border'];
}

export interface CellDropdownT<T = LabelOptions> {
  dropdownStyle?: CellDropdownStyle;
  optionStyle?: CellDropdownOptionStyle;
  options?: T;
  canAddMoreOptions?: boolean; // by default this is true or if options is set it is false
}
