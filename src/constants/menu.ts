import { menuRoles } from '../common/roles';
import { getStoreItem } from '../store';

const store = getStoreItem('store');
const template = store?.template;
const lang = store?.lang;
const words = template?.words?.[lang];
const options = template?.options;
const isRTL = lang === 'ar';
const tempId = template?.id;

export const mainmenu = [
  {
    id: 0,
    name: 'home',
    uri: '/',
    titleAr: 'الرئيسية',
    titleEn: 'Home',
    icon: 'home',
    req: null,
    dep: null,
  },
  {
    id: 0.5,
    name: 'calendar',
    uri: 'calendar',
    titleAr: 'التقويم',
    titleEn: 'Calendar',
    icon: 'calendar',
    req: 'cal',
    dep: 'pos',
    role: menuRoles.operateEditor,
  },
  {
    id: 0.6,
    name: 'appointments',
    uri: 'appointments',
    titleAr: words?.appointments,
    titleEn: words?.appointments,
    icon: 'event',
    req: 'cal',
    dep: 'pos',
    role: menuRoles.operateWriter,
  },
  {
    id: 1,
    name: 'managment',
    uri: '/managment',
    titleAr: 'الإدارة',
    titleEn: 'Managment',
    icon: 'depart',
    req: null,
    dep: null,
    role: menuRoles.operateWriter,
    subMenu: [
      {
        id: 11,
        name: 'manageprojects',
        uri: 'manageprojects',
        titleAr: words?.projects,
        titleEn: words?.projects,
        icon: 'project',
        req: 'cal',
        dep: 'pos',
        hide: options?.noPro,
        role: menuRoles.writer,
      },
      {
        id: 12,
        name: 'tasks',
        uri: 'tasks',
        titleAr: words?.tasks,
        titleEn: words?.tasks,
        icon: 'work',
        req: 'cal',
        dep: 'pos',
        hide: options?.noTsk,
        role: menuRoles.writer,
      },
      {
        id: 15,
        name: 'managedepartments',
        uri: 'managedepartments',
        titleAr: `ادارة ${words?.departments}`,
        titleEn: `${words?.departments} Mangment`,
        icon: 'depart',
        req: null,
        dep: null,
      },
      {
        id: 16,
        name: 'manageemployees',
        uri: 'manageemployees',
        titleAr: `ادارة ${words?.employees}`,
        titleEn: `${words?.employees} Mangment`,
        icon: 'group',
        req: null,
        dep: null,
      },

      {
        id: 17,
        name: 'manageresourses',
        uri: 'manageresourses',
        titleAr: `ادارة ${words?.resourses}`,
        titleEn: `${words?.resourses} Mangment`,
        icon: 'resourse',
        req: null,
        dep: null,
        hide: options?.noRes,
      },
      {
        id: 18,
        name: 'calendarempl',
        uri: 'calendarempl',
        titleAr: 'جدول الموظفين',
        titleEn: 'Employees Calendar',
        mainId: 8,
        req: 'cal',
        dep: 'pos',
        hide: [4, 6, 7].includes(tempId),
      },
      {
        id: 19,
        name: 'calreports',
        uri: 'calreports',
        titleAr: `تقرير ${words?.appointments}`,
        titleEn: `${words?.appointments} Report`,
        req: 'cal',
        dep: 'pos',
      },
      {
        id: 191,
        name: 'docreports',
        uri: 'docreports',
        titleAr: 'تقرير الوثائق',
        titleEn: 'Documents Report',
        req: 'cal',
        dep: 'pos',
        role: menuRoles.admin,
      },
    ],
  },

  {
    id: 2,
    name: 'sales',
    uri: '/sales',
    titleAr: 'المبيعات',
    titleEn: 'Sales',
    icon: 'expenses',
    req: null,
    dep: null,
    role: menuRoles.operateWriter,
    subMenu: [
      {
        id: 21,
        name: 'invoices',
        uri: 'invoices',
        titleAr: 'فواتير البيع',
        titleEn: 'Invoices',
        mainId: 7,
        req: 'pos',
        dep: null,
        role: menuRoles.writer,
      },
      {
        id: 22,
        name: 'receipts',
        uri: 'receipts',
        titleAr: 'المقبوضات',
        titleEn: 'Receipts',
        icon: 'finance',
        mainId: 7,
        req: null,
        dep: null,
        role: menuRoles.writer,
      },
      {
        id: 23,
        name: 'customers',
        uri: 'customers',
        titleAr: words?.customers,
        titleEn: words?.customers,
        icon: 'business',
        req: 'pos',
        dep: null,
      },
      {
        id: 24,
        name: 'customerreport',
        uri: 'customerreport',
        titleAr: 'تقرير العملاء',
        titleEn: 'Customer Report',
        role: menuRoles.editor,
        mainId: 8,
        req: 'pos',
        dep: null,
      },
      {
        id: 25,
        name: 'salesreport',
        uri: 'salesreport',
        titleAr: 'تقرير الايرادات',
        titleEn: 'Sales Report',
        role: menuRoles.editor,
        mainId: 8,
        req: 'pos',
        dep: null,
      },
    ],
  },

  {
    id: 3,
    name: 'purchasestock',
    uri: '/purchasestock',
    titleAr: 'المشتريات',
    titleEn: 'Purchase',
    icon: 'inventory',
    req: null,
    dep: null,
    role: menuRoles.operateWriter,
    subMenu: [
      {
        id: 31,
        name: 'purchase',
        uri: 'purchase',
        titleAr: 'فواتير الشراء',
        titleEn: 'Purchase',
        mainId: 7,
        req: 'pos',
        dep: null,
        role: menuRoles.writer,
      },
      {
        id: 32,
        name: 'payments',
        uri: 'payments',
        titleAr: 'المدفوعات',
        titleEn: 'Payments',
        icon: 'finance',
        mainId: 7,
        req: null,
        dep: null,
        role: menuRoles.writer,
      },
      {
        id: 33,
        name: 'supliers',
        uri: 'supliers',
        titleAr: words?.suppliers,
        titleEn: words?.suppliers,
        icon: 'business',
        req: 'pos',
        dep: null,
      },
      {
        id: 34,
        name: 'supplierreport',
        uri: 'supplierreport',
        titleAr: 'تقرير الموردين',
        titleEn: 'Supplier Report',
        role: menuRoles.editor,
        mainId: 8,
        req: 'pos',
        dep: null,
      },
      {
        id: 35,
        name: 'stockreport',
        uri: 'stockreport',
        titleAr: 'تقرير المخازن',
        titleEn: 'Stock Report',
        role: menuRoles.editor,
        mainId: 8,
        req: 'pos',
        dep: null,
      },
      {
        id: 36,
        name: 'stockitems',
        uri: 'stockitems',
        titleAr: 'البضاعة المتوفرة',
        titleEn: 'Stock Items',
        role: menuRoles.editor,
        mainId: 8,
        req: 'pos',
        dep: null,
      },
    ],
  },

  {
    id: 4,
    name: 'expensesandpro',
    uri: 'expensesandpro',
    titleAr: 'المصروفات',
    titleEn: 'Expenses',
    icon: 'expenses',
    req: 'pos',
    dep: null,
    subMenu: [
      {
        id: 41,
        name: 'expenses',
        uri: 'expenses',
        titleAr: 'المصروفات النقدية',
        titleEn: 'Expenses',
        icon: 'expenses',
        mainId: 7,
        req: 'exp',
        dep: null,
        role: menuRoles.financeWriter,
      },
      {
        id: 42,
        name: 'expproducts',
        uri: 'expproducts',
        titleAr: 'استهلاك البضاعة',
        titleEn: 'Products Expenses',
        icon: 'expenses',
        mainId: 7,
        req: 'exp',
        dep: null,
        role: menuRoles.financeWriter,
      },

      {
        id: 45,
        name: 'expensesreport',
        uri: 'expensesreport',
        titleAr: 'تقرير المصروفات',
        titleEn: 'Expenses Report',
        mainId: 8,
        req: 'exp',
        dep: null,
        role: menuRoles.financeAdmin,
      },
    ],
  },
  {
    id: 5,
    name: 'financeexpenses',
    uri: 'financeexpenses',
    titleAr: 'الحسابات',
    titleEn: 'Accountant',
    icon: 'business',
    req: 'pos',
    dep: null,
    subMenu: [
      {
        id: 51,
        name: 'financeall',
        uri: 'financeall',
        titleAr: 'قيد اليومية',
        titleEn: 'General Journal',
        icon: 'finance',
        mainId: 7,
        req: null,
        dep: null,
        role: menuRoles.financeWriter,
      },
      {
        id: 52,
        name: 'accounts',
        uri: 'accounts',
        titleAr: 'قائمة الحسابات',
        titleEn: 'Accounts',
        icon: 'account',
        role: menuRoles.financeEditor,
        req: null,
        dep: null,
      },

      {
        id: 53,
        name: 'financereport',
        uri: 'financereport',
        titleAr: 'تقرير الحسابات',
        titleEn: 'Finance Report',
        role: menuRoles.financeEditor,
        mainId: 8,
        req: null,
        dep: null,
      },

      {
        id: 54,
        name: 'budgetreport',
        uri: 'budgetreport',
        titleAr: 'الحسابات الختامية',
        titleEn: 'Closing Accounts',
        role: menuRoles.financeEditor,
        mainId: 8,
        req: null,
        dep: null,
      },
    ],
  },

  {
    id: 6,
    name: 'items',
    uri: 'items',
    titleAr: 'البنود',
    titleEn: 'Items',
    icon: 'add',
    req: null,
    dep: null,
    subMenu: [
      {
        id: 61,
        name: 'services',
        uri: 'services',
        titleAr: 'الخدمات',
        titleEn: 'Services',
        mainId: 5.66,
        req: 'pos',
        dep: null,
        role: menuRoles.writer,
      },
      {
        id: 62,
        name: 'products',
        uri: 'products',
        titleAr: 'المنتجات',
        titleEn: 'Products',
        mainId: 5.66,
        req: 'pos',
        dep: null,
        role: menuRoles.writer,
      },

      {
        id: 63,
        name: 'expenseitems',
        uri: 'expenseitems',
        titleAr: 'المصروفات',
        titleEn: 'Expense Items',
        mainId: 5.66,
        req: null,
        dep: null,
        role: menuRoles.writer,
      },
      {
        id: 64,
        name: 'servicesreports',
        uri: 'servicesreports',
        titleAr: 'تقرير البنود',
        titleEn: 'Items Report',
        req: 'cal',
        dep: 'pos',
      },
    ],
  },

  {
    id: 7,
    name: 'reminders',
    uri: 'reminders',
    titleAr: 'المفكرة',
    titleEn: 'Reminders',
    icon: 'belladd',
    req: 'cal',
    dep: 'pos',
    role: menuRoles.editor,
    subMenu: [
      {
        id: 71,
        name: 'managereminders',
        uri: 'managereminders',
        titleAr: 'ادارة التذكيرات',
        titleEn: 'Manage Reminders',
        mainId: 5.66,
        req: 'pos',
        dep: null,
        role: menuRoles.writer,
      },

      {
        id: 72,
        name: 'viewreminders',
        uri: 'viewreminders',
        titleAr: 'التذكيرات',
        titleEn: 'Reminders',
        mainId: 5.66,
        req: null,
        dep: null,
        role: menuRoles.writer,
      },
    ],
  },

  {
    id: 8,
    name: 'sms',
    uri: 'sms',
    titleAr: 'رسائل SMS',
    titleEn: 'SMS Messages',
    icon: 'email',
    req: 'pos',
    dep: null,
    subMenu: [
      {
        id: 81,
        name: 'contacts',
        uri: 'contacts',
        titleAr: 'جهات الاتصال',
        titleEn: 'Contacts',
        icon: 'group',
        req: 'pos',
        dep: null,
      },
      {
        id: 8,
        name: 'groups',
        uri: 'groups',
        titleAr: 'المجموعات',
        titleEn: 'Groups',
        req: 'pos',
        icon: 'list',
        dep: null,
      },
      {
        id: 83,
        name: 'messages',
        uri: 'messages',
        titleAr: 'الرسائل',
        titleEn: 'Messages',
        req: 'pos',
        icon: 'email',
        dep: null,
      },
      {
        id: 84,
        name: 'sendreqs',
        uri: 'sendreqs',
        titleAr: 'حملات الارسال',
        titleEn: 'SMS campaign',
        icon: 'camp',
        req: 'pos',
        dep: null,
      },
    ],
  },

  {
    id: 9,
    name: 'users',
    uri: 'users',
    titleAr: 'المستخدمين',
    titleEn: 'Users',
    role: menuRoles.branchAdmin,
    icon: 'user',
    req: null,
    dep: null,
  },
  {
    id: 10,
    name: 'notifications',
    uri: 'notifications',
    titleAr: 'التنبيهات',
    titleEn: 'Notifications',
    icon: 'bell',
    req: 'cal',
    dep: 'pos',
  },
  {
    id: 11,
    name: 'branches',
    uri: 'branches',
    titleAr: 'الشركات',
    titleEn: 'Companies',
    icon: 'business',
    role: menuRoles.superAdmin,
    req: null,
    dep: null,
  },
  {
    id: 12,
    name: 'options',
    uri: 'options',
    titleAr: 'الاعدادات',
    titleEn: 'Options',
    icon: 'options',
    req: null,
    dep: null,
  },
];
export const emplmenu = [
  {
    id: 1,
    name: 'calendar',
    uri: '/',
    titleAr: 'التقويم',
    titleEn: 'Calendar',
    icon: 'calendar',
    req: 'cal',
    dep: 'pos',
  },
  {
    id: 2,
    name: 'appointments',
    uri: 'appointments',
    titleAr: words?.appointments,
    titleEn: words?.appointments,
    icon: 'event',
    req: 'cal',
    dep: 'pos',
  },
  {
    id: 3,
    name: 'tasks',
    uri: 'tasks',
    titleAr: words?.tasks,
    titleEn: words?.tasks,
    icon: 'work',
    req: 'cal',
    dep: 'pos',
  },

  {
    id: 4,
    name: 'options',
    uri: 'options',
    titleAr: 'الاعدادات',
    titleEn: 'Options',
    icon: 'options',
    req: null,
    dep: null,
  },
  {
    id: 99,
    name: 'logout',
    uri: 'logout',
    titleAr: 'تسجيل الخروج',
    titleEn: 'Logout',
    icon: 'logout',
    req: null,
    dep: null,
  },
];

