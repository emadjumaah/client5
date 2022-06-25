/* eslint-disable eqeqeq */
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
export const getparentAccountsNames = () => {
  const numberlist = parentsAccountsList.map((pl: any) => {
    return {
      code: pl.parentcode,
      name: pl.parent,
      nameAr: pl.parentAr,
      type: pl.accType,
    };
  });
  return numberlist;
};

export const getEventsList = ({
  event,
  rrule,
  actionslist,
  isRTL,
  start,
  byweekday,
}) => {
  if (!event) {
    return [];
  }
  if (!rrule) {
    return [event];
  } else {
    const starthour = event.startDate.getHours();
    const startminute = event.startDate.getMinutes();
    const endhour = event.endDate.getHours();
    const endminute = event.endDate.getMinutes();
    const dates = rrule.all;
    if (byweekday?.length > 0 && dates?.[0] !== start) {
      dates.unshift(start);
    }
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
      const endDate = new Date(year, month, day, endhour, endminute);

      const actionsl =
        actionslist?.length > 0
          ? actionslist.map((al: any) => {
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
            })
          : null;

      return {
        ...event,
        title,
        actions: actionsl ? JSON.stringify(actionsl) : null,
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

export const tafkeet = (number: any, isRTL: any) => {
  if (!number) return '';
  let numtostr = '';
  if (isRTL) {
    numtostr = new Tafgeet(number, 'QAR').parse();
  } else {
    numtostr = `${toWords(number)} QAR`;
  }
  return numtostr;
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
  const interval = task?.interval ? task?.interval : 1;
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
    startDate = start.setDate(start.getDate() + interval);
    endDate = end.setDate(end.getDate() + interval);
  }
  if (freq === 2) {
    startDate = start.setDate(start.getDate() + 7 * interval);
    endDate = end.setDate(end.getDate() + 7 * interval);
  }
  if (freq === 1) {
    startDate = start.setMonth(start.getMonth() + interval);
    endDate = end.setMonth(end.getMonth() + interval);
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
    customer: task.customerId
      ? {
          customerId: task.customerId,
          customerName: task.customerName,
          customerNameAr: task.customerNameAr,
          customerPhone: task.customerPhone,
        }
      : {
          customerId: undefined,
          customerName: undefined,
          customerNameAr: undefined,
          customerPhone: undefined,
        },
    department: task.departmentId
      ? {
          departmentId: task.departmentId,
          departmentName: task.departmentName,
          departmentNameAr: task.departmentNameAr,
          departmentColor: task.departmentColor,
        }
      : {
          departmentId: undefined,
          departmentName: undefined,
          departmentNameAr: undefined,
          departmentColor: undefined,
        },
    employee: task.employeeId
      ? {
          employeeId: task.employeeId,
          employeeName: task.employeeName,
          employeeNameAr: task.employeeNameAr,
          employeeColor: task.employeeColor,
          employeePhone: task.employeePhone,
        }
      : {
          employeeId: undefined,
          employeeName: undefined,
          employeeNameAr: undefined,
          employeeColor: undefined,
          employeePhone: undefined,
        },
    resourse: task.resourseId
      ? {
          resourseId: task.resourseId,
          resourseName: task.resourseName,
          resourseNameAr: task.resourseNameAr,
          resourseColor: task.resourseColor,
        }
      : {
          resourseId: undefined,
          resourseName: undefined,
          resourseNameAr: undefined,
          resourseColor: undefined,
        },
  };
  return variables;
};
export const getReadyCloseEventData = (
  event: any,
  task: any,
  amount: any,
  itemsData: any,
  servicesproducts: any,
  time: any
) => {
  if (!task || !event) {
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
      const serv = servlist.filter((se: any) => se._id === item.itemId)?.[0];
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
        itemprice: amount,
        itemqty: 1,
        itemtotal: amount,
        note,
      };
    });
    itemsList = itemsWqtyprice;
  }

  const startDate = new Date(time);
  const endDate = new Date(time);
  const variables = {
    title: event.title,
    startDate,
    endDate,
    location: { lat: event?.location?.lat, lng: event?.location?.lng },
    amount,
    status: 2,
    items: JSON.stringify([itemsList?.[0]]),
    taskId: event.taskId,
    customer: task.customerId
      ? {
          customerId: task.customerId,
          customerName: task.customerName,
          customerNameAr: task.customerNameAr,
          customerPhone: task.customerPhone,
        }
      : {
          customerId: undefined,
          customerName: undefined,
          customerNameAr: undefined,
          customerPhone: undefined,
        },
    department: task.departmentId
      ? {
          departmentId: task.departmentId,
          departmentName: task.departmentName,
          departmentNameAr: task.departmentNameAr,
          departmentColor: task.departmentColor,
        }
      : {
          departmentId: undefined,
          departmentName: undefined,
          departmentNameAr: undefined,
          departmentColor: undefined,
        },
    employee: task.employeeId
      ? {
          employeeId: task.employeeId,
          employeeName: task.employeeName,
          employeeNameAr: task.employeeNameAr,
          employeeColor: task.employeeColor,
          employeePhone: task.employeePhone,
        }
      : {
          employeeId: undefined,
          employeeName: undefined,
          employeeNameAr: undefined,
          employeeColor: undefined,
          employeePhone: undefined,
        },
    resourse: task.resourseId
      ? {
          resourseId: task.resourseId,
          resourseName: task.resourseName,
          resourseNameAr: task.resourseNameAr,
          resourseColor: task.resourseColor,
        }
      : {
          resourseId: undefined,
          resourseName: undefined,
          resourseNameAr: undefined,
          resourseColor: undefined,
        },
  };
  return variables;
};

