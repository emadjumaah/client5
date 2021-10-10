import { createContext } from "react";
import { EventsContextTypes } from "../../types";

export const ReceiptContext = createContext<EventsContextTypes | any>({});

export default ReceiptContext;

// dispatch({ type: "setCalendar", payload: data });
