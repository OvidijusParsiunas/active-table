import {FileType, ImportOverwriteOptions} from './files';

export type ImportFile = (acceptedTypes: FileType[], options?: ImportOverwriteOptions) => void;

export type ExportFile = (type: FileType, fileName?: string) => void;
