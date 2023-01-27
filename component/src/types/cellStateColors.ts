import {NoDimensionCSSStyle, StatefulCSSS} from './cssStyle';

export type CellStateColorProperties = Pick<NoDimensionCSSStyle, 'backgroundColor' | 'color'>;

export type CellStateColors = Required<Omit<StatefulCSSS<CellStateColorProperties>, 'click'>>;

export type CellStateColorsR = Required<Omit<StatefulCSSS<Required<CellStateColorProperties>>, 'click'>>;

export type DefaultCellHoverColors = Required<CellStateColorProperties>;
