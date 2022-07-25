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
  {
    id: 4,
    name: 'Yearly',
    nameAr: 'سنوي',
    value: RRule.YEARLY,
  },
];
export const intervalOptions = [
  {
    id: 1,
    name: 'Daily',
    nameAr: 'يومي',
    value: 1,
  },
  {
    id: 7,
    name: 'Weekly',
    nameAr: 'اسبوعي',
    value: 7,
  },
  {
    id: 31,
    name: 'Monthly',
    nameAr: 'شهري',
    value: 31,
  },
  {
    id: 30,
    name: 'Every 30 Days',
    nameAr: 'كل 30 يوم',
    value: 30,
  },
  {
    id: 11,
    name: 'On Month Start',
    nameAr: 'بداية كل شهر',
    value: 11,
  },
  {
    id: 33,
    name: 'On Month End',
    nameAr: 'نهاية كل شهر',
    value: 33,
  },
  {
    id: 100,
    name: 'One Appointment',
    nameAr: 'موعد واحد',
    value: 100,
  },

  // {
  //   id: 1000,
  //   name: 'Yearly',
  //   nameAr: 'سنوي',
  //   value: RRule.YEARLY,
  // },
];

export const monthdaysOptions = [
  { id: 1, name: '1', nameAr: '1', value: 1 },
  { id: 2, name: '2', nameAr: '2', value: 2 },
  { id: 3, name: '3', nameAr: '3', value: 3 },
  { id: 4, name: '4', nameAr: '4', value: 4 },
  { id: 5, name: '5', nameAr: '5', value: 5 },
  { id: 6, name: '6', nameAr: '6', value: 6 },
  { id: 7, name: '7', nameAr: '7', value: 7 },
  { id: 8, name: '8', nameAr: '8', value: 8 },
  { id: 9, name: '9', nameAr: '9', value: 9 },
  { id: 10, name: '10', nameAr: '10', value: 10 },
  { id: 11, name: '11', nameAr: '11', value: 11 },
  { id: 12, name: '12', nameAr: '12', value: 12 },
  { id: 13, name: '13', nameAr: '13', value: 13 },
  { id: 14, name: '14', nameAr: '14', value: 14 },
  { id: 15, name: '15', nameAr: '15', value: 15 },
  { id: 16, name: '16', nameAr: '16', value: 16 },
  { id: 17, name: '17', nameAr: '17', value: 17 },
  { id: 18, name: '18', nameAr: '18', value: 18 },
  { id: 19, name: '19', nameAr: '19', value: 19 },
  { id: 20, name: '20', nameAr: '20', value: 20 },
  { id: 21, name: '21', nameAr: '21', value: 21 },
  { id: 22, name: '22', nameAr: '22', value: 22 },
  { id: 23, name: '23', nameAr: '23', value: 23 },
  { id: 24, name: '24', nameAr: '24', value: 24 },
  { id: 25, name: '25', nameAr: '25', value: 25 },
  { id: 26, name: '26', nameAr: '26', value: 26 },
  { id: 27, name: '27', nameAr: '27', value: 27 },
  { id: 28, name: '28', nameAr: '28', value: 28 },
];

