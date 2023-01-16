import {CellCSSStyle, StatefulCSSS} from './cssStyle';

export type CellStateColorProperties = Pick<CellCSSStyle, 'backgroundColor' | 'color'>;

export type CellStateColors = Required<Omit<StatefulCSSS<CellStateColorProperties>, 'click'>>;

export type CellStateColorsR = Required<Omit<StatefulCSSS<Required<CellStateColorProperties>>, 'click'>>;
