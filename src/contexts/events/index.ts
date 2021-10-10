import { createContext } from "react";
import { EventsContextTypes } from "../../types";

export const EventsContext = createContext<EventsContextTypes | any>({});

export default EventsContext;

// dispatch({ type: "setCalendar", payload: data });
