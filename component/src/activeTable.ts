import {CustomColumnsSettings, CustomColumnSettings, DimensionalCSSStyle} from './types/columnsSettings';
import {PaginationInternalUtils} from './utils/outerTableComponents/pagination/paginationInternalUtils';
import {ColumnUpdateDetails, OnCellUpdate, OnColumnsUpdate, OnContentUpdate} from './types/onUpdate';
import {ActiveOverlayElementsUtils} from './utils/activeOverlayElements/activeOverlayElementsUtils';
import {FileExportButtonEvents} from './elements/files/buttons/exportButton/fileExportButtonEvents';
import {FileImportButtonEvents} from './elements/files/buttons/importButton/fileImportButtonEvents';
import {FrameComponentsInternalUtils} from './utils/frameComponents/frameComponentsInternalUtils';
import {RowDropdownSettingsUtil} from './elements/dropdown/rowDropdown/rowDropdownSettingsUtil';
import {ProgrammaticCellUpdate} from './utils/programmaticUpdates/programmaticCellUpdate';
import {OuterTableComponents} from './utils/outerTableComponents/outerTableComponents';
import {LITElementTypeConverters} from './utils/webComponent/LITElementTypeConverters';
import {UserKeyEventsStateUtils} from './utils/userEventsState/userEventsStateUtils';
import {WebComponentStyleUtils} from './utils/webComponent/webComponentStyleUtils';
import {InitialContentProcessing} from './utils/content/initialContentProcessing';
import {FocusedElementsUtils} from './utils/focusedElements/focusedElementsUtils';
import {TableDimensionsUtils} from './utils/tableDimensions/tableDimensionsUtils';
import {FilesUtils} from './utils/outerTableComponents/files/filesInternalUtils';
import {ColumnSettingsUtils} from './utils/columnSettings/columnSettingsUtils';
import {ColumnDropdownSettingsDefault} from './types/columnDropdownSettings';
import {ColumnDetailsUtils} from './utils/columnDetails/columnDetailsUtils';
import {FrameComponentsStyles, IndexColumnT} from './types/frameComponents';
import {DefaultColumnTypes} from './utils/columnType/defaultColumnTypes';
import {FrameComponentsInternal} from './types/frameComponentsInternal';
import {RowDropdownCellOverlays} from './types/rowDropdownCellOverlays';
import {ProgrammaticCellUpdateT} from './types/programmaticCellUpdateT';
import {DefaultColumnsSettings} from './types/columnsSettingsDefault';
import {StickyPropsUtils} from './utils/stickyProps/stickyPropsUtils';
import {ActiveOverlayElements} from './types/activeOverlayElements';
import {CellHighlightUtils} from './utils/color/cellHighlightUtils';
import {ColumnsSettingsMap} from './types/columnsSettingsInternal';
import {ExportFile, ImportFile} from './types/fileTriggerMethods';
import {ExportOptions, Files, ImportOptions} from './types/files';
import {customElement, property, state} from 'lit/decorators.js';
import {RowDropdownSettings} from './types/rowDropdownSettings';
import {StripedRowsInternal} from './types/stripedRowsInternal';
import {DEFAULT_COLUMN_TYPES} from './enums/defaultColumnTypes';
import {DefaultCellHoverColors} from './types/cellStateColors';
import {WindowElement} from './elements/window/windowElement';
import {UserKeyEventsState} from './types/userKeyEventsState';
import {PaginationInternal} from './types/paginationInternal';
import {LabelColorUtils} from './utils/color/labelColorUtils';
import {OverflowUtils} from './utils/overflow/overflowUtils';
import {RowHoverEvents} from './utils/rows/rowHoverEvents';
import {TableElement} from './elements/table/tableElement';
import {ColumnType, ColumnTypes} from './types/columnType';
import {OverflowInternal} from './types/overflowInternal';
import {ParentResize} from './utils/render/parentResize';
import {ColumnResizerColors} from './types/columnSizer';
import {TableDimensions} from './types/tableDimensions';
import {FocusedElements} from './types/focusedElements';
import {HoveredElements} from './types/hoveredElements';
import {HeaderIconStyle} from './types/headerIconStyle';
import {HoverableStyles} from './types/hoverableStyles';
import {ColumnsDetailsT} from './types/columnDetails';
import {RowHoverStyles} from './types/rowHoverStyles';
import {GlobalItemColors} from './types/itemToColor';
import {StripedRows} from './utils/rows/stripedRows';
import {activeTableStyle} from './activeTableStyle';
import {FilesInternal} from './types/filesInternal';
import {StripedRowsT} from './types/stripedRows';
import {StickyProps} from './types/stickyProps';
import {Browser} from './utils/browser/browser';
import {LitElement, PropertyValues} from 'lit';
import {CellText} from './types/tableContent';
import {TableStyle} from './types/tableStyle';
import {Pagination} from './types/pagination';
import {Render} from './utils/render/render';
import {Overflow} from './types/overflow';

