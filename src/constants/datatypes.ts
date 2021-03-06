/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { colors, fade } from '@material-ui/core';

export const operationTypes = {
  // المبيعات والمشتريات - زبائن وموردين
  salesInvoice: 10, /// فاتورة المبيع
  salesQoutation: 11,
  salesDelivery: 12, // مع فاتورة المبيعات عند تسليم المنتجات للزبون
  salesReturn: 13,
  customerReceipt: 14, // from customer // cash debit <- accounts_receivable credit
  customerDiscount: 15, // to customer //  accounts_receivable debit <- cash credit  خصمم خارج الفاتورة

  purchaseInvoice: 30, // فاتورة الشراء
  purchaseOrder: 31, // طلب شراء قبل فاتورة الشراء
  purchaseDelivery: 32, //  مع طلب الشراء عند استلام المنتجات من المورد
  purchaseReturn: 33,
  supplierPayemnt: 34, // to supplier // accounts_payable debit <- cash credit
  supplierDiscount: 35, // from supplier // cash debit <- accounts_payable credit خصمم خارج الفاتورة

  interDeliveryIn: 50, // حركة استلام بضاعة من احد مخازن الشركة
  interDeliveryOut: 51, // حركة تسليم بضاعة لاحد مخازن الشركة

  expenses: 60,
  expproducts: 61,
  exppettycash: 62,
  exppayable: 63,

  // حركة مالية
  // transfare cash - bank - card - partners - branchs
  deposet: 70, // سحب من الصندوق وايداع بالبنك // bank debit <- cash or card credit
  ownerDraw: 71, // سحب من الصندوق للشريك  // partenr debit <- cash credit
  ownerDeposit: 72, // اضافة من الشريك في الصندوق  // cash debit <- partenr credit

  pettyCashPay: 73, // دفع عهدة
  pettyCashRec: 74, // قبض عهدة
  cashDraw: 75, // سحب
  cashDeposet: 76, // ايداع
  advanceReceipt: 77, // قبض سلفة من موظف
  advancePayemnt: 78, // دفع لموظف سلفة

  event: 80,
  task: 81,
  project: 82,

  // special transfare operation
  kaid: 90,
};

export const accountType = {
  DEBIT: 1,
  CREDIT: 2,
};

