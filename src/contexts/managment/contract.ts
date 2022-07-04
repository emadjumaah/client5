import { createContext } from 'react';
import { getColumns } from '../../common/columns';
import { getStoreItem } from '../../store';

const store = getStoreItem('store');
const lang = store?.lang;
const col = getColumns({ isRTL: lang === 'ar', words: {} });

export const ContractContext = createContext<any>({});

export const initContractContext = {
  currentViewName: 'Month',
  currentDate: new Date(),
  endDate: new Date(),
  sort: [{ columnName: 'time', direction: 'desc' }],
  hiddenColumnNames: [
    col.title.name,
    col.type.name,
    col.purchase.name,
    col.expenses.name,
    col.kaids.name,
    col.status.name,
    col.start.name,
    col.end.name,
    col.createdAt.name,
    col.department.name,
    col.project.name,
    col.resourse.name,
    col.customer.name,
    col.department.name,
    col.employee.name,
    'amount',
  ],
};

export const contractReducer = (state: any, action: any) => {
  switch (action.type) {
    case 'setCurrentViewName':
      return { ...state, currentViewName: action.payload };
    case 'setCurrentDate':
      return { ...state, currentDate: action.payload };
    case 'setEndDate':
      return { ...state, endDate: action.payload };
    case 'setSort':
      return { ...state, sort: action.payload };
    case 'setHiddenColumnNames':
      return { ...state, hiddenColumnNames: action.payload };
    default:
      throw new Error('Unexpected action');
  }
};
