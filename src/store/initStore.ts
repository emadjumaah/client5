export const initStore = {
  lang: 'ar',
  themeId: '0',
  user: null,
  token: null,
  notify: false,
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
  tempId: null,
  template: null,
  localuri: 'jadwal-main', // jadwal-server
  loading: false,
};