// TO-DO - add comments on type properties
@customElement('active-table')
export class ActiveTable extends LitElement {
  @property({type: Function})
  getContent: () => (number | string)[][] = () => JSON.parse(JSON.stringify(this.content));

  @property({type: Function})
  getColumnsDetails: () => ColumnUpdateDetails[] = () => ColumnDetailsUtils.getAllColumnsDetails(this._columnsDetails);

  @property({type: Function})
  updateCell: (update: ProgrammaticCellUpdateT) => void = (update: ProgrammaticCellUpdateT) => {
    ProgrammaticCellUpdate.updateText(this, update);
  };

  // can only be activated by a user action - such as a button click
  @property({type: Function})
  importFile: ImportFile = (options?: ImportOptions) => FileImportButtonEvents.triggerImportPrompt(this, options);

  @property({type: Function})
  exportFile: ExportFile = (options?: ExportOptions) => FileExportButtonEvents.export(this, options);

  // REF-20
  @property({converter: LITElementTypeConverters.convertToFunction})
  onCellUpdate: OnCellUpdate = () => {};

  @property({converter: LITElementTypeConverters.convertToFunction})
  onContentUpdate: OnContentUpdate = () => {};

  @property({converter: LITElementTypeConverters.convertToFunction})
  onColumnsUpdate: OnColumnsUpdate = () => {};

  @property({type: Array})
  content: (number | string)[][] = [
    // ['Planet', 'Diameter', 'Mass', 'Moons', 'Density'],
    // ['Earth', 12756, 5.97, 1, 5514],
    // ['Mars', 6792, 0.642, 2, 3934],
    // ['Jupiter', 142984, 1898, 79, 1326],
    // ['Saturn', 120536, 568, 82, 687],
    // ['Neptune', 49528, 102, 14, 1638],
  ];

  @property({type: Object})
  tableStyle: TableStyle = {};

  @property({
    type: Boolean,
    converter: LITElementTypeConverters.convertToBoolean,
  })
  allowDuplicateHeaders = true;

  @property({
    type: Boolean,
    converter: LITElementTypeConverters.convertToBoolean,
  })
  displayHeaderIcons = true;

  @property({
    type: Boolean,
    converter: LITElementTypeConverters.convertToBoolean,
  })
  spellCheck = false;

  // Bug - header row events do not work in Firefox when there are 21 rows or more
  // A question has been raised in the following link:
  // https://stackoverflow.com/questions/75103886/firefox-table-sticky-header-row-events-not-firing
  @property({
    type: Boolean,
    converter: LITElementTypeConverters.convertToBoolean,
  })
  stickyHeader?: boolean;

  @property({type: Array<CustomColumnSettings>})
  customColumnsSettings: CustomColumnsSettings = [];

  @property({type: Object})
  rowHoverStyles?: RowHoverStyles;

  // when true - the table automatically holds an unlimited size via table-controlled-width class (dynamic table)
  // this property is not used internally and is being set/used in tableDimensions as it is overriden when resizing
  @property({
    type: Boolean,
    converter: LITElementTypeConverters.convertToBoolean,
  })
  preserveNarrowColumns = true;

  @property({type: Number})
  maxColumns?: number;

