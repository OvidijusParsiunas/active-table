import {PX} from './dimensions';

export interface CategoriesDropdownStyle {
  width?: PX;
  paddingTop?: PX;
  paddingBottom?: PX;
  textAlign?: CSSStyleDeclaration['textAlign'];
  border?: CSSStyleDeclaration['border'];
}

export type CategoriesOptions = {name: string; backgroundColor?: string}[];

export interface CategoriesProperties {
  dropdownStyle?: CategoriesDropdownStyle;
  options?: CategoriesOptions;
}

export type Categories = CategoriesProperties;
