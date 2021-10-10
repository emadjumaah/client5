import { createContext } from "react";
import { SalesReportContextTypes } from "../../types";

export const SalesReportContext = createContext<SalesReportContextTypes | any>(
  {},
);

export default SalesReportContext;

// dispatch({ type: "setCalendar", payload: data });
