import {FrameComponentsDisplayProps, FrameComponentsStyleProps} from './frameComponents';
import {FrameComponentsCellsColors} from './frameComponentsCellsColors';

// to be used internally

// REF-22
// frame components are comprised of index column, add new column column and add new row row
export type FrameComponentsInternal = FrameComponentsStyleProps &
  Required<FrameComponentsDisplayProps> & {cellColors: FrameComponentsCellsColors};
