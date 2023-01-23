export interface ColumnDropdownSettings {
  isSortAvailable?: boolean; // true by default
  isDeleteAvailable?: boolean; // true by default
  isInsertLeftAvailable?: boolean; // true by default
  // please note that when this is true and the user pastes data before this column - instead of overwriting proceding
  // columns - new ones will instead be inserted before the subject column, also if the user pastes data on it - no
  // proceeding columns will be overwritten and no new ones will be inserted
  isInsertRightAvailable?: boolean; // true by default
  isMoveAvailable?: boolean; // true by default
}
