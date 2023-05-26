export interface InputFilterData {
  colCells: HTMLElement[];
  filterText: string;
  isCaseSensitive: boolean;
}

export type ChunkFilterData = InputFilterData & {chunk: HTMLElement[]};

export interface FilterRowsInternalConfig {
  inputElement: HTMLInputElement;
  activeColumnName: string;
  isCaseSensitive: boolean;
  elements: HTMLElement[];
}

// the reason why the property this is attached to is called _filterInternal instead of _filter to not confuse the user
export interface FilterInternal {
  rows?: FilterRowsInternalConfig[];
}
