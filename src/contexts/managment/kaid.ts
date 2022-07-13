import { createContext } from 'react';

export const KaidContext = createContext<any>({});

export const initKaidContext = {
  currentViewName: 'Month',
  currentDate: new Date(),
  endDate: new Date(),
  optypevalue: [],
  itemtypevalue: [],
  itemvalue: [],
  projvalue: [],
  taskvalue: [],
  departvalue: [],
  emplvalue: [],
  resovalue: [],
  custvalue: [],
  suppvalue: [],
  accvalue: [],
  acodevalue: [],
  pcodevalue: [],
  sort: [{ columnName: 'opTime', direction: 'desc' }],
  hiddenColumnNames: ['amount'],
};

export const kaidReducer = (state: any, action: any) => {
  switch (action.type) {
    case 'setCurrentViewName':
      return { ...state, currentViewName: action.payload };
    case 'setCurrentDate':
      return { ...state, currentDate: action.payload };
    case 'setEndDate':
      return { ...state, endDate: action.payload };
    case 'setOptypevalue':
      return { ...state, optypevalue: action.payload };
    case 'setItemtypevalue':
      return { ...state, itemtypevalue: action.payload };
    case 'setItemvalue':
      return { ...state, itemvalue: action.payload };
    case 'setHiddenColumnNames':
      return { ...state, hiddenColumnNames: action.payload };
    case 'setProjvalue':
      return { ...state, projvalue: action.payload };
    case 'setDepartvalue':
      return { ...state, departvalue: action.payload };
    case 'setEmplvalue':
      return { ...state, emplvalue: action.payload };
    case 'setResovalue':
      return { ...state, resovalue: action.payload };
    case 'setCustvalue':
      return { ...state, custvalue: action.payload };
    case 'setSuppvalue':
      return { ...state, suppvalue: action.payload };
    case 'setTaskvalue':
      return { ...state, taskvalue: action.payload };
    case 'setAccvalue':
      return { ...state, accvalue: action.payload };
    case 'setAcodevalue':
      return { ...state, acodevalue: action.payload };
    case 'setPcodevalue':
      return { ...state, pcodevalue: action.payload };
    case 'setSort':
      return { ...state, sort: action.payload };
    default:
      throw new Error('Unexpected action');
  }
};