export const getTaskTimeAmountData = (task: any, time = new Date()) => {
  if (!task) return null;

  const { start, end, amount } = task;

  const startms = new Date(start).getTime();
  const endms = new Date(end).getTime();
  const now = time.getTime();

  const days = Math.ceil((endms - startms) / (1000 * 60 * 60 * 24));

  const daysnow = Math.ceil((now - startms) / (1000 * 60 * 60 * 24));
  const dayamount = Math.round(amount / days);

  if (now < startms) {
    return {
      progress: 0,
      days,
      daysnow: null,
      amountnow: null,
      remaining: amount,
      amount,
      dayamount,
    };
  }

  if (now > endms) {
    return {
      progress: 1,
      days,
      daysnow: days,
      amountnow: amount,
      remaining: 0,
      amount,
      dayamount,
    };
  }

  const amountnow = Math.round(dayamount * daysnow);
  const remaining = Math.round(amount - amountnow);

  const progress = Math.round((daysnow / days) * 100) / 100;

  return {
    progress,
    days,
    daysnow,
    amountnow,
    remaining,
    amount,
    dayamount,
  };
};
export const getInvDays = (start, end) => {
  if (!start || !end) return 0;

  const startms = new Date(start).getTime();
  const endms = new Date(end).getTime();

  const days = Math.ceil((endms - startms) / (1000 * 60 * 60 * 24));
  return days;
};

export const getTaskStatus = (tasks: any, isRTL: any) => {
  const rtasks = tasks.map((task: any) => {
    const { isClosed, start, end, freq, interval } = task;

    const type =
      freq === 1 || (freq === 3 && interval > 27)
        ? isRTL
          ? 'شهري'
          : 'Monthly'
        : freq === 2
        ? isRTL
          ? 'اسبوعي'
          : 'Weekly'
        : isRTL
        ? 'يومي'
        : 'Daily';
    if (isClosed) {
      return { ...task, status: isRTL ? 'مقفل' : 'Closed', type };
    } else {
      const startms = new Date(start).getTime();
      const endms = new Date(end).getTime();
      const now = new Date().getTime();
      if (now < startms) {
        return {
          ...task,
          status: isRTL ? 'لم يبدأ بعد' : 'Not Started',
          type,
        };
      }
      if (now > endms) {
        return {
          ...task,
          status: isRTL ? 'غير مقفل' : 'Not Closed',
          type,
        };
      }
      return {
        ...task,
        status: isRTL ? 'ساري' : 'In Progress',
        type,
      };
    }
  });
  return rtasks;
};

export const searchInRows = ({ rows, query }: any) => {
  const frows = rows.filter((row: any) => {
    for (const key of Object.keys(row)) {
      if (
        row[key] &&
        row[key].toString().toLowerCase().includes(query.toLowerCase())
      ) {
        return true;
      }
    }
    return false;
  });
  return frows;
};
export const zeroPad = (num: any, places: any) =>
  String(num).padStart(places, '0');

export const updateDocNumbers = (data: any) => {
  const rdata = data.map((d: any) => {
    const pre = d?.docNo?.split('-')?.[0];
    const num = d?.docNo?.split('-')?.[1];
    return {
      ...d,
      docNo: `${pre}-${String(num).padStart(7, '0')}`,
    };
  });
  return rdata;
};
export const updateOpDocRefNumbers = (data: any) => {
  const rdata = data.map((d: any) => {
    const pre = d?.opDocNo?.split('-')?.[0];
    const num = d?.opDocNo?.split('-')?.[1];
    const preref = d?.refNo?.split('-')?.[0];
    const numref = d?.refNo?.split('-')?.[1];
    return {
      ...d,
      opDocNo: pre ? `${pre}-${String(num).padStart(7, '0')}` : '',
      refNo: preref ? `${preref}-${String(numref).padStart(7, '0')}` : '',
    };
  });
  return rdata;
};

var th = ['', 'thousand', 'million', 'billion', 'trillion'];

var dg = [
  'zero',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
];
var tn = [
  'ten',
  'eleven',
  'twelve',
  'thirteen',
  'fourteen',
  'fifteen',
  'sixteen',
  'seventeen',
  'eighteen',
  'nineteen',
];
var tw = [
  'twenty',
  'thirty',
  'forty',
  'fifty',
  'sixty',
  'seventy',
  'eighty',
  'ninety',
];
export const toWords = (s: any) => {
  s = s.toString();
  s = s.replace(/[\\, ]/g, '');
  if (s != parseFloat(s)) return 'not a number';
  let x = s.indexOf('.');
  if (x == -1) x = s.length;
  if (x > 15) return 'too big';
  let n = s.split('');
  let str = '';
  let sk = 0;
  for (let i = 0; i < x; i++) {
    if ((x - i) % 3 == 2) {
      if (n[i] === '1') {
        str += tn[Number(n[i + 1])] + ' ';
        i++;
        sk = 1;
      } else if (n[i] != 0) {
        str += tw[n[i] - 2] + ' ';
        sk = 1;
      }
    } else if (n[i] != 0) {
      str += dg[n[i]] + ' ';
      if ((x - i) % 3 == 0) str += 'hundred ';
      sk = 1;
    }
    if ((x - i) % 3 == 1) {
      if (sk) str += th[(x - i - 1) / 3] + ' ';
      sk = 0;
    }
  }
  if (x !== s.length) {
    let y = s.length;
    str += 'point ';
    for (let i = x + 1; i < y; i++) str += dg[n[i]] + ' ';
  }
  return str.replace(/\s+/g, ' ');
};
