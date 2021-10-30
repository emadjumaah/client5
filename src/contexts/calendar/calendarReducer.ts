/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { CalendarTypes } from '../../types';

export const initCalendar = {
  mainResourceName: 'status',
  currentViewName: window.innerWidth < 600 ? 'Day' : 'Week',
  currentDate: new Date(),
  departvalue: null,
  emplvalue: null,
  status: null,
  data: null,
  sort: [{ columnName: 'startDate', direction: 'desc' }],
};

export const calendarReducer = (state: CalendarTypes, action: any) => {
  switch (action.type) {
    case 'setMainResourceName':
      return { ...state, mainResourceName: action.payload };
    case 'setCurrentViewName':
      return { ...state, currentViewName: action.payload };
    case 'setCurrentDate':
      return { ...state, currentDate: action.payload };
    case 'setDepartvalue':
      return { ...state, departvalue: action.payload };
    case 'setEmplvalue':
      return { ...state, emplvalue: action.payload };
    case 'setStatus':
      return { ...state, status: action.payload };
    case 'setData':
      return { ...state, data: action.payload };
    case 'setSort':
      return { ...state, sort: action.payload };

    default:
      throw new Error('Unexpected action');
  }
};
