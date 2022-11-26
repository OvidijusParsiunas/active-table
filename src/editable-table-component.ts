import {ColumnSettings, ColumnsSettings, ColumnsSettingsMap} from './types/columnsSettings';
import {DateCellElement} from './elements/cell/cellsWithTextDiv/dateCell/dateCellElement';
import {InitialContentsProcessing} from './utils/contents/initialContentsProcessing';
import {UserKeyEventsStateUtil} from './utils/userEventsState/userEventsStateUtil';
import {OverlayElementsState} from './utils/overlayElements/overlayElementsState';
import {FocusedElementsUtils} from './utils/focusedElements/focusedElementsUtils';
import {ColumnSettingsUtil} from './utils/columnSettings/columnSettingsUtil';
import {HoverableElementStyleClient} from './types/hoverableElementStyle';
import {LITElementTypeConverters} from './utils/LITElementTypeConverters';
import {TableDimensionsInternal} from './types/tableDimensionsInternal';
import {TableElementEventState} from './types/tableElementEventState';
import {AuxiliaryTableContent} from './types/auxiliaryTableContent';
import {customElement, property, state} from 'lit/decorators.js';
import {ediTableStyle} from './editable-table-component-style';
import {WindowElement} from './elements/window/windowElement';
import {UserKeyEventsState} from './types/userKeyEventsState';
import {UserSetColumnSizerStyle} from './types/columnSizer';
import {TableElement} from './elements/table/tableElement';
import {CELL_UPDATE_TYPE} from './enums/onUpdateCellType';
import {ParentResize} from './utils/render/parentResize';
import {TableDimensions} from './types/tableDimensions';
import {OverlayElements} from './types/overlayElements';
import {FocusedElements} from './types/focusedElements';
import {HoveredElements} from './types/hoveredElements';
import {ColumnsDetailsT} from './types/columnDetails';
import {TableContents} from './types/tableContents';
import {Browser} from './utils/browser/browser';
import {Render} from './utils/render/render';
import {CSSStyle} from './types/cssStyle';
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
  // TO-DO cannot insert a header row when there is content already present - maybe don't need to?
  // TO-DO cannot delete header row - maybe don't need to?
  contents: TableContents = [
    ['R', 'G', 'B', 'Color'],
    [255, 0, 0, 'Red'],
    [254, 0, 0, 'Red'],
    [0, 255, 0, 'Green'],
    [0, 254, 0, 'Green'],
  ];

  // REF-20
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

  @property({
    type: Boolean,
    converter: LITElementTypeConverters.convertToBoolean,
  })
  displayAddRowCell = true;

  @property({
    type: Boolean,
    converter: LITElementTypeConverters.convertToBoolean,
  })
  displayAddColumnCell = true; // called cells to the client, but cells internally as it is made up of multiple cells

  // TO-DO - there should still be a dropdown and only insert left/right and remove the column options
  // column index should start count at the header row
  @property({
    type: Boolean,
    converter: LITElementTypeConverters.convertToBoolean,
  })
  headerPresent = true;

  @property({
    type: Boolean,
    converter: LITElementTypeConverters.convertToBoolean,
  })
  displayIndexColumn = true;

  // TO-DO allow the clien to update the table cells without re-renderdering the whole table
  // @property({
  //   type: Boolean,
  //   converter: LITElementTypeConverters.convertToBoolean,
  //   // hasChanged(newVal: string, oldVal: string) {
  //   //   console.log(newVal);
  //   //   return false;
  //   // },
  // })
  // updateCell = true;

  @property({type: Array<ColumnSettings>})
  columnsSettings: ColumnsSettings = [];

  @state()
  columnsSettingsInternal: ColumnsSettingsMap = {};

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
  addRowCellElementRef: HTMLElement | null = null;

  // the reason why keeping ref of all the add column cells and not column index cells is because this can be toggled
  @state()
  addColumnCellsElementsRef: HTMLElement[] = [];

  @state()
  columnGroupRef: HTMLElement | null = null;

  @state()
  focusedElements: FocusedElements = FocusedElementsUtils.createEmpty();

  @state()
  hoveredElements: HoveredElements = {};

  @state()
  overlayElementsState: OverlayElements = OverlayElementsState.createNew();

  @state()
  userKeyEventsState: UserKeyEventsState = UserKeyEventsStateUtil.createNew();

  // REF-15 - to be used by the client
  // TO-DO height - keep in mind that by resizing columns - the height can change
  @property({type: Object})
  tableDimensions: TableDimensions = {};

  // REF-15 - to be used internally
  @state()
  tableDimensionsInternal: TableDimensionsInternal = {recordedParentWidth: 0};

  @state()
  categoryDropdownContainer: HTMLElement | null = null;

  @property({type: Object})
  tableStyle: CSSStyle = {};

  @property({type: Object})
  header: HoverableElementStyleClient = {};

  @property({type: Object})
  cellStyle: CSSStyle = {};

  // auxiliary content is comprised of index column, add new column column and add new row row
  // Not using AuxiliaryTableContentColors.CELL_COLORS for default value as the '' values will stop logical OR operators
  @property({type: Object})
  auxiliaryTableContent: AuxiliaryTableContent = {};

  // columnResizer for the client - columnSizer in code for efficiency
  @property({type: Object})
  columnResizerStyle: UserSetColumnSizerStyle = {};

  // CAUTION-4
  override render() {
    Render.renderTable(this);
    this.onTableUpdate(this.contents);
    new ResizeObserver(ParentResize.resizeCallback.bind(this)).observe(this.parentElement as HTMLElement);
  }

  private onConnect() {
    // REF-14
    super.connectedCallback();
    const tableElement = TableElement.createInfrastructureElements(this);
    TableElement.addOverlayElements(this, tableElement, this.overlayElementsState, this.areHeadersEditable);
    this.shadowRoot?.appendChild(tableElement);
    InitialContentsProcessing.preProcess(this.contents, this.defaultCellValue);
    WindowElement.setEvents(this);
    this.onTableUpdate(this.contents);
    DateCellElement.populateDefaultDateTypes();
    this.columnsSettingsInternal = ColumnSettingsUtil.createInternalMap(this.columnsSettings);
  }

  override connectedCallback() {
    // REF-14
    if (Browser.IS_FIREFOX) {
      setTimeout(() => this.onConnect());
    } else {
      this.onConnect();
    }
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
