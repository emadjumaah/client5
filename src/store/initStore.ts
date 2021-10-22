export const initStore = {
  lang: 'ar',
  themeId: '0',
  user: null,
  token: null,
  calendar: {
    duration: 30,
    start: 8.5,
    end: 21.5,
  },
  packIssue: false,
  packIssueMsg: null,
  network: null, // web / local
  weburi: null, // jadwal.webredirect.org
  lastSuccess: Date.now(),
  wrongTimes: 0,
  startBlock: null,
  names: {
    tasks: 'المهام',
    customers: 'العملاء',
    employees: 'الموظفين',
    departments: 'الأقسام',
  },
  localuri: 'jadwal-server:4000', // jadwal-server
};
