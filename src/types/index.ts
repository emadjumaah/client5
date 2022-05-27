import { LanguageType } from '../languages/langTypes';

interface UserTypes {
  _id: string;
  branch: string;
  username: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  isSuperAdmin: boolean;
  isDepartAdmin: boolean;
  isBranchAdmin: boolean;
  isEmployee: boolean;
  employeeId: boolean;
  isFinance: boolean;
  isOperate: boolean;
  isEditor: boolean;
  isSdmin: boolean;
  isWriter: boolean;
  isViewer: boolean;
  roles: any;
}

export interface StoreTypes {
  lang: string;
  themeId: string;
  user: UserTypes;
  token: string | null;
  notify: boolean;
  packIssue: any;
  packIssueMsg: any;
  calendar: {
    start: string;
    end: string;
    duration: string;
  };
  template: any;
  tempId: any;
  lastSuccess: any;
  wrongTimes: any;
  startBlock: any;
  network: string;
  weburi: string;
  localuri: string;
  loading: boolean;
}
export interface CalendarTypes {
  mainResourceName: string;
  currentViewName: string;
  currentDate: any;
  departvalue: any;
  emplvalue: any;
  status: any;
}

export interface EventsContextTypes {
  currentViewName: string;
  currentDate: any;
  endDate: any;
  sort: any;
}
export interface SalesReportContextTypes {
  currentViewName: string;
  currentDate: any;
  endDate: any;
}
export interface MaindataContextTypes {
  departments: any;
  employees: any;
}

export interface GContextTypes {
  store: StoreTypes;
  dispatch: any;
  translate: LanguageType;
}
