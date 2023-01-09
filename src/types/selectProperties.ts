import {PX} from './dimensions';

// if backgroundColor is not provided - a random one is generated
export type LabelOptions = {name: string; backgroundColor?: string}[];

export type SelectOptions = {name: string}[];

export interface SelectDropdownOptionStyle {
  textColor: CSSStyleDeclaration['color'];
}

export interface SelectDropdownStyle {
  width?: PX;
  paddingTop?: PX;
  paddingBottom?: PX;
  textAlign?: CSSStyleDeclaration['textAlign'];
  border?: CSSStyleDeclaration['border'];
}

export interface SelectProperties<T = SelectOptions> {
  dropdownStyle?: SelectDropdownStyle;
  optionStyle?: SelectDropdownOptionStyle; // WORK - should not be set for non label
  options?: T; // WORK - cursor should be pointer if set and potentially change color
}
