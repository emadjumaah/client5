import { createContext } from 'react';

export const CustomerContext = createContext<any>({});

export const initCustomerContext = {
  sort: [{ columnName: 'time', direction: 'desc' }],
  hiddenColumnNames: ['phone', 'email', 'address'],
};

export const customerReducer = (state: any, action: any) => {
  switch (action.type) {
    case 'setSort':
      return { ...state, sort: action.payload };
    case 'setHiddenColumnNames':
      return { ...state, hiddenColumnNames: action.payload };
    default:
      throw new Error('Unexpected action');
  }
};
