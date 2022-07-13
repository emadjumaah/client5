import { operationTypes } from '.';
import { getStoreItem } from '../store';

const store = getStoreItem('store');
const template = store?.template;
const lang = store?.lang;
const words = template?.words?.[lang];
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export const groupList = (isRTL: any, product = false) => [
  {
    id: 1,
    value: 'none',
    name: isRTL ? 'بدون تجميع' : 'No Grouping',
  },
  {
    id: 2,
    value: 'employee',
    name: isRTL ? `تجميع بحسب ${words.employee}` : `Group By ${words.employee}`,
  },
  {
    id: 3,
    value: 'department',
    name: isRTL
      ? `تجميع بحسب ${words.department}`
      : `Group By ${words.department}`,
  },
  {
    id: 4,
    value: 'service',
    name: isRTL ? 'تجميع بحسب البند' : 'Group By Item',
  },
  {
    id: 5,
    value: 'customer',
    name: isRTL ? `تجميع بحسب ${words.customer}` : `Group By ${words.customer}`,
  },
  {
    id: 5.5,
    value: 'supplier',
    name: isRTL ? `تجميع بحسب المورد` : `Group By Supplier`,
  },
  {
    id: 6,
    value: 'category',
    name: isRTL ? 'تجميع بحسب التصنيف' : 'Group By Category',
  },
  {
    id: 7,
    value: 'status',
    name: isRTL ? 'تجميع بحسب الحالة' : 'Group By status',
  },
  {
    id: 8,
    value: 'contractId',
    name: isRTL ? `تجميع بحسب ${words.task}` : `Group By  ${words.task}`,
  },
  {
    id: 9,
    value: 'opType',
    name: isRTL ? 'تجميع بحسب الوثيقة' : 'Group By Document',
  },
  {
    id: 10,
    value: 'project',
    name: isRTL ? `تجميع بحسب ${words.project}` : `Group By ${words.project}`,
  },
  {
    id: 11,
    value: 'resourse',
    name: isRTL ? `تجميع بحسب ${words.resourse}` : `Group By ${words.resourse}`,
  },
];

export const documentTypes = [
  {
    id: 1,
    value: 'none',
    name: 'All',
    nameAr: 'الكل',
  },
  {
    id: 2,
    value: operationTypes.event,
    name: 'Appointment',
    nameAr: 'المواعيد',
  },
  {
    id: 3,
    value: operationTypes.salesInvoice,
    name: 'Sales Invoices',
    nameAr: 'فواتير البيع',
  },
  {
    id: 4,
    value: operationTypes.customerReceipt,
    name: 'Receipts',
    nameAr: 'سندات القبض',
  },
  {
    id: 5,
    value: operationTypes.purchaseInvoice,
    name: 'Purchase Invoices',
    nameAr: 'فواتير الشراء',
  },
  {
    id: 6,
    value: operationTypes.supplierPayemnt,
    name: 'Payemnts',
    nameAr: 'سندات الدفع',
  },
  {
    id: 7,
    value: operationTypes.expenses,
    name: 'Expenses',
    nameAr: 'المصروفات',
  },
  {
    id: 8,
    value: operationTypes.expproducts,
    name: 'Products Expenses',
    nameAr: 'استهلاك البضاعة',
  },
  {
    id: 9,
    value: operationTypes.cashDeposet,
    name: 'Cash Deposet',
    nameAr: 'ايداع في البنك',
  },
  {
    id: 10,
    value: operationTypes.cashDraw,
    name: 'Cash Draw',
    nameAr: 'سحب من البنك',
  },
  {
    id: 11,
    value: operationTypes.pettyCashPay,
    name: 'Petty Cash Payment',
    nameAr: 'دفع عهدة',
  },
  {
    id: 12,
    value: operationTypes.pettyCashRec,
    name: 'Petty Cash Receipt',
    nameAr: 'قبض عهدة',
  },
  {
    id: 13,
    value: operationTypes.kaid,
    name: 'Jornal Vaucher',
    nameAr: 'قيود اليومية',
  },
];

export const sectionTypes = [
  {
    id: 1,
    value: 1,
    name: 'Managment',
    nameAr: 'اداري',
  },
  {
    id: 2,
    value: 2,
    name: 'Operational',
    nameAr: 'فني',
  },
];