  @property({type: Number})
  maxRows?: number;

  @property({
    type: Boolean,
    converter: LITElementTypeConverters.convertToBoolean,
  })
  displayAddNewRow = true;

  @property({
    type: Boolean,
    converter: LITElementTypeConverters.convertToBoolean,
  })
  displayAddNewColumn = true;

  @property({type: Object})
  displayIndexColumn: IndexColumnT = {wrapIndexCellText: false};

  // REF-22 - to be used by the client
  // frame components are comprised of index column, add new column column and add new row row
  @property({type: Object})
  frameComponentsStyles: FrameComponentsStyles = {};

  // this affects the column index and pagination
  @property({
    type: Boolean,
    converter: LITElementTypeConverters.convertToBoolean,
  })
  dataStartsAtHeader = false;

  // called columnResizer for the client - columnSizer in the code
  @property({type: Object})
  columnResizerColors: ColumnResizerColors = {};

  @property({type: Object})
  rowDropdown: RowDropdownSettings = {displaySettings: {isAvailable: true, openMethod: {cellClick: true}}};

  // if using pagination with user defined rowsPerPageSelect, the options need to have an even number or otherwise
  // two rows could have same color (as rows are hidden and not removed)
  @property({type: Object})
  stripedRows?: StripedRowsT | boolean;

  @property({type: Object})
  overflow?: Overflow;

  @property({type: String})
  defaultText?: CellText;

  @property({
    type: Boolean,
    converter: LITElementTypeConverters.convertToBoolean,
  })
  isDefaultTextRemovable?: boolean;

  @property({type: Object})
  cellStyle?: DimensionalCSSStyle;

  @property({
    type: Boolean,
    converter: LITElementTypeConverters.convertToBoolean,
  })
  isCellTextEditable?: boolean;

  @property({type: Object})
  headerStyles?: HoverableStyles;

  @property({
    type: Boolean,
    converter: LITElementTypeConverters.convertToBoolean,
  })
  isHeaderTextEditable?: boolean; // uses isCellTextEditable by default

  @property({type: Object})
  headerIconStyle?: HeaderIconStyle;

  // if no width is defined this will simply just not show the sizer
  @property({
    type: Boolean,
    converter: LITElementTypeConverters.convertToBoolean,
  })
  isColumnResizable?: boolean;

  @property({type: Array<DEFAULT_COLUMN_TYPES>})
  availableDefaultColumnTypes?: DEFAULT_COLUMN_TYPES[]; // this will reduce the default types to ones included here

  @property({type: Array<ColumnType>})
  customColumnTypes?: ColumnTypes; // additional custom column types

  // If not provided defaultColumnTypeName will default to first of the following:
  // First type to not have validation/First available type/'Text'
  @property({type: String})
  defaultColumnTypeName?: string;

  @property({type: Object})
  columnDropdown?: ColumnDropdownSettingsDefault;

  @property({type: Object})
  pagination?: Pagination | boolean;

  @property({type: Object})
  files?: Files;

  @property({type: String})
  auxiliaryStyle?: string;

  // setting header to true if above is undefined and vertical overflow is present
  // (using object to be able to set values without re-rendering the component)
  @state()
  _stickyProps: StickyProps = {header: false};

  // REF-21
  @state()
  _defaultColumnsSettings: DefaultColumnsSettings = {} as DefaultColumnsSettings; // populated in setDefaultColumnsSettings

  @state()
  _customColumnsSettings: ColumnsSettingsMap = {};

  // this contains all cell elements, if there is a need to access cell elements outside the context of columns
  // create an entirely new state object and access elements from there as we don't want to store all elements
  // multiple times, and use this instead for data exclusively on columns, such as width at.
  @state()
  _columnsDetails: ColumnsDetailsT = [];

  @state()
  _tableElementRef?: HTMLElement;

  @state()
  _tableBodyElementRef?: HTMLElement;

  @state()
  _addRowCellElementRef?: HTMLElement;

  // the reason why keeping ref of all the add column cells and not column index cells is because this can be toggled
  @state()
  _addColumnCellsElementsRef: HTMLElement[] = [];

