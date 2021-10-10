/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { StoreTypes } from "../types";

export const storeReducer = (state: StoreTypes, action: any) => {
  switch (action.type) {
    case "setLang":
      return { ...state, lang: action.payload };
    case "setCalendar":
      return { ...state, calendar: action.payload };
    case "setThemeId":
      return { ...state, themeId: action.payload };
    case "setNetwork":
      return { ...state, network: action.payload };
    case "setWeburi":
      return { ...state, weburi: action.payload };
    case "setLocaluri":
      return { ...state, localuri: action.payload };
    case "setNames":
      return { ...state, names: action.payload };
    case "login":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
      };
    case "logout":
      return { ...state, user: null, token: null };

    default:
      throw new Error("Unexpected action");
  }
};
