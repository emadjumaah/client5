import { operationTypes } from '.';
import { getStoreItem } from '../store';

const store = getStoreItem('store');
const template = store?.template;
const lang = store?.lang;
const words = template?.words?.[lang];
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export const groupList = (isRTL: any) => [
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
    name: isRTL ? 'تجميع بحسب الخدمة' : 'Group By Service',
  },
  {
    id: 5,
    value: 'customer',
    name: isRTL ? `تجميع بحسب ${words.customer}` : `Group By ${words.customer}`,
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
    value: 'taskId',
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
    name: 'Invoice',
    nameAr: 'الفواتير',
  },
  {
    id: 4,
    value: operationTypes.customerReceipt,
    name: 'Receipt',
    nameAr: 'المقبوض',
  },
  {
    id: 6,
    value: operationTypes.expenses,
    name: 'Expenses',
    nameAr: 'المصروف',
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
