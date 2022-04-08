import RRule from 'rrule';

import { getStoreItem } from '../store';

const store = getStoreItem('store');
const template = store?.template;
const lang = store?.lang;
const words = template?.words?.[lang];
const options = template?.options;

export const freqOptions = [
  {
    id: 1,
    name: 'Daily',
    nameAr: 'يومي',
    value: RRule.DAILY,
  },
  {
    id: 2,
    name: 'Weekly',
    nameAr: 'اسبوعي',
    value: RRule.WEEKLY,
  },
  {
    id: 3,
    name: 'Monthly',
    nameAr: 'شهري',
    value: RRule.MONTHLY,
  },
  // {
  //   id: 4,
  //   name: 'Yearly',
  //   nameAr: 'سنوي',
  //   value: RRule.YEARLY,
  // },
];
export const intervalOptions = [
  {
    id: 1,
    name: 'Daily',
    nameAr: 'يومي',
    value: 1,
  },
  {
    id: 6,
    name: 'Weekly',
    nameAr: 'اسبوعي',
    value: 6,
  },
  {
    id: 31,
    name: 'Monthly',
    nameAr: 'شهري',
    value: 31,
  },
  {
    id: 30,
    name: 'Monthly 30 Days',
    nameAr: 'شهري 30 يوم',
    value: 29,
  },

  // {
  //   id: 4,
  //   name: 'Yearly',
  //   nameAr: 'سنوي',
  //   value: RRule.YEARLY,
  // },
];
export const byweekdayOptions = [
  {
    id: 1,
    name: 'Saturday',
    nameAr: 'السبت',
    value: RRule.SA,
  },
  {
    id: 2,
    name: 'Sunday',
    nameAr: 'الاحد',
    value: RRule.SU,
  },
  {
    id: 3,
    name: 'Monday',
    nameAr: 'الاثنين',
    value: RRule.MO,
  },
  {
    id: 4,
    name: 'Tuesday',
    nameAr: 'الثلاثاء',
    value: RRule.TU,
  },
  {
    id: 5,
    name: 'Wednesday',
    nameAr: 'الاربعاء',
    value: RRule.WE,
  },
  {
    id: 6,
    name: 'Thursday',
    nameAr: 'الخميس',
    value: RRule.TH,
  },
  {
    id: 7,
    name: 'Friday',
    nameAr: 'الجمعة',
    value: RRule.FR,
  },
];

export const actionOptions = [
  {
    id: 1,
    name: 'SMS',
    nameAr: 'رسالة SMS',
    value: 1,
  },
  {
    id: 3,
    name: 'Notification',
    nameAr: 'تنبيه',
    value: 3,
  },
  // {
  //   id: 2,
  //   name: 'Email',
  //   nameAr: 'بريد الكتروني',
  //   value: 2,
  // },
];
export const eventLengthOptions = [
  {
    id: 1,
    name: '30 minutes',
    nameAr: 'ثلاثون دقيقة',
    value: 30,
  },
  {
    id: 2,
    name: 'One Hour',
    nameAr: 'ساعة واحدة',
    value: 60,
  },
  {
    id: 3,
    name: 'One Hour 30 minutes',
    nameAr: 'ساعة ونصف',
    value: 90,
  },
  {
    id: 4,
    name: 'Two Hours',
    nameAr: 'ساعتين',
    value: 120,
  },
  {
    id: 5,
    name: 'Three Hours',
    nameAr: 'ثلاث ساعات',
    value: 180,
  },
  {
    id: 6,
    name: 'Four Hours',
    nameAr: 'اربع ساعات',
    value: 240,
  },
];
export const timeRelationOptions = [
  {
    id: 1,
    name: 'Befor Appointment Start',
    nameAr: 'قبل الموعد',
    value: 'bstart',
  },
  {
    id: 2,
    name: 'After Appointment End',
    nameAr: 'بعد نهاية الموعد',
    value: 'aend',
  },
  {
    id: 3,
    name: 'After Appointment Start',
    nameAr: 'بعد بداية الموعد',
    value: 'astart',
  },
];
export const timeUnitOptions = [
  {
    id: 1,
    name: 'Minutes',
    nameAr: 'دقيقة',
    value: 'minute',
  },
  {
    id: 2,
    name: 'Hours',
    nameAr: 'ساعة',
    value: 'hour',
  },
  {
    id: 3,
    name: 'Days',
    nameAr: 'يوم',
    value: 'day',
  },
];

