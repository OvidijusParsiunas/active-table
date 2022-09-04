import {LITElementTypeConverters} from './utils/LITElementTypeConverters';
import {customElement, property, state} from 'lit/decorators.js';
import {ediTableStyle} from './editable-table-component-style';
import {TableElement} from './elements/tableElement';
import {TableContents} from './types/tableContents';
import {LitElement} from 'lit';

// spellcheck can be enabled or disabled by the user - enabled by default
// new row or column buttons can be made optional
@customElement('editable-table-component')
export class EditableTableComponent extends LitElement {
  static override styles = [ediTableStyle];

  @property({type: Array})
  contents: TableContents = [
    ['R', 'G', 'B', 'Color'],
    [255, 0, 0, 'Red'],
    [254, 0, 0, 'Red'],
    [0, 255, 0, 'Green'],
    [0, 254, 0, 'Green'],
  ];

  // check if types for this work
  @property()
  onCellUpdate: (newText: string, cellRowIndex: number, cellColumnIndex: number) => void = () => {};

  @property()
  onTableUpdate: (newTableContents: TableContents) => void = () => {};

  @property({
    type: Boolean,
    converter: LITElementTypeConverters.convertToBoolean,
  })
  areHeadersEditable = true;

  @property({
    type: Boolean,
    converter: LITElementTypeConverters.convertToBoolean,
  })
  duplicateHeadersAllowed = true;

  @state()
  // attempt to use the noAccessor property type or hasChanged property type in order to control what is being refresherd
  _header: string[] = [];

  @property({type: String})
  defaultValue = '';

  @state()
  dataElementRef: HTMLElement | null = null;

  @state()
  tableElementRef: HTMLElement | null = null;

  override render() {
    // setTimeout(() => {
    //   this.contents = [
    //     [1, 2, 3, 4],
    //     [1, 2, 3, 5],
    //   ];
    // }, 2000);
    TableElement.populate(this);
    this.onTableUpdate(this.contents);
  }

  override connectedCallback() {
    super.connectedCallback();
    TableElement.create(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'editable-table-component': EditableTableComponent;
  }
}
