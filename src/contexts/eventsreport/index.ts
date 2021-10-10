import { createContext } from "react";
import { SalesReportContextTypes } from "../../types";

export const EventsReportContext = createContext<SalesReportContextTypes | any>(
  {},
);

export default EventsReportContext;

// dispatch({ type: "setCalendar", payload: data });
