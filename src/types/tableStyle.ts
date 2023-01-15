import {FullStringDimension} from './dimensions';
import {InterfacesUnion} from './utilityTypes';
import {CSSStyle} from './cssStyle';

type CustomTableWidth = InterfacesUnion<{width: FullStringDimension} | {maxWidth: FullStringDimension} | {}>;

export type TableStyle = CSSStyle & CustomTableWidth;
