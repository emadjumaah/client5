import { createContext } from 'react';

export const SupplierContext = createContext<any>({});

export const initSupplierContext = {
  sort: [{ columnName: 'time', direction: 'desc' }],
  hiddenColumnNames: ['phone', 'email', 'address'],
};

export const supplierReducer = (state: any, action: any) => {
  switch (action.type) {
    case 'setSort':
      return { ...state, sort: action.payload };
    case 'setHiddenColumnNames':
      return { ...state, hiddenColumnNames: action.payload };
    default:
      throw new Error('Unexpected action');
  }
};
