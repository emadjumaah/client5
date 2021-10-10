import { createContext } from "react";
import { EventsContextTypes } from "../../types";

export const PurchaseContext = createContext<EventsContextTypes | any>({});

export default PurchaseContext;

// dispatch({ type: "setCalendar", payload: data });
