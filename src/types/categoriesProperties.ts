import {PX} from './dimensions';

export type CategoriesOptions = {name: string; backgroundColor?: string}[];

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

export interface CategoriesProperties {
  dropdownStyle?: CategoriesDropdownStyle;
  optionStyle?: CategoriesDropdownOptionStyle;
  options?: CategoriesOptions;
}

export type Categories = CategoriesProperties;
