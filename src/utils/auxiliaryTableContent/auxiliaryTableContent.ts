import {ToggleAdditionElements} from '../../elements/table/addNewElements/shared/toggleAdditionElements';
import {AddNewRowElement} from '../../elements/table/addNewElements/row/addNewRowElement';
import {EditableTableComponent} from '../../editable-table-component';
import {CellStateColorProperties} from '../../types/cellStateColors';
import {CellHighlightUtil} from '../color/cellHighlightUtil';

// auxiliary content is comprised of index column, add new column column and add new row row
export class AuxiliaryTableContent {
  public static EVENT_COLORS = {
    defaultColor: {backgroundColor: '', color: ''},
    hoverColor: {backgroundColor: '', color: ''},
  };

  // prettier-ignore
  private static getHoverColorValue(etc: EditableTableComponent,
      colorKey: keyof CellStateColorProperties, defaultValue: string): string {
    return etc.auxiliaryTableContentProps.hoverColor?.[colorKey] || etc.cellStyle[colorKey] || defaultValue;
  }

  private static getDefaultColorValue(etc: EditableTableComponent, colorKey: keyof CellStateColorProperties) {
    return etc.auxiliaryTableContentProps.defaultStyle?.[colorKey] || etc.cellStyle[colorKey] || '';
  }

  // prettier-ignore
  public static setEventColors(etc: EditableTableComponent) {
    AuxiliaryTableContent.EVENT_COLORS = {
      defaultColor: {
        backgroundColor: AuxiliaryTableContent.getDefaultColorValue(etc, 'backgroundColor'),
        color: AuxiliaryTableContent.getDefaultColorValue(etc, 'color'),
      },
      hoverColor: {
        backgroundColor: AuxiliaryTableContent.getHoverColorValue(
          etc, 'backgroundColor', CellHighlightUtil.DEFAULT_HOVER_PROPERTIES.backgroundColor),
        color: AuxiliaryTableContent.getHoverColorValue(
          etc, 'color', CellHighlightUtil.DEFAULT_HOVER_PROPERTIES.color),
      },
    };
  }

  // index and add column cells are added on row insertion
  // CAUTION-4
  public static addAuxiliaryBodyElements(etc: EditableTableComponent) {
    // add new row element - REF-18 (the row element has already been created and cell added to it)
    etc.tableBodyElementRef?.appendChild(etc.addRowCellElementRef?.parentElement as HTMLElement);
    ToggleAdditionElements.update(etc, true, AddNewRowElement.toggle);
  }
}
