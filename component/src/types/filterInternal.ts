export interface FilterRowsInternalConfig {
  inputElement: HTMLInputElement;
  activeColumnName: string;
  isCaseSensitive: boolean;
}

// the reason why the property this is attached to is called _filterInternal instead of _filter to not confuse the user
export interface FilterInternal {
  rows?: FilterRowsInternalConfig[]; // WORK - to be used when editing the table and filters with the same name
}
