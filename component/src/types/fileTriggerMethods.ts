import {ImportOptions, ExportSingleFile} from './files';

export type ImportFile = (options?: ImportOptions) => void;

export type ExportFile = (options?: ExportSingleFile) => void;
