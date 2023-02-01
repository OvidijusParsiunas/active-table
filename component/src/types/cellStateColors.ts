import {NoDimensionCSSStyle, StatefulCSS} from './cssStyle';

export type CellStateColorProperties = Pick<NoDimensionCSSStyle, 'backgroundColor' | 'color'>;

export type CellStateColors = Required<Omit<StatefulCSS<CellStateColorProperties>, 'click'>>;

export type CellStateColorsR = Required<Omit<StatefulCSS<Required<CellStateColorProperties>>, 'click'>>;

export type DefaultCellHoverColors = Required<CellStateColorProperties>;
