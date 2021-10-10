import { createContext } from "react";
import { EventsContextTypes } from "../../types";

export const TasksContext = createContext<EventsContextTypes | any>({});

export default TasksContext;

// dispatch({ type: "setCalendar", payload: data });
