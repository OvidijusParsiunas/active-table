export type FilesInternal = {
  // always created as the user may want to trigger the importCSV method without the CSV buttons and need this to work
  // WORK - dynamically switch the accepted extensions
  inputElementRef: HTMLInputElement;
};
