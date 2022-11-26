import {CellStateColorProperties} from './cellStateColors';
import {CSSStyle} from './cssStyle';

export type HoverableElementStyle = {defaultStyle: CSSStyle; hoverColor?: CellStateColorProperties};

export type HoverableElementStyleClient = Partial<HoverableElementStyle>;
