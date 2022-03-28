/* eslint-disable array-callback-return */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import * as Tafgeet from 'tafgeetjs';
import { mainmenu } from '../constants';
import { parentsAccountsList } from '../constants/kaid';
const userAgent = navigator.userAgent.toLowerCase();
export const isElectron = userAgent.indexOf(' electron/') > -1;
export const isDEV =
  !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

export const getCalendarResourses = (
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

export const filterMenu = () => {
  const fmenu = mainmenu.map((mnu: any) => {
    if (mnu.subMenu) {
      const smnss = mnu.subMenu.filter((sm: any) => !sm.hide);
      mnu.subMenu = smnss;
      return mnu;
    } else {
      return mnu;
    }
  });
  const finalmenu = fmenu.filter((m: any) => !m.hide);
  return finalmenu;
};

export const getparentAccounts = () => {
  const numberlist = parentsAccountsList.map((pl: any) => pl.parentcode);
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
export const getEventsListNoActions = ({ event, rrule, isRTL }) => {
  if (!rrule || !event?.startDate || !event?.endDate) {
    return [event];
  } else {
    const starthour = event?.startDate.getHours();
    const startminute = event?.startDate.getMinutes();
    const endhour = event?.endDate.getHours();
    const endminute = event?.endDate.getMinutes();
    const dates = rrule?.all;
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

      return {
        ...event,
        title,
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
  if (!number) return '';
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

export const detectURLs = (text: any) => {
  var urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
  return text.match(urlRegex);
};

// detectURLs("Visit www.cluemediator.com and subscribe us on https://www.cluemediator.com/subscribe for regular updates.")
// Output: ["www.cluemediator.com", "https://www.cluemediator.com/subscribe"]

export const subscribePushToken = async (company: any, checked: any) => {
  let sw = await navigator.serviceWorker.ready;
  let sub = await sw.pushManager.getSubscription();
  if (checked) {
    if (!sub) {
      let push = await sw.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: company?.publicKey,
      });
      return JSON.stringify(push);
    } else {
      await sub.unsubscribe();
      let push = await sw.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: company?.publicKey,
      });
      return JSON.stringify(push);
    }
  } else {
    if (sub) {
      await sub.unsubscribe();
      return undefined;
    } else {
      return undefined;
    }
  }
};

export const getReadyEventData = (
  event: any,
  task: any,
  itemsData: any,
  servicesproducts: any
) => {
  const freq = task?.freq;
  if (!task || !event || !freq) {
    return null;
  }
  let itemsList: any;
  const items = itemsData?.data?.['getOperationItems']?.data || [];
  if (items && items.length > 0) {
    const ids = items.map((it: any) => it.itemId);
    const servlist = servicesproducts.filter((ser: any) =>
      ids.includes(ser._id)
    );

    const itemsWqtyprice = items.map((item: any, index: any) => {
      const {
        categoryId,
        categoryName,
        categoryNameAr,
        departmentId,
        departmentName,
        departmentNameAr,
        departmentColor,
        employeeId,
        employeeName,
        employeeNameAr,
        employeeColor,
        resourseId,
        resourseName,
        resourseNameAr,
        resourseColor,
        note,
      } = item;
      const serv = servlist.filter((se: any) => se._id === item.itemId)[0];
      return {
        ...serv,
        categoryId,
        categoryName,
        categoryNameAr,
        departmentId,
        departmentName,
        departmentNameAr,
        departmentColor,
        employeeId,
        employeeName,
        employeeNameAr,
        employeeColor,
        resourseId,
        resourseName,
        resourseNameAr,
        resourseColor,
        index,
        itemprice: item.itemPrice,
        itemqty: item.qty,
        itemtotal: item.total,
        note,
        // itemtotalcost: item.qty * serv.cost,
      };
    });
    itemsWqtyprice.sort((a: any, b: any) =>
      a.indx > b.indx ? 1 : b.indx > a.indx ? -1 : 0
    );
    itemsList = itemsWqtyprice;
  }

  const start = new Date(event?.startDate);
  const end = new Date(event?.endDate);

  let startDate: any;
  let endDate: any;

  if (freq === 3) {
    startDate = start.setDate(start.getDate() + 1);
    endDate = end.setDate(end.getDate() + 1);
  }
  if (freq === 2) {
    startDate = start.setDate(start.getDate() + 7);
    endDate = end.setDate(end.getDate() + 7);
  }
  if (freq === 1) {
    startDate = start.setMonth(start.getMonth() + 1);
    endDate = end.setMonth(end.getMonth() + 1);
  }

  const variables = {
    title: event.title,
    startDate,
    endDate,
    location: { lat: event?.location?.lat, lng: event?.location?.lng },
    amount: event.amount,
    status: 2,
    items: JSON.stringify(itemsList),
    taskId: event.taskId,
    customerId: event.customerId,
    customerName: event.customerName,
    customerNameAr: event.customerNameAr,
    customerPhone: event.customerPhone,
    departmentId: event.departmentId,
    departmentName: event.departmentName,
    departmentNameAr: event.departmentNameAr,
    departmentColor: event.departmentColor,
    employeeId: event.employeeId,
    employeeName: event.employeeName,
    employeeNameAr: event.employeeNameAr,
    employeeColor: event.employeeColor,
    employeePhone: event.employeePhone,
    resourseId: event.resourseId,
    resourseName: event.resourseName,
    resourseNameAr: event.resourseNameAr,
    resourseColor: event.resourseColor,
  };

  return variables;
};
