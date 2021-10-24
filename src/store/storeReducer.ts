/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { StoreTypes } from '../types/index';

export const storeReducer = (state: StoreTypes, action: any) => {
  switch (action.type) {
    case 'setLang':
      return { ...state, lang: action.payload };
    case 'setCalendar':
      return { ...state, calendar: action.payload };
    case 'setThemeId':
      return { ...state, themeId: action.payload };
    case 'setNetwork':
      return { ...state, network: action.payload };
    case 'setWeburi':
      return { ...state, weburi: action.payload };
    case 'setLocaluri':
      return { ...state, localuri: action.payload };
    case 'login':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        template: action.payload.template,
      };
    case 'logout':
      return { ...state, user: null, token: null, template: null };
    case 'setLastSuccess':
      return { ...state, lastSuccess: action.payload };
    case 'setWrongTimes':
      return {
        ...state,
        wrongTimes: action.payload === 0 ? 0 : state.wrongTimes + 1,
      };
    case 'setStartBlock':
      return { ...state, startBlock: action.payload };
    case 'setPackIssue':
      return { ...state, packIssue: true, packIssueMsg: action.payload };
    case 'closePackIssue':
      return { ...state, packIssue: false, packIssueMsg: null };
    case 'setTemplate':
      return { ...state, template: action.payload };

    default:
      throw new Error('Unexpected action');
  }
};