export const opTypesNames = {
  10: {
    name: 'Invlice',
    nameAr: 'فاتورة',
    ref: 'salesInvoice',
    type: accountType.CREDIT,
  },
  11: {
    name: 'Qoutation',
    nameAr: 'عرض سعر',
    ref: 'salesQoutation',
    type: 1,
  },
  12: {
    name: 'Sales Delivery',
    nameAr: 'سند تسليم',
    ref: 'salesDelivery',
    type: 1,
  },
  13: {
    name: 'Sales Return',
    nameAr: 'مرتجع مبيعات',
    ref: 'salesReturn',
    type: 1,
  },
  14: {
    name: 'Receipt',
    nameAr: 'سند قبض',
    ref: 'customerReceipt',
    type: accountType.DEBIT,
  },
  15: {
    name: 'Sales Discount',
    nameAr: 'خصم مبيعات',
    ref: 'customerDiscount',
    type: accountType.DEBIT,
  },
  30: {
    name: 'Purchase Invoice',
    nameAr: 'فاتورة شراء',
    ref: 'purchaseInvoice',
    type: accountType.DEBIT,
  },
  31: {
    name: 'Purchase Order',
    nameAr: 'طلب شراء',
    ref: 'purchaseOrder',
    type: 1,
  },
  32: {
    name: 'Purchase Delivery',
    nameAr: 'سند استلام',
    ref: 'purchaseDelivery',
    type: 1,
  },
  33: {
    name: 'Purchase Return',
    nameAr: 'مرتجع مشتريات',
    ref: 'purchaseReturn',
    type: 1,
  },
  34: {
    name: 'Payemnt',
    nameAr: 'سند دفع',
    ref: 'supplierPayemnt',
    type: accountType.CREDIT,
  },
  35: {
    name: 'Purchase Discount',
    nameAr: 'خصم مشتريات',
    ref: 'supplierDiscount',
    type: accountType.CREDIT,
  },
  50: {
    name: 'Stock In',
    nameAr: 'وارد مخزن',
    ref: 'interDeliveryIn',
    type: 1,
  },
  51: {
    name: 'Stock Out',
    nameAr: 'صادر مخزن',
    ref: 'interDeliveryOut',
    type: 1,
  },
  60: {
    name: 'Expenses',
    nameAr: 'مصاريف',
    ref: 'expenses',
    type: accountType.DEBIT,
  },
  61: {
    name: 'Products Expenses',
    nameAr: 'استهلاك بضاعة',
    ref: 'expproducts',
    type: accountType.DEBIT,
  },
  62: {
    name: 'Petty Cash Expenses',
    nameAr: 'مصروف عهدة',
    ref: 'exppettycash',
    type: accountType.DEBIT,
  },
  63: {
    name: 'Payable Expenses',
    nameAr: 'مصروف موردين',
    ref: 'exppayable',
    type: accountType.DEBIT,
  },
  70: {
    name: 'Deposet',
    nameAr: 'ايداع',
    ref: 'deposet',
    type: 1,
  },
  71: {
    name: 'Draw - Partner',
    nameAr: 'سحب - شريك',
    ref: 'ownerDraw',
    type: 1,
  },
  72: {
    name: 'Deposit - Partner',
    nameAr: 'ايداع - شريك',
    ref: 'ownerDeposit',
    type: 1,
  },
  73: {
    name: 'Petty Cash Payment',
    nameAr: 'دفع عهدة',
    ref: 'pettyCashPay',
    type: 1,
  },
  74: {
    name: 'Petty Cash Receipt',
    nameAr: 'قبض عهدة',
    ref: 'pettyCashRec',
    type: 1,
  },
  75: {
    name: 'Cash Draw',
    nameAr: 'سحب من البنك',
    ref: 'cashDraw',
    type: 1,
  },
  76: {
    name: 'Cash Deposet',
    nameAr: 'ايداع في البنك',
    ref: 'cashDeposet',
    type: 1,
  },
  77: {
    name: 'Advance Receipt',
    nameAr: 'سند قبض سلفة',
    ref: 'advanceReceipt',
    type: 1,
  },
  78: {
    name: 'Advance Payemnt',
    nameAr: 'سند دفع سلفة',
    ref: 'advancePayemnt',
    type: 1,
  },

  80: {
    name: 'Appointment',
    nameAr: 'موعد',
    ref: 'event',
    type: accountType.DEBIT,
  },
  90: {
    name: 'Jornal Vaucher',
    nameAr: 'قيد يومية',
    ref: 'kaid',
    type: 1,
  },
  94: {
    name: 'Opening Balancee',
    nameAr: 'رصيد افتتاحي',
    ref: 'print',
    type: 1,
  },
  95: {
    name: 'Reminder',
    nameAr: 'تذكير',
    ref: 'reminder',
    type: 1,
  },
};

export const operationNames = {
  salesInvoice: 'Sales Invoice',
  salesQoutation: 'Sales Qoutation',
  salesDelivery: 'Sales Delivery',
  salesReturn: 'Sales Return',
  customerReceipt: 'Customer Receipt',
  customerDiscount: 'Customer Discount',
  purchaseInvoice: 'Purchase Invoice',
  purchaseOrder: 'Purchase Order',
  purchaseDelivery: 'Purchase Delivery',
  purchaseReturn: 'Purchase Return',
  supplierPayemnt: 'Supplier Payemnt',
  supplierDiscount: 'Supplier Discount',
  interDeliveryIn: 'Internal DeliveryIn',
  interDeliveryOut: 'Internal DeliveryOut',
  expenses: 'Expenses',
  expproducts: 'expproducts',
  exppettycash: 'exppettycash',
  exppayable: 'exppayable',
  deposet: 'Deposet',
  ownerDraw: 'Owner Draw',
  ownerDeposit: 'Owner Deposit',
  pettyCashPay: 'pettyCashPay',
  pettyCashRec: 'pettyCashRec',
  cashDraw: 'cashDraw',
  cashDeposet: 'cashDeposet',
  advanceReceipt: 'advanceReceipt',
  advancePayemnt: 'advancePayemnt',
  event: 'Event',
  task: 'Task',
  project: 'Project',

  // special transfare operation
  kaid: 'Kaid',
};

export const paymentTypes = {
  cash: 'Cash',
  card: 'Card',
  check: 'Check',
  bank: 'Bank',
};

export const catTypes = [
  { id: 1, name: 'Product', nameAr: 'منتج' },
  { id: 2, name: 'Service', nameAr: 'خدمة' },
  { id: 3, name: 'Expenses', nameAr: 'مصاريف' },
];

export const itemTypes = [
  { id: 1, name: 'Product', nameAr: 'منتج', value: 1 },
  { id: 2, name: 'Service', nameAr: 'خدمة', value: 2 },
  // { id: 3, name: 'nostockproduct', nameAr: 'مصاريف' },
  { id: 10, name: 'Expenses', nameAr: 'مصاريف', value: 10 },
];

