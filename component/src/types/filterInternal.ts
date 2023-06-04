export interface InputFilterData {
  colCells: HTMLElement[];
  filterText: string;
  isCaseSensitive: boolean;
}

export type ChunkFilterData = InputFilterData & {chunk: HTMLElement[]};

export interface FilterRowsInternalConfig {
  inputElement: HTMLInputElement;
  isCaseSensitive: boolean;
  elements: HTMLElement[];
  placeholderTemplate?: string;
  defaultColumnHeaderName?: string; // removed after first use
  lastRegisteredHeaderName: string;
}

// the reason why the property this is attached to is called _filterInternal instead of _filter to not confuse the user
export interface FilterInternal {
  rows?: FilterRowsInternalConfig[];
}
