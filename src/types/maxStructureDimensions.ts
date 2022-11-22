export interface MaxStructureDimensions {
  maxColumns?: number;
  // TO-DO this may need to be changed to maxDataRows as the index will column will not display anything for the header row
  // when headerPresent is set to true - count starts after header, when headerPresent is false - count starts with it
  maxRows?: number;
}
