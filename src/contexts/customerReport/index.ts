import { createContext } from "react";
import { EventsContextTypes } from "../../types";

export const CustomerReportContext = createContext<EventsContextTypes | any>(
  {}
);

export default CustomerReportContext;

// dispatch({ type: "setCalendar", payload: data });
