/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { EventsContextTypes } from "../../types";

export const initCalendarReportContext = {
  mainResourceName: "employeeId",
  currentViewName: "Day",
  currentDate: new Date(),
  endDate: new Date(),
  sort: [{ columnName: "startDate", direction: "desc" }],
};

export const calendarReportReducer = (
  state: EventsContextTypes,
  action: any,
) => {
  switch (action.type) {
    case "setMainResourceName":
      return { ...state, mainResourceName: action.payload };
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