  @state()
  _focusedElements: FocusedElements = FocusedElementsUtils.createEmpty();

  @state()
  _hoveredElements: HoveredElements = {};

  @state()
  _activeOverlayElements: ActiveOverlayElements = ActiveOverlayElementsUtils.createNew();

  @state()
  _userKeyEventsState: UserKeyEventsState = UserKeyEventsStateUtils.createNew();

  @state()
  _tableDimensions: TableDimensions = TableDimensionsUtils.getDefault();

  @state()
  _cellDropdownContainer?: HTMLElement;

  @state()
  _globalItemColors: GlobalItemColors = LabelColorUtils.generateGlobalItemColors();

  @state()
  _defaultCellHoverColors: DefaultCellHoverColors = CellHighlightUtils.getDefaultHoverProperties();

  // REF-22 - to be used internally
  @state()
  _frameComponents: FrameComponentsInternal = FrameComponentsInternalUtils.getDefault();

  // column dropdown overlays are stored inside ColumnDetailsT columnDropdownCellOverlay
  @state()
  _rowDropdownCellOverlays: RowDropdownCellOverlays = [];

  @state()
  _stripedRows?: StripedRowsInternal;

  @state()
  _overflow?: OverflowInternal;

  // cannot be used as an indicator for pagination as this is always defined
  @state()
  _pagination: PaginationInternal = PaginationInternalUtils.getDefault();

  @state()
  _files: FilesInternal = FilesUtils.createDefault(this);

  @state({
    hasChanged() {
      return false;
    },
  })
  _isRendering = false;

  static _ELEMENT_TAG = 'ACTIVE-TABLE';

  static override styles = [activeTableStyle];

  // CAUTION-4
  protected override render() {
    Render.renderTable(this);
    this.onContentUpdate(this.content);
    new ResizeObserver(ParentResize.resizeCallback.bind(this)).observe(this.parentElement as HTMLElement);
  }

  protected override update(changedProperties: PropertyValues) {
    StickyPropsUtils.process(this);
    ColumnSettingsUtils.setUpInternalSettings(this);
    FrameComponentsInternalUtils.set(this);
    DefaultColumnTypes.createDropdownItemsForDefaultTypes();
    RowDropdownSettingsUtil.process(this);
    if (this.pagination) PaginationInternalUtils.process(this);
    if (this.stripedRows) StripedRows.process(this);
    if (this.rowHoverStyles) RowHoverEvents.process(this.rowHoverStyles, this._defaultCellHoverColors);
    const tableElement = TableElement.createInfrastructureElements(this);
    if (this.overflow) OverflowUtils.setupContainer(this, tableElement); // must not be after BORDER_DIMENSIONS is set
    TableElement.addOverlayElements(this, tableElement, this._activeOverlayElements);
    this.shadowRoot?.appendChild(this._overflow?.overflowContainer || tableElement);
    OuterTableComponents.create(this);
    InitialContentProcessing.preProcess(this);
    WindowElement.setEvents(this);
    this.spellcheck = this.spellCheck;
    if (this.auxiliaryStyle && this.shadowRoot) WebComponentStyleUtils.add(this.auxiliaryStyle, this.shadowRoot);
    super.update(changedProperties);
  }

  override connectedCallback() {
    // REF-14
    if (Browser.IS_FIREFOX) {
      setTimeout(() => super.connectedCallback());
    } else {
      super.connectedCallback();
    }
  }

  // this is used to prevent a bug where the update method is called again (and adds another table) when a new property is
  // added - e.g. an event listener method
  override shouldUpdate(): boolean {
    return !this._tableElementRef;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'active-table': ActiveTable;
  }
}

// if using raw javascript, this is a direction to help move away from using render
// the initial values should be fetched in connectedCallBack (or set to default) and their changes can be observed in
// MutationObserver, this would also save callback and boolean changes from having to re-render the screen

// @state()
// observer = new MutationObserver(function (mutations) {
//   mutations.forEach(function (mutation) {
//     if (mutation.attributeName === 'content') {
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
