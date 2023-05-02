import {FileButtonStyles, FileType, ImportOverwriteOptions} from './files';
import {InterfacesUnion} from './utilityTypes';
import {StatefulCSS} from './cssStyle';

// WORK - this may not be required
export type FileButtonStylingInternal = Required<FileButtonStyles<Required<StatefulCSS>>>;

export type FileButtonInternal = InterfacesUnion<
  | {
      export: {type: FileType; fileName: string} & FileButtonStylingInternal;
    }
  | {
      import: {acceptedTypes: FileType[]; overwriteOptions?: ImportOverwriteOptions} & FileButtonStylingInternal;
    }
>;

export type FilesInternal = {
  buttons?: FileButtonInternal[];
  inputElementRef: HTMLInputElement;
};
