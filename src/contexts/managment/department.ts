import { createContext } from 'react';
// import { getColumns } from '../../common/columns';
// import { getStoreItem } from '../../store';
// const store = getStoreItem('store');
// const lang = store?.lang;;
// const col = getColumns({ isRTL: lang === 'ar', words: {} });

export const DepartmentContext = createContext<any>({});

export const initDepartmentContext = {
  sort: [{ columnName: 'time', direction: 'desc' }],
  hiddenColumnNames: [],
};

export const departmentReducer = (state: any, action: any) => {
  switch (action.type) {
    case 'setSort':
      return { ...state, sort: action.payload };
    case 'setHiddenColumnNames':
      return { ...state, hiddenColumnNames: action.payload };
    default:
      throw new Error('Unexpected action');
  }
};
