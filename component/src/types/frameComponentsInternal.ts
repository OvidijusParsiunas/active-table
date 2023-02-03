import {FrameComponentsCellsColors} from './frameComponentsCellsColors';
import {FrameComponentsStyle, IndexColumnT} from './frameComponents';

// to be used internally

interface FrameComponentsDisplayProps {
  displayAddNewRow: boolean; // true by default
  // called cells to the client, but cells internally as it is made up of multiple cells
  displayAddNewColumn: boolean; // true by default
  displayIndexColumn: IndexColumnT; // true by default
}

// REF-22
// frame components are comprised of index column, add new column column and add new row row
export type FrameComponentsInternal = FrameComponentsStyle &
  FrameComponentsDisplayProps & {cellColors: FrameComponentsCellsColors};
