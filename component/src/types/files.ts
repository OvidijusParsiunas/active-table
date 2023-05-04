import {OuterContentPosition} from './outerContainer';
import {CSSStyle, StatefulCSS} from './cssStyle';
import {InterfacesUnion} from './utilityTypes';

export type ImportOverwriteOptions = {tableRowStartIndex?: number; importRowStartIndex?: number};

export type FileType = 'csv' | 'xls' | 'xlsx' | 'ods' | 'txt';

export interface DragAndDrop {
  overlayStyle?: CSSStyle;
  acceptedTypes?: FileType[]; // by default will inherit from Import buttons if it is defined
  overwriteOptions?: ImportOverwriteOptions;
}

// WORK - think StatefulCSS can be the default
export interface FileButtonStyles<T = StatefulCSS> {
  styles?: T;
  text?: string;
  position?: OuterContentPosition;
  order?: number;
}

export type ImportButton = {acceptedTypes: FileType[]; overwriteOptions?: ImportOverwriteOptions};

export type ExportButton = {type: FileType; fileName?: string};

export type FileButton = FileButtonStyles & InterfacesUnion<{export: ExportButton} | {import: ImportButton}>;

export interface Files {
  buttons?: FileButton[];
  dragAndDrop?: DragAndDrop | boolean;
}
