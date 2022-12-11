import {CellStateColorProperties} from './cellStateColors';
import {CellCSSStyle} from './cssStyle';

export type HoverableElementStyle = {defaultStyle: CellCSSStyle; hoverColors?: CellStateColorProperties};

export type HoverableElementStyleClient = Partial<HoverableElementStyle>;
