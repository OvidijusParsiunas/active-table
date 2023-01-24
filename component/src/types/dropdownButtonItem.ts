import {CSSStyle} from './cssStyle';

// style the element which contains the icon, e.g. change the margin and padding
interface IconContainerStyles {
  // icon container when displayed in column dropdown
  dropdown?: CSSStyle;
  // the above css is reused for header but margins can sometimes be off, hence can add any further corrections here
  headerCorrections?: CSSStyle;
}

export interface IconSettings {
  svgString: string; // full svg icon html in a string
  containerStyles?: IconContainerStyles;
}

export interface DropdownButtonItemSettings {
  text: string;
  iconSettings: IconSettings;
}
