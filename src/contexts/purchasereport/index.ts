import { createContext } from "react";
import { SalesReportContextTypes } from "../../types";

export const PurchaseReportContext = createContext<
  SalesReportContextTypes | any
>({});

export default PurchaseReportContext;

// dispatch({ type: "setCalendar", payload: data });
