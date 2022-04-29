import { createContext } from 'react';
import { EventsContextTypes } from '../../types';

export const ReminderContext = createContext<EventsContextTypes | any>({});

export default ReminderContext;

// dispatch({ type: "setCalendar", payload: data });
