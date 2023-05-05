import {OuterContentPosition} from './outerContainer';
import {CSSStyle, StatefulCSS} from './cssStyle';
import {InterfacesUnion} from './utilityTypes';

export type ImportOverwriteOptions = {tableRowStartIndex?: number; importRowStartIndex?: number};

export type FileType = 'csv' | 'xls' | 'xlsx' | 'ods' | 'txt';

export interface DragAndDrop {
  overlayStyle?: CSSStyle;
  types?: FileType[]; // by default will inherit from Import buttons if it is defined
  overwriteOptions?: ImportOverwriteOptions;
}

export interface FileButtonStyles {
  styles?: StatefulCSS;
  text?: string;
  position?: OuterContentPosition;
  order?: number;
}

export type ImportOptions = {types?: FileType[]; overwriteOptions?: ImportOverwriteOptions};

export type ExportOptions = {type?: FileType; fileName?: string};

export type FileButton = FileButtonStyles &
  InterfacesUnion<{export: boolean | ExportOptions} | {import: boolean | ImportOptions}>;

export interface Files {
  buttons?: FileButton[];
  dragAndDrop?: DragAndDrop | boolean;
}
