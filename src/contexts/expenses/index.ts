import { createContext } from "react";
import { EventsContextTypes } from "../../types";

export const ExpensesContext = createContext<EventsContextTypes | any>({});

export default ExpensesContext;

// dispatch({ type: "setCalendar", payload: data });
