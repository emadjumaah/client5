import { createContext } from "react";
import { EventsContextTypes } from "../../types";

export const CalendarReportContext = createContext<EventsContextTypes | any>(
  {},
);

export default CalendarReportContext;

// dispatch({ type: "setCalendar", payload: data });
