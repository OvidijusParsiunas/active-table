import {StatefulCSSS} from './cssStyle';

export type CellEventColors = Required<Omit<StatefulCSSS<string>, 'click'>>;