export const getSBfromEvent = (event: any, isRTL: boolean) => {
  const s = `${isRTL ? event.customerNameAr : event.customerName} / ${
    isRTL ? event.departmentNameAr : event.departmentName
  } / ${isRTL ? event.employeeNameAr : event.employeeName}`;
  const b = `${isRTL ? event.customerNameAr : event.customerName}
${isRTL ? event.departmentNameAr : event.departmentName}
${isRTL ? event.employeeNameAr : event.employeeName}
${isRTL ? 'المجموع' : 'Amount'}: ${event.amount}
`;
  return { s, b };
};

export const manamentTabs = [
  {
    id: 0,
    value: 0,
    nameAr: words?.projects,
    name: words?.projects,
    ref: 'projects',
    hide: options?.noPro,
  },
  {
    id: 1,
    value: 1,
    nameAr: words?.tasks,
    name: words?.tasks,
    ref: 'tasks',
    hide: options?.noTsk,
  },
  {
    id: 2,
    value: 2,
    nameAr: words?.appointments,
    name: words?.appointments,
    ref: 'events',
  },
  {
    id: 3,
    value: 3,
    nameAr: 'الفواتيير',
    name: 'Invoices',
    ref: 'invoices',
  },
  {
    id: 4,
    value: 4,
    nameAr: 'المقبوضات',
    name: 'Receipts',
    ref: 'receipts',
  },
  {
    id: 5,
    value: 5,
    nameAr: 'المصاريف',
    name: 'Expenses',
    ref: 'expenses',
  },
  {
    id: 6,
    value: 6,
    nameAr: 'القيود',
    name: ' Entries',
    ref: 'entries',
  },
];

export const taskManamentTabs = [
  {
    id: 0,
    value: 0,
    nameAr: words?.projects,
    name: words?.projects,
    ref: 'projects',
    hide: true,
  },
  {
    id: 1,
    value: 1,
    nameAr: words?.tasks,
    name: words?.tasks,
    ref: 'tasks',
    hide: true,
  },
  {
    id: 2,
    value: 2,
    nameAr: words?.appointments,
    name: words?.appointments,
    ref: 'events',
  },
  {
    id: 3,
    value: 3,
    nameAr: 'الفواتيير',
    name: 'Invoices',
    ref: 'invoices',
  },
  {
    id: 4,
    value: 4,
    nameAr: 'المقبوضات',
    name: 'Receipts',
    ref: 'receipts',
  },
  {
    id: 5,
    value: 5,
    nameAr: 'المصاريف',
    name: 'Expenses',
    ref: 'expenses',
  },
  {
    id: 6,
    value: 6,
    nameAr: 'القيود',
    name: ' Entries',
    ref: 'entries',
  },
];
export const projectManamentTabs = [
  {
    id: 0,
    value: 0,
    nameAr: words?.projects,
    name: words?.projects,
    ref: 'projects',
    hide: true,
  },
  {
    id: 1,
    value: 1,
    nameAr: words?.tasks,
    name: words?.tasks,
    ref: 'tasks',
    hide: options?.noTsk,
  },
  {
    id: 2,
    value: 2,
    nameAr: words?.appointments,
    name: words?.appointments,
    ref: 'events',
  },
  {
    id: 3,
    value: 3,
    nameAr: 'الفواتيير',
    name: 'Invoices',
    ref: 'invoices',
  },
  {
    id: 4,
    value: 4,
    nameAr: 'المقبوضات',
    name: 'Receipts',
    ref: 'receipts',
  },
  {
    id: 5,
    value: 5,
    nameAr: 'المصاريف',
    name: 'Expenses',
    ref: 'expenses',
  },
  {
    id: 6,
    value: 6,
    nameAr: 'القيود',
    name: ' Entries',
    ref: 'entries',
  },
];
