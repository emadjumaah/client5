/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { MaindataContextTypes } from "../../types";

export const initMaindata = {
  departments: [],
  employees: [],
};

export const maindataReducer = (state: MaindataContextTypes, action: any) => {
  switch (action.type) {
    case "setDepartments":
      return { ...state, departments: action.payload };
    case "setEmployees":
      return { ...state, employees: action.payload };
    default:
      throw new Error("Unexpected action");
  }
};
