import {FullStringDimension} from './dimensions';
import {StatefulCSS} from './cssStyle';

export interface RootCell {
  width?: FullStringDimension;
  styles?: StatefulCSS;
  text?: string;
}
