import {OuterContentPosition} from './outerContainer';
import {CSSStyle, StatefulCSS} from './cssStyle';
import {InterfacesUnion} from './utilityTypes';

export type ImportOverwriteOptions = {tableRowStartIndex?: number; importRowStartIndex?: number};

export type FileFormat = 'csv' | 'xls' | 'xlsx' | 'ods' | 'txt';

// by default types property will inherit from Import buttons if it is defined
export type DragAndDrop = {overlayStyle?: CSSStyle} & ImportOptions;

export interface FileButtonStyles {
  styles?: StatefulCSS;
  text?: string;
  position?: OuterContentPosition;
  order?: number;
}

export type ImportOptions = {formats?: FileFormat[]; overwriteOptions?: ImportOverwriteOptions};

export type ExportOptions = {format?: FileFormat; fileName?: string};

export type FileButton = FileButtonStyles &
  InterfacesUnion<{export: true | ExportOptions} | {import: true | ImportOptions}>;

export interface Files {
  buttons?: FileButton[];
  dragAndDrop?: boolean | DragAndDrop; // WORK - enable this by default if import button present
}
