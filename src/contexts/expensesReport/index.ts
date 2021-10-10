import { createContext } from "react";
import { EventsContextTypes } from "../../types";

export const ExpensesReportContext = createContext<EventsContextTypes | any>(
  {}
);

export default ExpensesReportContext;

// dispatch({ type: "setCalendar", payload: data });
