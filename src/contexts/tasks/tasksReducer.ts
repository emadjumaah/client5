/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { EventsContextTypes } from "../../types";

export const initTasksContext = {
  currentViewName: "Week",
  currentDate: new Date(),
  endDate: new Date(),
  sort: [{ columnName: "startDate", direction: "desc" }],
};

export const tasksReducer = (state: EventsContextTypes, action: any) => {
  switch (action.type) {
    case "setCurrentViewName":
      return { ...state, currentViewName: action.payload };
    case "setCurrentDate":
      return { ...state, currentDate: action.payload };
    case "setEndDate":
      return { ...state, endDate: action.payload };
    case "setSort":
      return { ...state, sort: action.payload };
    default:
      throw new Error("Unexpected action");
  }
};
