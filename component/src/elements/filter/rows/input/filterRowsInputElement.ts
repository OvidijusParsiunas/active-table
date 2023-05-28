import {FilterRowsInternalUtils} from '../../../../utils/outerTableComponents/filter/rows/filterRowsInternalUtils';
import {FilterRowsInternalConfig} from '../../../../types/filterInternal';
import {TableContent} from '../../../../types/tableContent';

// WORK - filter when header is data too
// WORK - ability to filter by header name or by column index
export class FilterRowsInputElement {
  private static readonly INPUT_CLASS = 'filter-rows-input';
  private static readonly TEMPLATE_VARIABLE = '{headerName}';
  private static readonly DEFAULT_PLACEHOLDER = 'Filter';
  private static readonly DEFAULT_PLACEHOLDER_TEMPLATE = `Filter ${FilterRowsInputElement.TEMPLATE_VARIABLE}...`;

  public static setPlaceholder(inputElement: HTMLInputElement, headerName?: string, template?: string) {
    if (headerName && headerName !== '') {
      const activeTemplate = template || FilterRowsInputElement.DEFAULT_PLACEHOLDER_TEMPLATE;
      inputElement.placeholder = activeTemplate.replace(FilterRowsInputElement.TEMPLATE_VARIABLE, headerName);
    } else {
      inputElement.placeholder = FilterRowsInputElement.DEFAULT_PLACEHOLDER;
    }
  }

  private static createElement(headerName?: string, template?: string) {
    const inputElement = document.createElement('input');
    inputElement.classList.add(FilterRowsInputElement.INPUT_CLASS);
    FilterRowsInputElement.setPlaceholder(inputElement, headerName, template);
    inputElement.style.order = '1';
    return inputElement;
  }

  public static create(config: FilterRowsInternalConfig, content: TableContent) {
    // done here as resetInput is in a timeout which will cause the input text display to be delayed on startup
    const defaultHeader = FilterRowsInternalUtils.generateDefaultHeaderName(content, config.defaultColumnHeaderName);
    const inputElement = FilterRowsInputElement.createElement(defaultHeader, config.placeholderTemplate);
    config.inputElement = inputElement;
    return inputElement;
  }
}
