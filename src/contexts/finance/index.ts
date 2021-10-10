import { createContext } from "react";
import { EventsContextTypes } from "../../types";

export const FinanceContext = createContext<EventsContextTypes | any>({});

export default FinanceContext;

// dispatch({ type: "setCalendar", payload: data });
