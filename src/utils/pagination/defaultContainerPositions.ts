import {ContainerStyle, PaginationPosition} from '../../types/pagination';

export class DefaultContainerPositions {
  public static readonly POSITIONS: {[key in PaginationPosition]: ContainerStyle} = {
    'bottom-left': {
      marginTop: '10px',
      float: 'left',
    },
    'bottom-middle': {
      marginTop: '10px',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    'bottom-right': {
      marginTop: '10px',
      float: 'right',
    },
    'top-left': {
      marginBottom: '10px',
    },
    'top-middle': {
      marginBottom: '10px',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    'top-right': {
      marginBottom: '10px',
      marginLeft: 'auto',
    },
  };
}
