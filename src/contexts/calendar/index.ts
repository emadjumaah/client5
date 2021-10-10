import { createContext } from "react";
import { CalendarTypes } from "../../types";

export const CalendarContext = createContext<CalendarTypes | any>({});

export default CalendarContext;

// dispatch({ type: "setCalendar", payload: data });