export const departmentTypes = [
  { id: 1, name: 'General', nameAr: 'عام' },
  { id: 2, name: 'Employees', nameAr: 'موظفين' },
  { id: 3, name: 'Resourses', nameAr: 'موارد' },
];
export const retypeTypes = [
  { id: 1, name: 'Employees', nameAr: 'موظفين' },
  { id: 2, name: 'Resourses', nameAr: 'موارد' },
  { id: 3, name: 'Departments', nameAr: 'اقسام' },
  { id: 4, name: 'Appointments', nameAr: 'مواعيد' },
];
export const recTypes = [
  { id: 1, name: 'Customer', nameAr: 'عميل', value: 1 },
  { id: 2, name: 'Employee', nameAr: 'موظف', value: 2 },
];
export const payTypes = [
  { id: 1, name: 'Supplier', nameAr: 'مورد', value: 1 },
  { id: 2, name: 'Employee', nameAr: 'موظف', value: 2 },
];

export const statusTypes = {
  Scheduled: 1,
  Confirmed: 2,
  OnHold: 3,
  Canceled: 4,
  // start: 5,
  progress: 6,
  // end: 7,
  Completed: 10,
};

export const eventStatusEn = {
  1: 'Scheduled',
  2: 'Confirmed',
  3: 'On-Hold',
  4: 'Canceled',
  // 5: 'Starts',
  6: 'In Progress',
  // 7: 'Ends',
  10: 'Completed',
};
export const eventStatusAr = {
  1: 'موعد غير مؤكد',
  2: 'موعد مؤكد',
  3: 'موعد معلق',
  4: 'موعد ملغى',
  // 5: 'بدأ',
  6: 'قيد الانجاز',
  // 7: 'انتهى',
  10: 'موعد منجز',
};
export const eventStatus = [
  // { id: 1, name: 'Scheduled', nameAr: 'موعد غير مؤكد', color: '#445E93' },
  { id: 2, name: 'Confirmed', nameAr: 'موعد مؤكد', color: '#2AB7CA' },
  // { id: 3, name: 'On-Hold', nameAr: 'موعد معلق', color: '#FED766' },
  { id: 4, name: 'Canceled', nameAr: 'موعد ملغى', color: '#FE4A49' },
  // { id: 5, name: 'Starts', nameAr: 'بدأ', color: '#a084bb' },
  { id: 6, name: 'In Progress', nameAr: 'قيد الانجاز', color: '#a084bb' },
  // { id: 7, name: 'Ends', nameAr: 'انتهى', color: '#a084bb' },
  { id: 10, name: 'Completed', nameAr: 'موعد منجز', color: '#61E294' },
];

export const eventStatusShort = [
  { id: 1, name: 'Scheduled', nameAr: 'غير مؤكد', color: '#aa98bb' },
  { id: 2, name: 'Confirmed', nameAr: 'مؤكد', color: '#a084bb' },
  { id: 3, name: 'On-Hold', nameAr: 'معلق', color: '#b6abc2' },
  { id: 4, name: 'Canceled', nameAr: 'ملغى', color: '#b6abc2' },
  // { id: 5, name: 'Starts', nameAr: 'بدأ', color: '#f1Ea94' },
  { id: 6, name: 'In Progress', nameAr: 'قيد الانجاز', color: '#f1Ea94' },
  // { id: 7, name: 'Ends', nameAr: 'انتهى', color: '#f1Ea94' },
  { id: 10, name: 'Completed', nameAr: 'منجز', color: '#7bcf9b' },
];

export const taskStatus = [
  { id: 1, name: 'Not Started', nameAr: 'لم يبدأ', color: '#445E93' },
  { id: 2, name: 'In Progress', nameAr: 'قيد الانجاز', color: '#2AB7CA' },
  { id: 3, name: 'On-Hold', nameAr: 'معلق', color: '#FED766' },
  { id: 4, name: 'Canceled', nameAr: 'ملغى', color: '#FE4A49' },
  { id: 10, name: 'Completed', nameAr: 'منجز', color: '#61E294' },
];

