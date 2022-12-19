import {CSSStyle} from './cssStyle';

export interface IconSettings {
  svgString: string; // full svg icon html in a string
  containerStyle?: CSSStyle; // style the element which contains the icon, e.g. change the margin and padding
}

export interface DropdownButtonItemSettings {
  text: string;
  iconSettings: IconSettings;
}
