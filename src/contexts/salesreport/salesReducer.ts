/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { EventsContextTypes } from "../../types";

export const initSalesReportContext = {
  currentViewName: "Month",
  currentDate: new Date(),
  endDate: new Date(),
  servicevalue: [],
  departvalue: [],
  emplvalue: [],
  custvalue: [],
  catvalue: [],
  taskvalue: [],
  groupby: "none",
  group: false,
  sumcolumn: "none",
  sort: [{ columnName: "opTime", direction: "desc" }],
  itemType: null,
};

export const salesReportReducer = (state: EventsContextTypes, action: any) => {
  switch (action.type) {
    case "setCurrentViewName":
      return { ...state, currentViewName: action.payload };
    case "setCurrentDate":
      return { ...state, currentDate: action.payload };
    case "setEndDate":
      return { ...state, endDate: action.payload };
    case "setServicevalue":
      return { ...state, servicevalue: action.payload };
    case "setDepartvalue":
      return { ...state, departvalue: action.payload };
    case "setEmplvalue":
      return { ...state, emplvalue: action.payload };
    case "setCustvalue":
      return { ...state, custvalue: action.payload };
    case "setCatvalue":
      return { ...state, catvalue: action.payload };
    case "setTaskvalue":
      return { ...state, taskvalue: action.payload };
    case "setGroupby":
      return { ...state, groupby: action.payload };
    case "setGroup":
      return { ...state, group: action.payload };
    case "setSumcolumn":
      return { ...state, sumcolumn: action.payload };
    case "setSort":
      return { ...state, sort: action.payload };
    case "setItemType":
      return { ...state, itemType: action.payload };
    default:
      throw new Error("Unexpected action");
  }
};
