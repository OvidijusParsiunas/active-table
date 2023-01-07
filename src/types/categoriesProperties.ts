import {PX} from './dimensions';

// if backgroundColor is not provided - a random one is generated
export type CategoriesOptions = {name: string; backgroundColor?: string}[];

export type SelectOptions = {name: string}[];

export interface CategoriesDropdownOptionStyle {
  textColor: CSSStyleDeclaration['color'];
}

export interface CategoriesDropdownStyle {
  width?: PX;
  paddingTop?: PX;
  paddingBottom?: PX;
  textAlign?: CSSStyleDeclaration['textAlign'];
  border?: CSSStyleDeclaration['border'];
}

export interface SelectProperties<T = SelectOptions> {
  dropdownStyle?: CategoriesDropdownStyle;
  optionStyle?: CategoriesDropdownOptionStyle;
  options?: T;
}