export const getThemeStatus = (theme: any) => {
  return [
    {
      id: 10,
      name: 'Completed',
      nameAr: 'منجز',
      color: fade(theme.palette.primary.light, 0.9),
    },
    {
      id: 2,
      name: 'Confirmed',
      nameAr: 'مؤكد',
      color: fade(theme.palette.secondary.light, 0.8),
    },
    {
      id: 1,
      name: 'Scheduled',
      nameAr: 'غير مؤكد',
      color: fade(theme.palette.secondary.light, 0.6),
    },
    {
      id: 3,
      name: 'On-Hold',
      nameAr: 'معلق',
      color: fade(theme.palette.secondary.light, 0.4),
    },
    {
      id: 4,
      name: 'Canceled',
      nameAr: 'ملغى',
      color: fade(theme.palette.secondary.light, 0.2),
    },
    // {
    //   id: 5,
    //   name: 'Starts',
    //   nameAr: 'بدأ',
    //   color: fade(theme.palette.secondary.light, 0.5),
    // },
    {
      id: 6,
      name: 'In Progress',
      nameAr: 'قيد الانجاز',
      color: fade(theme.palette.secondary.light, 0.5),
    },
    // {
    //   id: 7,
    //   name: 'Ends',
    //   nameAr: 'انتهى',
    //   color: fade(theme.palette.secondary.light, 0.5),
    // },
  ];
};
export const departempl = [
  { id: 'employeeId', name: 'Employee', nameAr: 'الموظفين' },
  { id: 'departmentId', name: 'Department', nameAr: 'الأقسام' },
];

export const periods = [
  { id: 1, period: 'cm', name: 'Current Month', nameAr: 'الشهر الحالي' },
  { id: 2, period: 'pm', name: 'Previous Month', nameAr: 'الشهر السابق' },
  { id: 3, period: 'cy', name: 'Current Year', nameAr: 'السنة الحالية' },
  { id: 4, period: 'py', name: 'Previous Year', nameAr: 'السنة السابقة' },
];
export const carstatuss = [
  { id: 1, name: 'Available', nameAr: 'متوفرة', color: colors.green[400] },
  { id: 2, name: 'In Garage', nameAr: 'قيد الصيانة', color: colors.grey[400] },
  { id: 3, name: 'Broken', nameAr: 'معطلة', color: colors.red[400] },
  { id: 10, name: 'Busy', nameAr: 'مشغولة', color: colors.blue[400] },
];

export const eventColors = {
  1: '#7b7b7d',
  2: '#3843d2',
  3: '#ffa500',
  4: '#ff4040',
  5: '#f1Ea94',
  6: '#f1Ea94',
  7: '#f1Ea94',
  10: '#008000',
};

export const weekdays = {
  sat: false,
  sun: false,
  mon: false,
  tue: false,
  wed: false,
  thu: false,
  fri: false,
};
export const weekdaysNNo = {
  6: 'sat',
  0: 'sun',
  1: 'mon',
  2: 'tue',
  3: 'wed',
  4: 'thu',
  5: 'fri',
};

export const weekdaysObj = {
  sat: {
    id: 6,
    name: 'Saturday',
    nameAr: 'السبت',
    short: 'sat',
  },
  sun: {
    id: 0,
    name: 'Sunday',
    nameAr: 'الاحد',
    short: 'sun',
  },
  mon: {
    id: 1,
    name: 'Monday',
    nameAr: 'الأثنين',
    short: 'mon',
  },
  tue: {
    id: 2,
    name: 'Tuesday',
    nameAr: 'الثلاثاء',
    short: 'tue',
  },
  wed: {
    id: 3,
    name: 'Wednesday',
    nameAr: 'الأربعاء',
    short: 'wed',
  },
  thu: {
    id: 4,
    name: 'Thursday',
    nameAr: 'الخميس',
    short: 'thu',
  },
  fri: {
    id: 5,
    name: 'Friday',
    nameAr: 'الجمعة',
    short: 'fri',
  },
};

export const dayslist = [
  {
    id: 6,
    name: 'Saturday',
    nameAr: 'السبت',
    short: 'sat',
  },
  {
    id: 0,
    name: 'Sunday',
    nameAr: 'الاحد',
    short: 'sun',
  },
  {
    id: 1,
    name: 'Monday',
    nameAr: 'الأثنين',
    short: 'mon',
  },
  {
    id: 2,
    name: 'Tuesday',
    nameAr: 'الثلاثاء',
    short: 'tue',
  },
  {
    id: 3,
    name: 'Wednesday',
    nameAr: 'الأربعاء',
    short: 'wed',
  },
  {
    id: 4,
    name: 'Thursday',
    nameAr: 'الخميس',
    short: 'thu',
  },
  {
    id: 5,
    name: 'Friday',
    nameAr: 'الجمعة',
    short: 'fri',
  },
];
