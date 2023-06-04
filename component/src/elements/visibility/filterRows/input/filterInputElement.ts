import {FilterInternalUtils} from '../../../../utils/outerTableComponents/filter/rows/filterInternalUtils';
import {FilterInternal} from '../../../../types/visibilityInternal';
import {Filter, FilterStyles} from '../../../../types/filter';
import {TableContent} from '../../../../types/tableContent';

export class FilterInputElement {
  private static readonly INPUT_CLASS = 'filter-rows-input';
  private static readonly TEMPLATE_VARIABLE = '{headerName}';
  private static readonly DEFAULT_PLACEHOLDER = 'Filter';
  private static readonly DEFAULT_PLACEHOLDER_TEMPLATE = `Filter ${FilterInputElement.TEMPLATE_VARIABLE}...`;

  public static setPlaceholder(inputElement: HTMLInputElement, headerName?: string, template?: string) {
    if (headerName && headerName !== '') {
      const activeTemplate = template || FilterInputElement.DEFAULT_PLACEHOLDER_TEMPLATE;
      inputElement.placeholder = activeTemplate.replace(FilterInputElement.TEMPLATE_VARIABLE, headerName);
    } else {
      inputElement.placeholder = FilterInputElement.DEFAULT_PLACEHOLDER;
    }
  }

  private static createElement(headerName?: string, template?: string, styles?: FilterStyles) {
    const inputElement = document.createElement('input');
    inputElement.classList.add(FilterInputElement.INPUT_CLASS);
    const placeholderColor = styles?.placeholder?.color || '#656565';
    inputElement.style.setProperty('--active-table-filter-placeholder-color', placeholderColor);
    Object.assign(inputElement.style, styles?.container);
    FilterInputElement.setPlaceholder(inputElement, headerName, template);
    return inputElement;
  }

  public static create(config: FilterInternal, userConfig: Filter, content: TableContent) {
    // done here as resetInput is in a timeout which will cause the input text display to be delayed on startup
    const defaultHeader = FilterInternalUtils.generateDefaultHeaderName(content, config.defaultColumnHeaderName);
    const input = FilterInputElement.createElement(defaultHeader, config.placeholderTemplate, userConfig.styles);
    config.inputElement = input;
    return input;
  }
}
