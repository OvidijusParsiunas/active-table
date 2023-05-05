import {ImportOptions, ExportOptions} from './files';

export type ImportFile = (options?: ImportOptions) => void;

export type ExportFile = (options?: ExportOptions) => void;
