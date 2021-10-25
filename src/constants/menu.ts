import { menuRoles } from '../common/roles';
import { getStoreItem } from '../store';

const store = getStoreItem('store');
const template = store?.template;
const lang = store?.lang;
const words = template?.words?.[lang];
const options = template?.options;
const isRTL = lang === 'ar';
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
  },
  {
    id: 1,
    name: 'appointments',
    uri: 'appointments',
    titleAr: words?.appointments,
    titleEn: words?.appointments,
    icon: 'event',
    req: 'cal',
    dep: 'pos',
  },
  {
    id: 1.5,
    name: 'tasks',
    uri: 'tasks',
    titleAr: words?.tasks,
    titleEn: words?.tasks,
    icon: 'work',
    req: 'cal',
    dep: 'pos',
  },
  {
    id: 2,
    name: 'managedepartments',
    uri: 'managedepartments',
    titleAr: words?.departments,
    titleEn: words?.departments,
    icon: 'depart',
    req: null,
    dep: null,
  },
  {
    id: 3,
    name: 'customers',
    uri: 'customers',
    titleAr: words?.customers,
    titleEn: words?.customers,
    icon: 'business',
    req: 'pos',
    dep: null,
  },
  {
    id: 4,
    name: 'manageemployees',
    uri: 'manageemployees',
    titleAr: words?.employees,
    titleEn: words?.employees,
    icon: 'group',
    req: null,
    dep: null,
  },
  {
    id: 5,
    name: 'manageresourses',
    uri: 'manageresourses',
    titleAr: words?.resourses,
    titleEn: words?.resourses,
    icon: 'resourse',
    req: null,
    dep: null,
    hide: options?.noRes,
  },

  {
    id: 6,
    name: 'finance',
    uri: 'finance',
    titleAr: 'الوثائق',
    titleEn: 'Finance',
    icon: 'sales',
    req: 'pos',
    dep: null,
    subMenu: [
      {
        id: 61,
        name: 'sales',
        uri: 'sales',
        titleAr: 'الفواتير',
        titleEn: 'Sales',
        mainId: 6,
        req: 'pos',
        dep: null,
      },

      {
        id: 63,
        name: 'receipts',
        uri: 'receipts',
        titleAr: 'المقبوضات',
        titleEn: 'Receipts',
        icon: 'finance',
        mainId: 6,
        req: null,
        dep: null,
      },
      {
        id: 64,
        name: 'expenses',
        uri: 'expenses',
        titleAr: 'المصاريف',
        titleEn: 'Expenses',
        icon: 'expenses',
        mainId: 6,
        req: 'exp',
        dep: null,
      },
      {
        id: 65,
        name: 'financeall',
        uri: 'financeall',
        titleAr: 'القيود العامة',
        titleEn: 'General Accounting',
        icon: 'finance',
        mainId: 6,
        req: null,
        dep: null,
      },
    ],
  },

  {
    id: 7,
    name: 'adds',
    uri: 'adds',
    titleAr: 'الاضافات',
    titleEn: 'Additions',
    icon: 'add',
    req: null,
    dep: null,
    subMenu: [
      {
        id: 72,
        name: 'departments',
        uri: 'departments',
        titleAr: words?.servicesdeparts,
        titleEn: words?.servicesdeparts,
        mainId: 7,
        req: null,
        dep: null,
        hide: options?.noServDep,
      },
      {
        id: 73,
        name: 'employees',
        uri: 'employees',
        titleAr: words?.servicesempls,
        titleEn: words?.servicesempls,
        mainId: 7,
        req: null,
        dep: null,
        hide: options?.noServEmp,
      },
      {
        id: 74,
        name: 'resourses',
        uri: 'resourses',
        titleAr: words?.servicesress,
        titleEn: words?.servicesress,
        mainId: 7,
        req: null,
        dep: null,
        hide: options?.noServRes,
      },
      {
        id: 75,
        name: 'services',
        uri: 'services',
        titleAr: words?.services,
        titleEn: words?.services,
        mainId: 7,
        req: null,
        dep: null,
      },
    ],
  },
  {
    id: 8,
    name: 'reports',
    uri: 'reports',
    titleAr: 'التقارير',
    titleEn: 'Reports',
    icon: 'report',
    req: null,
    dep: null,
    subMenu: [
      {
        id: 81,
        name: 'calendarempl',
        uri: 'calendarempl',
        titleAr: 'جدول الموظفين',
        titleEn: 'Employees Calendar',
        mainId: 8,
        req: 'cal',
        dep: 'pos',
      },
      {
        id: 82,
        name: 'calreports',
        uri: 'calreports',
        titleAr: 'تقرير المواعيد',
        titleEn: 'Calendar Report',
        req: 'cal',
        dep: 'pos',
      },
      {
        id: 82.5,
        name: 'docreports',
        uri: 'docreports',
        titleAr: 'تقرير الوثائق',
        titleEn: 'Documents Report',
        req: 'cal',
        dep: 'pos',
      },
      {
        id: 82.8,
        name: 'servicesreports',
        uri: 'servicesreports',
        titleAr: 'تقرير الخدمات',
        titleEn: 'Services Report',
        req: 'cal',
        dep: 'pos',
      },
      {
        id: 83,
        name: 'salesreport',
        uri: 'salesreport',
        titleAr: 'تقرير الايرادات',
        titleEn: 'Sales Report',
        role: menuRoles.editor,
        mainId: 8,
        req: 'pos',
        dep: null,
      },
      {
        id: 84,
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
        id: 76,
        name: 'expensesreport',
        uri: 'expensesreport',
        titleAr: 'تقرير المصاريف',
        titleEn: 'Expenses Report',
        mainId: 7,
        req: 'exp',
        dep: null,
      },
      {
        id: 77,
        name: 'financereport',
        uri: 'financereport',
        titleAr: 'تقرير الحسابات',
        titleEn: 'Finance Report',
        role: menuRoles.editor,
        mainId: 7,
        req: null,
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
    name: 'accounts',
    uri: 'accounts',
    titleAr: 'الحسابات',
    titleEn: 'Accounts',
    icon: 'account',
    role: menuRoles.branchAdmin,
    req: null,
    dep: null,
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
];

export const addButtonsList = [
  {
    id: 1,
    name: 'category',
    titleAr: 'التصنيفات',
    titleEn: 'Categories',
  },
  {
    id: 2,
    name: 'brand',
    titleAr: 'البراندات',
    titleEn: 'Brands',
  },
  {
    id: 3,
    name: 'service',
    titleAr: 'الخدمات',
    titleEn: 'Services',
  },
  {
    id: 4,
    name: 'product',
    titleAr: 'البضاعة',
    titleEn: 'Products',
  },
  {
    id: 5,
    name: 'customer',
    titleAr: 'العملاء',
    titleEn: 'Customers',
  },
  {
    id: 6,
    name: 'company',
    titleAr: 'الشركة',
    titleEn: 'Company',
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
    nameAr: 'نظام المصاريف',
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
  const addAr = `${words[item]} جديد`;
  const add = `Add ${words[item]}`;
  const editAr = `تعديل ${words[item]}`;
  const edit = `Edit ${words[item]}`;
  return isNew ? (isRTL ? addAr : add) : isRTL ? editAr : edit;
};
export const getPopupGeneralTitle = (item: any) => {
  const gtitleAr = `بيانات ${words[item]}`;
  const gtitle = `${words[item]}`;
  return isRTL ? gtitleAr : gtitle;
};
