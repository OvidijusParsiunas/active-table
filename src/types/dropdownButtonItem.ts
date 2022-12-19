import {CSSStyle} from './cssStyle';

export interface IconSettings {
  svgString: string;
  containerStyle?: CSSStyle;
}

export interface DropdownButtonItemSettings {
  text: string;
  iconSettings: IconSettings;
}
