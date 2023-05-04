export type FilesInternal = {
  // always created as the user may want to trigger the importFile method without the File buttons and need this to work
  inputElementRef: HTMLInputElement;
};
