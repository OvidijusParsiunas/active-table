import {CELL_TYPE} from '../enums/cellType';

export type FocusedCell = {element?: HTMLElement; columnIndex?: number; rowIndex?: number; type?: CELL_TYPE};

export type CellDetails = Required<FocusedCell>;
