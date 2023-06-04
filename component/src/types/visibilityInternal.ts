export interface InputFilterData {
  colCells: HTMLElement[];
  filterText: string;
  isCaseSensitive: boolean;
}

export type ChunkFilterData = InputFilterData & {chunk: HTMLElement[]};

export interface FilterInternal {
  inputElement: HTMLInputElement;
  isCaseSensitive: boolean;
  elements: HTMLElement[];
  placeholderTemplate?: string;
  defaultColumnHeaderName?: string; // removed after first use
  lastRegisteredHeaderName: string;
}

// encapsulates manually togglable structures for visibility (not pagination)
// will have columsn here in the future
export interface VisibilityInternal {
  rows?: FilterInternal[];
}
