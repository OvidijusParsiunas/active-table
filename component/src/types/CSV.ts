import {DragAndDrop, FileButtonStyles, ImportOverwriteOptions} from './files';

export interface CSVButtons {
  import?: (FileButtonStyles & {overwriteOptions?: ImportOverwriteOptions}) | boolean;
  export?: (FileButtonStyles & {fileName?: string}) | boolean;
}

export interface CSV {
  buttons?: CSVButtons;
  dragAndDrop?: DragAndDrop | boolean;
}
