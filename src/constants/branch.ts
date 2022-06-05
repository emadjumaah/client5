export const appSystems = [
  { basename: 'cal', name: 'Calendar', nameAr: 'جدول المواعيد' },
  { basename: 'pos', name: 'Sales System', nameAr: 'نظام مبيعات' },
  { basename: 'pur', name: 'Purchase System', nameAr: 'نظام مبيعات' },
  { basename: 'exp', name: 'Expenses System', nameAr: 'نظام المصروفات' },
  { basename: 'inv', name: 'Inventory System', nameAr: 'نظام المخازن' },
  { basename: 'hr', name: 'HR Managment', nameAr: 'إدارة الموارد البشرية' },
  { basename: 'ass', name: 'Assets Managment', nameAr: 'إدارة الأصول' },
  { basename: 'acc', name: 'General Accounting', nameAr: 'حسابات عامة' },
];

export const systemTypes = {
  cal: 'cal',
  pos: 'pos',
  pur: 'pur',
  exp: 'exp',
  inv: 'inv',
  hr: 'hr',
  ass: 'ass',
  acc: 'acc',
};

export const defaultSystems = [
  'cal',
  'pos',
  'exp',
  'pur',
  'inv',
  'hr',
  'ass',
  'acc',
];

export const taskTypes = [
  {
    id: 1,
    name: 'One Appointment',
    nameAr: 'موعد واحد',
  },
  {
    id: 2,
    name: 'Multi Appointments',
    nameAr: 'مواعيد متعددة',
  },
  {
    id: 3,
    name: 'Rent & Services',
    nameAr: 'خدمات وتأجير',
  },
];

export const getTaskName = ({ id, isRTL }) => {
  const taskname = taskTypes.filter((tt: any) => tt.id === id);
  if (taskname && taskname.length > 0) {
    return isRTL ? taskname[0].nameAr : taskname[0].name;
  } else {
    return '';
  }
};