export const getDaysList = (nums: any) => {
  if (!nums || nums.length === 0) {
    return nums;
  }
  const nlist = [];
  for (const num of nums) {
    // if (num.id) nlist.push(num.value);
    if (num?.value?.weekday === 0) nlist.push(RRule.MO);
    if (num?.value?.weekday === 1) nlist.push(RRule.TU);
    if (num?.value?.weekday === 2) nlist.push(RRule.WE);
    if (num?.value?.weekday === 3) nlist.push(RRule.TH);
    if (num?.value?.weekday === 4) nlist.push(RRule.FR);
    if (num?.value?.weekday === 5) nlist.push(RRule.SA);
    if (num?.value?.weekday === 6) nlist.push(RRule.SU);
  }
  nlist.filter((x: any) => x);
  return nlist;
};

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
    name: 'Half Hour',
    nameAr: 'نصف ساعة',
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
    nameAr: words?.main,
    name: words?.main,
    ref: 'main',
  },
  {
    id: 1,
    value: 1,
    nameAr: words?.projects,
    name: words?.projects,
    ref: 'projects',
    hide: options?.noPro,
  },
  {
    id: 2,
    value: 2,
    nameAr: words?.tasks,
    name: words?.tasks,
    ref: 'tasks',
    hide: options?.noTsk,
  },
  {
    id: 3,
    value: 3,
    nameAr: words?.appointments,
    name: words?.appointments,
    ref: 'events',
  },
  {
    id: 4,
    value: 4,
    nameAr: 'الفواتيير',
    name: 'Invoices',
    ref: 'invoices',
  },
  {
    id: 5,
    value: 5,
    nameAr: 'المقبوضات',
    name: 'Receipts',
    ref: 'receipts',
  },
  {
    id: 6,
    value: 6,
    nameAr: 'المشتريات',
    name: 'Purchases',
    ref: 'purchases',
  },
  {
    id: 7,
    value: 7,
    nameAr: 'المدفوعات',
    name: 'Payments',
    ref: 'payments',
  },
  {
    id: 8,
    value: 8,
    nameAr: 'المصروفات',
    name: 'Expenses',
    ref: 'expenses',
  },
  {
    id: 9,
    value: 9,
    nameAr: 'استهلاك المنتجات',
    name: 'Products Expenses',
    ref: 'expenses',
  },
  {
    id: 10,
    value: 10,
    nameAr: 'القيود',
    name: ' Entries',
    ref: 'entries',
  },
  {
    id: 11,
    value: 11,
    nameAr: 'المفكرة',
    name: ' Reminders',
    ref: 'reminders',
  },
];
export const employeeTabs = [
  {
    id: 0,
    value: 0,
    nameAr: words?.main,
    name: words?.main,
    ref: 'main',
  },

  {
    id: 1,
    value: 1,
    nameAr: words?.projects,
    name: words?.projects,
    ref: 'projects',
    hide: options?.noPro,
  },
  {
    id: 2,
    value: 2,
    nameAr: words?.tasks,
    name: words?.tasks,
    ref: 'tasks',
    hide: options?.noTsk,
  },
  {
    id: 3,
    value: 3,
    nameAr: words?.appointments,
    name: words?.appointments,
    ref: 'events',
  },
  {
    id: 4,
    value: 4,
    nameAr: 'الفواتيير',
    name: 'Invoices',
    ref: 'invoices',
  },
  {
    id: 5,
    value: 5,
    nameAr: 'المقبوضات',
    name: 'Receipts',
    ref: 'receipts',
  },
  {
    id: 6,
    value: 6,
    nameAr: 'المشتريات',
    name: 'Purchases',
    ref: 'purchases',
  },
  {
    id: 7,
    value: 7,
    nameAr: 'المدفوعات',
    name: 'Payments',
    ref: 'payments',
  },
  {
    id: 8,
    value: 8,
    nameAr: 'المصروفات',
    name: 'Expenses',
    ref: 'expenses',
  },
  {
    id: 9,
    value: 9,
    nameAr: 'استهلاك المنتجات',
    name: 'Products Expenses',
    ref: 'expenses',
  },
  {
    id: 10,
    value: 10,
    nameAr: 'دفعات السلف',
    name: 'Advanced Payment',
    ref: 'advanced',
  },
  {
    id: 11,
    value: 11,
    nameAr: 'دفعات العهدة',
    name: 'Custody Payment',
    ref: 'custody',
  },
  {
    id: 12,
    value: 12,
    nameAr: 'القيود',
    name: ' Entries',
    ref: 'entries',
  },
  {
    id: 13,
    value: 13,
    nameAr: 'المفكرة',
    name: ' Reminders',
    ref: 'reminders',
  },
];
export const customerManamentTabs = [
  {
    id: 0,
    value: 0,
    nameAr: words?.main,
    name: words?.main,
    ref: 'main',
  },
  {
    id: 1,
    value: 1,
    nameAr: words?.projects,
    name: words?.projects,
    ref: 'projects',
    hide: options?.noPro,
  },
  {
    id: 2,
    value: 2,
    nameAr: words?.tasks,
    name: words?.tasks,
    ref: 'tasks',
    hide: options?.noTsk,
  },
  {
    id: 3,
    value: 3,
    nameAr: words?.appointments,
    name: words?.appointments,
    ref: 'events',
  },
  {
    id: 4,
    value: 4,
    nameAr: 'الفواتيير',
    name: 'Invoices',
    ref: 'invoices',
  },
  {
    id: 5,
    value: 5,
    nameAr: 'المقبوضات',
    name: 'Receipts',
    ref: 'receipts',
  },
];
export const supplierManamentTabs = [
  {
    id: 0,
    value: 0,
    nameAr: words?.main,
    name: words?.main,
    ref: 'main',
  },
  {
    id: 1,
    value: 1,
    nameAr: 'الفواتيير',
    name: 'Invoices',
    ref: 'invoices',
  },
  {
    id: 2,
    value: 2,
    nameAr: 'المدفوعات',
    name: 'Payments',
    ref: 'payments',
  },
];

