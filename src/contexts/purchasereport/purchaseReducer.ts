/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { EventsContextTypes } from "../../types";

export const initPurchaseReportContext = {
  currentViewName: "Month",
  currentDate: new Date(),
  endDate: new Date(),
  servicevalue: [],
  departvalue: [],
  emplvalue: [],
  suppvalue: [],
  catvalue: [],
  brandvalue: [],
  groupby: "none",
  group: false,
  sumcolumn: "none",
  sort: [{ columnName: "opTime", direction: "desc" }],
};

export const purchaseReportReducer = (
  state: EventsContextTypes,
  action: any,
) => {
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
    case "setSupptvalue":
      return { ...state, suppvalue: action.payload };
    case "setCatvalue":
      return { ...state, catvalue: action.payload };
    case "setBrandvalue":
      return { ...state, brandvalue: action.payload };
    case "setGroupby":
      return { ...state, groupby: action.payload };
    case "setGroup":
      return { ...state, group: action.payload };
    case "setSumcolumn":
      return { ...state, sumcolumn: action.payload };
    case "setSort":
      return { ...state, sort: action.payload };
    default:
      throw new Error("Unexpected action");
  }
};
