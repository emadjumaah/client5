import RRule from 'rrule';

export const freqOptions = [
  {
    id: 2,
    name: 'Daily',
    nameAr: 'يومي',
    value: RRule.DAILY,
  },
  {
    id: 3,
    name: 'Weekly',
    nameAr: 'اسبوعي',
    value: RRule.WEEKLY,
  },
  {
    id: 4,
    name: 'Monthly',
    nameAr: 'شهري',
    value: RRule.MONTHLY,
  },
  {
    id: 5,
    name: 'Yearly',
    nameAr: 'سنوي',
    value: RRule.YEARLY,
  },
];
export const byweekdayOptions = [
  {
    id: 2,
    name: 'Saturday',
    nameAr: 'السبت',
    value: RRule.SA,
  },
  {
    id: 3,
    name: 'Sunday',
    nameAr: 'الاحد',
    value: RRule.SU,
  },
  {
    id: 4,
    name: 'Monday',
    nameAr: 'الاثنين',
    value: RRule.MO,
  },
  {
    id: 5,
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
    id: 5,
    name: 'Thursday',
    nameAr: 'الخميس',
    value: RRule.TH,
  },
  {
    id: 5,
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
    id: 2,
    name: 'Email',
    nameAr: 'بريد الكتروني',
    value: 2,
  },
  {
    id: 3,
    name: 'Notification',
    nameAr: 'تنبيه',
    value: 3,
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
    nameAr: 'المشاريع',
    name: 'Projects',
  },
  {
    id: 1,
    value: 1,
    nameAr: 'المهمات',
    name: 'Tasks',
  },
  {
    id: 2,
    value: 2,
    nameAr: 'المواعيد',
    name: 'Appointments',
  },
  {
    id: 3,
    value: 3,
    nameAr: 'الفواتيير',
    name: 'Invoices',
  },
  {
    id: 4,
    value: 4,
    nameAr: 'المقبوضات',
    name: 'Receipts',
  },
  {
    id: 5,
    value: 5,
    nameAr: 'المصاريف',
    name: 'Expenses',
  },
];

export const taskManamentTabs = [
  {
    id: 0,
    value: 0,
    nameAr: 'المواعيد',
    name: 'Appointments',
  },
  {
    id: 1,
    value: 1,
    nameAr: 'الفواتيير',
    name: 'Invoices',
  },
  {
    id: 2,
    value: 2,
    nameAr: 'المقبوضات',
    name: 'Receipts',
  },
  {
    id: 3,
    value: 3,
    nameAr: 'المصاريف',
    name: 'Expenses',
  },
];
export const projectManamentTabs = [
  {
    id: 0,
    value: 0,
    nameAr: 'المهمات',
    name: 'Tasks',
  },
  {
    id: 1,
    value: 1,
    nameAr: 'المواعيد',
    name: 'Appointments',
  },
  {
    id: 2,
    value: 2,
    nameAr: 'الفواتيير',
    name: 'Invoices',
  },
  {
    id: 3,
    value: 3,
    nameAr: 'المقبوضات',
    name: 'Receipts',
  },
  {
    id: 4,
    value: 4,
    nameAr: 'المصاريف',
    name: 'Expenses',
  },
];
