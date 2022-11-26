import {CSSStyle, StatefulCSSS} from './cssStyle';

export type CellStateColorProperties = Pick<CSSStyle, 'backgroundColor' | 'color'>;

export type CellStateColors = Required<Omit<StatefulCSSS<CellStateColorProperties>, 'click'>>;
