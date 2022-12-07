import {ColumnTypeInternal} from '../../types/columnTypeInternal';
import {DEFAULT_COLUMN_TYPES} from '../../enums/columnType';
import {CellElement} from '../../elements/cell/cellElement';
import {CellText} from '../../types/tableContents';

export class Validation {
  // if cell has a custom text color - this will set it back to that
  public static readonly DEFAULT_TEXT_COLOR = '';
  private static readonly INVALID_TEXT_COLOR = 'grey';

  private static readonly DEFAULT_TYPES_REGEX = {
    [DEFAULT_COLUMN_TYPES.CURRENCY]: new RegExp(
      // eslint-disable-next-line max-len
      /^(([$€£¥]\s*?-?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?)|(-?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?\s*?[$€£¥]))$/
    ),
    // \s*? is used to allow spaces between symbols
    [DEFAULT_COLUMN_TYPES.DATE_DMY]: new RegExp(
      /^(0?[1-9]|[12][0-9]|3[01])\s*?[/-]\s*?(0?[1-9]|1[012])\s*?[/-]\s*?\d{4}$/
    ),
    [DEFAULT_COLUMN_TYPES.DATE_MDY]: new RegExp(
      /^(0?[1-9]|1[012])\s*?[/-]\s*?(0?[1-9]|[12][0-9]|3[01])\s*?[/-]\s*?\d{4}$/
    ),
  };

  public static readonly DEFAULT_TYPES_FUNCTIONALITY: {[key in DEFAULT_COLUMN_TYPES]?: ColumnTypeInternal['validation']} =
    {
      [DEFAULT_COLUMN_TYPES.CURRENCY]: (cellText: string) => !isNaN(cellText as unknown as number),
      [DEFAULT_COLUMN_TYPES.CURRENCY]: (cellText: string) =>
        Validation.DEFAULT_TYPES_REGEX[DEFAULT_COLUMN_TYPES.CURRENCY].test(cellText as string),
      [DEFAULT_COLUMN_TYPES.DATE_DMY]: (cellText: string) =>
        Validation.DEFAULT_TYPES_REGEX[DEFAULT_COLUMN_TYPES.DATE_DMY].test(cellText as string),
      [DEFAULT_COLUMN_TYPES.DATE_MDY]: (cellText: string) =>
        Validation.DEFAULT_TYPES_REGEX[DEFAULT_COLUMN_TYPES.DATE_MDY].test(cellText as string),
    };

  public static setCategoriesValidation(type: ColumnTypeInternal, isDefaultTextRemovable: boolean, defaultText: CellText) {
    if (!type.categories?.options) return;
    const optionsMap = new Set<CellText>(type.categories.options.map((option) => option.name));
    type.validation = (cellText: string) => {
      return !!optionsMap.has(cellText) || (!isDefaultTextRemovable && cellText === defaultText);
    };
  }

  public static setStyleBasedOnValidity(textContainerElement: HTMLElement, validation: ColumnTypeInternal['validation']) {
    textContainerElement.style.color = validation?.(CellElement.getText(textContainerElement))
      ? Validation.DEFAULT_TEXT_COLOR
      : Validation.INVALID_TEXT_COLOR;
  }
}
