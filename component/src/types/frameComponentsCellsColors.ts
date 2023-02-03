import {CellStateColorsR} from './cellStateColors';

// the reason why cell and header colors are separate is because header can inherit the user set header style
export interface FrameComponentsCellsColors {
  data: CellStateColorsR;
  header: CellStateColorsR;
}
