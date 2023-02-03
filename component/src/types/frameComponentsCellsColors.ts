import {CellStateColorsR} from './cellStateColors';

// the purpose of this interface is to facilitate hover effects
// the reason why cell and header colors are separate is because header can inherit the user set header style
export interface FrameComponentsCellsColors {
  data: CellStateColorsR;
  header: CellStateColorsR;
}