export const taskManamentTabs = [
  {
    id: 0,
    value: 0,
    nameAr: words?.main,
    name: words?.main,
    ref: 'main',
  },

  {
    id: 1,
    value: 1,
    nameAr: words?.appointments,
    name: words?.appointments,
    ref: 'events',
  },
  {
    id: 2,
    value: 2,
    nameAr: 'الفواتيير',
    name: 'Invoices',
    ref: 'invoices',
  },
  {
    id: 3,
    value: 3,
    nameAr: 'المقبوضات',
    name: 'Receipts',
    ref: 'receipts',
  },
  {
    id: 4,
    value: 4,
    nameAr: 'المشتريات',
    name: 'Purchases',
    ref: 'purchases',
  },
  {
    id: 5,
    value: 5,
    nameAr: 'المدفوعات',
    name: 'Payments',
    ref: 'payments',
  },
  {
    id: 6,
    value: 6,
    nameAr: 'المصروفات',
    name: 'Expenses',
    ref: 'expenses',
  },
  {
    id: 7,
    value: 7,
    nameAr: 'استهلاك المنتجات',
    name: 'Products Expenses',
    ref: 'expenses',
  },
  {
    id: 8,
    value: 8,
    nameAr: 'القيود',
    name: ' Entries',
    ref: 'entries',
  },
  {
    id: 9,
    value: 9,
    nameAr: 'المفكرة',
    name: ' Reminders',
    ref: 'reminders',
  },
];
export const projectManamentTabs = [
  {
    id: 0,
    value: 0,
    nameAr: words?.main,
    name: words?.main,
    ref: 'main',
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
    nameAr: 'المشتريات',
    name: 'Purchases',
    ref: 'purchases',
  },
  {
    id: 6,
    value: 6,
    nameAr: 'المدفوعات',
    name: 'Payments',
    ref: 'payments',
  },
  {
    id: 7,
    value: 7,
    nameAr: 'المصروفات',
    name: 'Expenses',
    ref: 'expenses',
  },
  {
    id: 8,
    value: 8,
    nameAr: 'استهلاك المنتجات',
    name: 'Products Expenses',
    ref: 'expenses',
  },
  {
    id: 9,
    value: 9,
    nameAr: 'القيود',
    name: ' Entries',
    ref: 'entries',
  },
  {
    id: 10,
    value: 10,
    nameAr: 'المفكرة',
    name: ' Reminders',
    ref: 'reminders',
  },
];
