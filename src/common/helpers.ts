/* eslint-disable array-callback-return */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import * as Tafgeet from 'tafgeetjs';
import { mainmenu } from '../constants';
import { systemTypes } from '../constants/branch';
import {
  parentsBasicAccountsList,
  parentsExpAccountsList,
  parentsGeneralAccountsList,
  parentsInvAccountsList,
  parentsPurAccountsList,
  parentsSalesAccountsList,
} from '../constants/kaid';
const userAgent = navigator.userAgent.toLowerCase();

export const isElectron = userAgent.indexOf(' electron/') > -1;

export const isDEV =
  !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

export const getResourses = (
  resourse: any,
  fieldName: any,
  title: any,
  isRTL = true
) => {
  const instances = resourse.map((res: any) => {
    return {
      text: isRTL ? res.nameAr : res.name,
      id: res._id ? res._id : res.id,
      color: res.color,
    };
  });
  const resourses = [
    {
      fieldName,
      title,
      instances,
    },
  ];
  return resourses;
};

export const nameToColor = (name: string, s = 70, l = 40) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  const h = hash % 360;
  return 'hsl(' + h + ', ' + s + '%, ' + l + '%)';
};

export const groupBy = (list: any, fld: any) => {
  if (list) {
    const result = list.reduce(function (r: any, a: any) {
      r[a[fld]] = r[a[fld]] || [];
      r[a[fld]].push(a);
      return r;
    }, Object.create(null));
    return result;
  }
};

const isValidMenu = (menu: any, systems: any) => {
  if (menu.req === null || systems.includes(menu.req)) {
    return true;
  } else {
    return false;
  }
};

export const filterMenu = (systems: any) => {
  const fmenu = mainmenu.map((mnu: any) => {
    const isValidMain = isValidMenu(mnu, systems);
    if (isValidMain) {
      if (mnu.subMenu) {
        const smns = mnu.subMenu.map((sm: any) => {
          const isValid = isValidMenu(sm, systems);
          if (isValid) {
            return sm;
          }
        });
        const submenus = smns.filter((x: any) => x);
        mnu.subMenu = submenus;
        return mnu;
      } else {
        return mnu;
      }
    }
  });
  const finalmenu = fmenu.filter((x: any) => x);
  return finalmenu;
};

export const getparentAccounts = (systems: any) => {
  const basic = parentsBasicAccountsList;
  const sales = systems?.includes(systemTypes.pos)
    ? parentsSalesAccountsList
    : [];
  const purchase = systems?.includes(systemTypes.pur)
    ? parentsPurAccountsList
    : [];
  const inventory = systems?.includes(systemTypes.inv)
    ? parentsInvAccountsList
    : [];
  const expenses = systems?.includes(systemTypes.exp)
    ? parentsExpAccountsList
    : [];
  const general = systems?.includes(systemTypes.acc || systemTypes.ass)
    ? parentsGeneralAccountsList
    : [];
  const pList = [
    ...basic,
    ...sales,
    ...purchase,
    ...inventory,
    ...expenses,
    ...general,
  ];
  const numberlist = pList.map((pl: any) => pl.parentcode);
  return numberlist;
};

export const getEventsList = ({ event, rrule, actionslist, isRTL }) => {
  if (!rrule) {
    return [event];
  } else {
    const starthour = event.startDate.getHours();
    const startminute = event.startDate.getMinutes();
    const endhour = event.endDate.getHours();
    const endminute = event.endDate.getMinutes();
    const dates = rrule.all;
    const ritems = JSON.parse(event.items);
    const isTitle = event?.title && event?.title?.trim()?.length > 0;
    const title = isTitle
      ? event?.title
      : isRTL
      ? ritems[0]?.nameAr
      : ritems[0]?.name;
    const list = dates.map((da: any) => {
      const year = da.getFullYear();
      const month = da.getMonth();
      const day = da.getDate();
      const startDate = new Date(year, month, day, starthour, startminute);
      const endDate = new Date(year, month, day, endhour, endminute, 0, 0);

      const actionsl = actionslist.map((al: any) => {
        const { timeunit, timerelate, qty } = al;
        const sendtime = getSendTime({
          startDate,
          endDate,
          timeunit,
          timerelate,
          qty,
        });
        return {
          ...al,
          sendtime,
        };
      });

      return {
        ...event,
        title,
        actions: JSON.stringify(actionsl),
        startDate,
        endDate,
      };
    });
    return list;
  }
};

export const getSendTime = ({
  startDate,
  endDate,
  timeunit,
  timerelate,
  qty,
}: any) => {
  const baseTime =
    timerelate === 'bstart' || timerelate === 'astart' ? startDate : endDate;
  const isPlus = timerelate === 'bstart' ? false : true;
  const unitms =
    timeunit === 'minute'
      ? 1000 * 60
      : timeunit === 'hour'
      ? 1000 * 60 * 60
      : timeunit === 'day'
      ? 1000 * 60 * 60 * 24
      : 0;
  const fms = isPlus ? unitms * qty : -(unitms * qty);
  const final = new Date(baseTime).getTime() + fms;
  return new Date(final);
};

export const tafkeet = (number: any) => {
  const stringText = new Tafgeet(number, 'QAR').parse();
  return stringText;
};

export const isValidEmail = (email: any) => {
  if (!email) return false;
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export const sToMAndS = (s: number) => {
  const minutes = Math.floor(s / 60);
  const seconds = (s % 60).toFixed(0);
  return minutes + ':' + (Number(seconds) < 10 ? '0' : '') + seconds;
};
