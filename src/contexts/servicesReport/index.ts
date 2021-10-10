import { createContext } from "react";
import { SalesReportContextTypes } from "../../types";

export const ServicesReportContext = createContext<
  SalesReportContextTypes | any
>({});

export default ServicesReportContext;

// dispatch({ type: "setCalendar", payload: data });
