import {CellKeyPressStateUtil} from './utils/cellKeyPressState/cellKeyPressStateUtil';
import {OverlayElementsState} from './utils/overlayElements/overlayElementsState';
import {LITElementTypeConverters} from './utils/LITElementTypeConverters';
import {TableElementEventState} from './types/tableElementEventState';
import {customElement, property, state} from 'lit/decorators.js';
import {ediTableStyle} from './editable-table-component-style';
import {ColumnResizerStyle, CSSStyle} from './types/cssStyle';
import {WindowElement} from './elements/window/windowElement';
import {CellKeyPressState} from './types/cellKeyPressState';
import {TableElement} from './elements/table/tableElement';
import {CELL_UPDATE_TYPE} from './enums/onUpdateCellType';
import {OverlayElements} from './types/overlayElements';
import {ColumnsDetailsT} from './types/columnDetails';
import {TableContents} from './types/tableContents';
import {FocusedCell} from './types/focusedCell';
import {LitElement} from 'lit';

// TO-DO
// column validation: potentially highlight what is failing validation in red and display what the problem is upon hover
// rename file name from using hyphen case to camel

// spellcheck can be enabled or disabled by the user - enabled by default
// new row or column buttons can be made optional
@customElement('editable-table-component')
export class EditableTableComponent extends LitElement {
  static override styles = [ediTableStyle];

  public static ELEMENT_TAG = 'EDITABLE-TABLE-COMPONENT';

  @property({type: Array})
  contents: TableContents = [
    ['R', 'G', 'B', 'Color'],
    [255, 0, 0, 'Red'],
    [254, 0, 0, 'Red'],
    [0, 255, 0, 'Green'],
    [0, 254, 0, 'Green'],
  ];

  // check if types for this work
  @property({converter: LITElementTypeConverters.convertToFunction})
  onCellUpdate: (newText: string, cellRowIndex: number, cellColumnIndex: number, updateType: CELL_UPDATE_TYPE) => void =
    () => {};

  @property({converter: LITElementTypeConverters.convertToFunction})
  onTableUpdate: (newTableContents: TableContents) => void = () => {};

  @property({
    type: Boolean,
    converter: LITElementTypeConverters.convertToBoolean,
  })
  areHeadersEditable = true;

  // TO-DO make sure this works when pasting into the header will be allowed
  @property({
    type: Boolean,
    converter: LITElementTypeConverters.convertToBoolean,
  })
  duplicateHeadersAllowed = true;

  // this contains all cell elements, if there is a need to access cell elements outside the context of columns
  // create an entirely new state object and access elements from there as we don't want to store all elements
  // multiple times, and use this instead for data exclusively on columns, such as width etc.
  @state()
  columnsDetails: ColumnsDetailsT = [];

  @property({type: String})
  defaultCellValue = '';

  @state()
  tableElementRef: HTMLElement | null = null;

  @state()
  tableElementEventState: TableElementEventState = {};

  @state()
  tableBodyElementRef: HTMLElement | null = null;

  @state()
  focusedCell: FocusedCell = {};

  @state()
  overlayElementsState: OverlayElements = OverlayElementsState.createNew();

  @state()
  cellKeyPressState: CellKeyPressState = CellKeyPressStateUtil.createNew();

  @property({type: Object})
  tableStyle: CSSStyle = {};

  @property({type: Object})
  headerStyle: CSSStyle = {};

  @property({type: Object})
  cellStyle: CSSStyle = {};

  // in code - columnResizer is called columnSizer for simplicity
  @property({type: Object})
  columnResizerStyle: ColumnResizerStyle = {};

  @property({type: Boolean})
  displayAddRowCell = true;

  override render() {
    this.refreshTableBodyState();
    TableElement.populateBody(this);
    this.onTableUpdate(this.contents);
  }

  private refreshTableBodyState() {
    OverlayElementsState.resetTableBodyProperties(this.overlayElementsState);
    this.tableElementEventState = {};
    this.columnsDetails = [];
  }

  override connectedCallback() {
    super.connectedCallback();
    const tableElement = TableElement.createBase(this);
    TableElement.addAuxiliaryElements(this, tableElement, this.overlayElementsState, this.areHeadersEditable);
    this.shadowRoot?.appendChild(tableElement);
    WindowElement.addEvents(this);
    this.onTableUpdate(this.contents);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'editable-table-component': EditableTableComponent;
  }
}

// if using raw javascript, this is a direction to help move away from using render
// the initial values should be fetched in connectedCallBack (or set to default) and their changes can be observed in
// MutationObserver, this would also save callback and boolean changes from having to re-render the screen

// @state()
// observer = new MutationObserver(function (mutations) {
//   mutations.forEach(function (mutation) {
//     if (mutation.attributeName === 'contents') {
//       console.log(mutation);
//       console.log('attributes changed');
//     }
//   });
// });

// override connectedCallback() {
//   super.connectedCallback();
//   this.observer.observe(this, {
//     attributes: true, //configure it to listen to attribute changes
//   });
