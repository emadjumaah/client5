import { createContext } from "react";
import { SalesReportContextTypes } from "../../types";

export const DocumentsReportContext = createContext<
  SalesReportContextTypes | any
>({});

export default DocumentsReportContext;

// dispatch({ type: "setCalendar", payload: data });