export const systemsNames = {
  cal: {
    name: 'Calendar',
    nameAr: 'جدول المواعيد',
  },
  pos: {
    name: 'Sales',
    nameAr: 'نظام المبيعات',
  },
  pur: {
    name: 'Purchase',
    nameAr: 'نظام المشتريات',
  },
  exp: {
    name: 'Expenses',
    nameAr: 'نظام المصروفات',
  },
  inv: {
    name: 'Inventory',
    nameAr: 'نظام المخازن',
  },
  hr: {
    name: 'Human Resources',
    nameAr: 'نظام الموارد البشرية',
  },
  ass: {
    name: 'Assets Accounting',
    nameAr: 'نظام حسابات الأصول',
  },
  acc: {
    name: 'General Accounting',
    nameAr: 'نظام الحسابات العامة',
  },
};

export const getPopupTitle = (item: any, isNew: boolean) => {
  const addAr = `${words?.[item]} جديد`;
  const add = `Add ${words?.[item]}`;
  const editAr = `تعديل ${words?.[item]}`;
  const edit = `Edit ${words?.[item]}`;
  return isNew ? (isRTL ? addAr : add) : isRTL ? editAr : edit;
};
export const getPopupGeneralTitle = (item: any) => {
  const gtitleAr = `بيانات ${words?.[item]}`;
  const gtitle = `${words?.[item]}`;
  return isRTL ? gtitleAr : gtitle;
};

export const sortMenu = ({ menu, sortOrder }) => {
  if (!sortOrder) return menu;

  const itemPositions = {};
  for (const [index, id] of sortOrder.entries()) {
    itemPositions[id] = index;
  }

  return menu.sort(
    (a: any, b: any) => itemPositions[a.id] - itemPositions[b.id]
  );
};
