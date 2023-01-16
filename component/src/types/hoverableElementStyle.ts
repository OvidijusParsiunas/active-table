import {CellStateColorProperties} from './cellStateColors';
import {CellCSSStyle} from './cssStyle';

export type HoverableElementStyle = {default: CellCSSStyle; hoverColors?: CellStateColorProperties};

export type HoverableElementStyleClient = Partial<HoverableElementStyle>;
