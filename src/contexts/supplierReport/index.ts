import { createContext } from 'react';
import { EventsContextTypes } from '../../types';

export const SupplierReportContext = createContext<EventsContextTypes | any>(
  {}
);

export default SupplierReportContext;

// dispatch({ type: "setCalendar", payload: data });
