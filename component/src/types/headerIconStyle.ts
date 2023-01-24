import {SVGScale} from './svgScale';

export interface HeaderIconStyle {
  // this must be a filter color - use the following tool to generate it: https://cssfilterconverter.com/
  filterColor?: string;
  // { x: 1.1, y: 1.1 } by default
  scale?: SVGScale;
}
