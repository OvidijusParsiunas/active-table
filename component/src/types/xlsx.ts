/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ParsingOptions {
  type?: 'base64' | 'binary' | 'buffer' | 'file' | 'array' | 'string';
}

export interface WorkSheet {
  [cell: string]: any;
}

export interface WorkBook {
  Sheets: {[sheet: string]: WorkSheet};
  SheetNames: string[];
}

export declare function read(data: any, opts?: ParsingOptions): WorkBook;

export interface XLSX$Utils {
  aoa_to_sheet<T>(data: T[][]): WorkSheet;
  sheet_to_csv(worksheet: WorkSheet): string;
  book_new(): WorkBook;
  book_append_sheet(workbook: WorkBook, worksheet: WorkSheet, name?: string, roll?: boolean): void;
}

export type BookType =
  | 'xlsx'
  | 'xlsm'
  | 'xlsb'
  | 'xls'
  | 'xla'
  | 'biff8'
  | 'biff5'
  | 'biff2'
  | 'xlml'
  | 'ods'
  | 'fods'
  | 'csv'
  | 'txt'
  | 'sylk'
  | 'slk'
  | 'html'
  | 'dif'
  | 'rtf'
  | 'prn'
  | 'eth'
  | 'dbf';

export interface WritingOptions {
  bookType?: BookType;
}

export declare const utils: XLSX$Utils;

export declare function writeFile(data: WorkBook, filename: string, opts?: WritingOptions): any;
