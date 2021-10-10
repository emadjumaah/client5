import { createContext } from "react";
import { EventsContextTypes } from "../../types";

export const SalesContext = createContext<EventsContextTypes | any>({});

export default SalesContext;

// dispatch({ type: "setCalendar", payload: data });
