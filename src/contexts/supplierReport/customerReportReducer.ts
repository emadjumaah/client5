/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { EventsContextTypes } from '../../types';

export const initSupplierReportContext = {
  currentViewName: 'Month',
  currentDate: new Date(),
  endDate: new Date(),
  servicevalue: [],
  departvalue: [],
  projvalue: [],
  resovalue: [],
  emplvalue: [],
  custvalue: [],
  suppvalue: [],
  catvalue: [],
  accvalue: [],
  groupby: 'none',
  group: false,
  sumcolumn: 'employee',
  sort: [{ columnName: 'time', direction: 'desc' }],
};

export const supplierReportReducer = (
  state: EventsContextTypes,
  action: any
) => {
  switch (action.type) {
    case 'setCurrentViewName':
      return { ...state, currentViewName: action.payload };
    case 'setCurrentDate':
      return { ...state, currentDate: action.payload };
    case 'setEndDate':
      return { ...state, endDate: action.payload };
    case 'setServicevalue':
      return { ...state, servicevalue: action.payload };
    case 'setDepartvalue':
      return { ...state, departvalue: action.payload };
    case 'setProjvalue':
      return { ...state, projvalue: action.payload };
    case 'setResovalue':
      return { ...state, resovalue: action.payload };
    case 'setEmplvalue':
      return { ...state, emplvalue: action.payload };
    case 'setCustvalue':
      return { ...state, custvalue: action.payload };
    case 'setSuppvalue':
      return { ...state, suppvalue: action.payload };
    case 'setCatvalue':
      return { ...state, catvalue: action.payload };
    case 'setAccvalue':
      return { ...state, accvalue: action.payload };
    case 'setGroupby':
      return { ...state, groupby: action.payload };
    case 'setGroup':
      return { ...state, group: action.payload };
    case 'setSumcolumn':
      return { ...state, sumcolumn: action.payload };
    case 'setSort':
      return { ...state, sort: action.payload };
    default:
      throw new Error('Unexpected action');
  }
};
