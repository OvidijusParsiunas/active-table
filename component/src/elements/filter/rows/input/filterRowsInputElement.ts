import {FilterRowsInternalUtils} from '../../../../utils/outerTableComponents/filter/rows/filterRowsInternalUtils';
import {FilterRowsConfig, FilterRowsStyles} from '../../../../types/filterRows';
import {FilterRowsInternalConfig} from '../../../../types/filterInternal';
import {TableContent} from '../../../../types/tableContent';

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

  private static createElement(headerName?: string, template?: string, styles?: FilterRowsStyles) {
    const inputElement = document.createElement('input');
    inputElement.classList.add(FilterRowsInputElement.INPUT_CLASS);
    const placeholderColor = styles?.placeholder?.color || '#656565';
    inputElement.style.setProperty('--active-table-filter-placeholder-color', placeholderColor);
    Object.assign(inputElement.style, styles?.container);
    FilterRowsInputElement.setPlaceholder(inputElement, headerName, template);
    return inputElement;
  }

  public static create(config: FilterRowsInternalConfig, userConfig: FilterRowsConfig, content: TableContent) {
    // done here as resetInput is in a timeout which will cause the input text display to be delayed on startup
    const defaultHeader = FilterRowsInternalUtils.generateDefaultHeaderName(content, config.defaultColumnHeaderName);
    const input = FilterRowsInputElement.createElement(defaultHeader, config.placeholderTemplate, userConfig.styles);
    config.inputElement = input;
    return input;
  }
}
