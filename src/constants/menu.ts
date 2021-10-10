import { menuRoles } from "../common/roles";
import { getStoreItem } from "../store";
const store = getStoreItem("store");
const names = store?.names;
export const mainmenu = [
  {
    id: 0,
    name: "home",
    uri: "/",
    titleAr: "الرئيسية",
    titleEn: "Home",
    icon: "home",
    req: null,
    dep: null,
  },
  {
    id: 0.5,
    name: "calendar",
    uri: "calendar",
    titleAr: "التقويم",
    titleEn: "Calendar",
    icon: "calendar",
    req: "cal",
    dep: "pos",
  },
  {
    id: 1,
    name: "appointments",
    uri: "appointments",
    titleAr: "المواعيد",
    titleEn: "Appointments",
    icon: "event",
    req: "cal",
    dep: "pos",
  },
  {
    id: 1.5,
    name: "tasks",
    uri: "tasks",
    titleAr: names?.tasks ? names?.tasks : "المهام",
    titleEn: names?.tasks ? names?.tasks : "Operations",
    icon: "work",
    req: "cal",
    dep: "pos",
  },
  {
    id: 3,
    name: "managments",
    uri: "managments",
    titleAr: "الإدارات",
    titleEn: "Managment",
    icon: "business",
    req: "pos",
    dep: null,
    subMenu: [
      {
        id: 31,
        name: "customers",
        uri: "customers",
        titleAr: names?.customers ? names?.customers : "العملاء",
        titleEn: names?.customers ? names?.customers : "Customers",
        icon: "business",
        mainId: 3,
        req: "pos",
        dep: null,
      },
      {
        id: 32,
        name: "manageemployees",
        uri: "manageemployees",
        titleAr: names?.employees ? names?.employees : "الموظفين",
        titleEn: names?.employees ? names?.employees : "Employees",
        icon: "group",
        mainId: 3,
        req: null,
        dep: null,
      },
      {
        id: 33,
        name: "manageresourses",
        uri: "manageresourses",
        titleAr: names?.resourses ? names?.resourses : "الموارد",
        titleEn: names?.resourses ? names?.resourses : "Resourses",
        icon: "group",
        mainId: 3,
        req: null,
        dep: null,
      },
      {
        id: 34,
        name: "managedepartments",
        uri: "managedepartments",
        titleAr: names?.departments ? names?.departments : "الأقسام",
        titleEn: names?.departments ? names?.departments : "Departments",
        icon: "depart",
        mainId: 3,
        req: null,
        dep: null,
      },
    ],
  },

  {
    id: 4,
    name: "finance",
    uri: "finance",
    titleAr: "الوثائق",
    titleEn: "Finance",
    icon: "sales",
    req: "pos",
    dep: null,
    subMenu: [
      {
        id: 41,
        name: "sales",
        uri: "sales",
        titleAr: "الفواتير",
        titleEn: "Sales",
        mainId: 4,
        req: "pos",
        dep: null,
      },

      {
        id: 43,
        name: "receipts",
        uri: "receipts",
        titleAr: "المقبوضات",
        titleEn: "Receipts",
        icon: "finance",
        mainId: 4,
        req: null,
        dep: null,
      },
      {
        id: 44,
        name: "expenses",
        uri: "expenses",
        titleAr: "المصاريف",
        titleEn: "Expenses",
        icon: "expenses",
        mainId: 4,
        req: "exp",
        dep: null,
      },
      {
        id: 45,
        name: "financeall",
        uri: "financeall",
        titleAr: "القيود العامة",
        titleEn: "General Accounting",
        icon: "finance",
        mainId: 4,
        req: null,
        dep: null,
      },
    ],
  },

  {
    id: 6,
    name: "adds",
    uri: "adds",
    titleAr: "الاضافات",
    titleEn: "Additions",
    icon: "add",
    req: null,
    dep: null,
    subMenu: [
      {
        id: 62,
        name: "departments",
        uri: "departments",
        titleAr: "أقسام الخدمات",
        titleEn: "Service Departments",
        mainId: 6,
        req: null,
        dep: null,
      },
      {
        id: 63,
        name: "employees",
        uri: "employees",
        titleAr: "فني الخدمات",
        titleEn: "Service Employees",
        mainId: 6,
        req: null,
        dep: null,
      },
      {
        id: 64,
        name: "resourses",
        uri: "resourses",
        titleAr: "موارد الخدمات",
        titleEn: "Service Resourses",
        mainId: 6,
        req: null,
        dep: null,
      },
      {
        id: 65,
        name: "services",
        uri: "services",
        titleAr: "الخدمات",
        titleEn: "Services",
        mainId: 6,
        req: null,
        dep: null,
      },
    ],
  },
  {
    id: 7,
    name: "reports",
    uri: "reports",
    titleAr: "التقارير",
    titleEn: "Reports",
    icon: "report",
    req: null,
    dep: null,
    subMenu: [
      {
        id: 71,
        name: "calendarempl",
        uri: "calendarempl",
        titleAr: "جدول الموظفين",
        titleEn: "Employees Calendar",
        mainId: 7,
        req: "cal",
        dep: "pos",
      },
      {
        id: 72,
        name: "calreports",
        uri: "calreports",
        titleAr: "تقرير المواعيد",
        titleEn: "Calendar Report",
        req: "cal",
        dep: "pos",
      },
      {
        id: 72.5,
        name: "docreports",
        uri: "docreports",
        titleAr: "تقرير الوثائق",
        titleEn: "Documents Report",
        req: "cal",
        dep: "pos",
      },
      {
        id: 72.7,
        name: "servicesreports",
        uri: "servicesreports",
        titleAr: "تقرير الخدمات",
        titleEn: "Services Report",
        req: "cal",
        dep: "pos",
      },
      {
        id: 73,
        name: "salesreport",
        uri: "salesreport",
        titleAr: "تقرير الايرادات",
        titleEn: "Sales Report",
        role: menuRoles.posAdmin,
        mainId: 7,
        req: "pos",
        dep: null,
      },
      {
        id: 74,
        name: "customerreport",
        uri: "customerreport",
        titleAr: "تقرير العملاء",
        titleEn: "Customer Report",
        role: menuRoles.posAdmin,
        mainId: 7,
        req: "pos",
        dep: null,
      },

      {
        id: 76,
        name: "expensesreport",
        uri: "expensesreport",
        titleAr: "تقرير المصاريف",
        titleEn: "Expenses Report",
        mainId: 7,
        req: "exp",
        dep: null,
      },
      {
        id: 77,
        name: "financereport",
        uri: "financereport",
        titleAr: "تقرير الحسابات",
        titleEn: "Finance Report",
        role: menuRoles.posAdmin,
        mainId: 7,
        req: null,
        dep: null,
      },
    ],
  },
  {
    id: 9,
    name: "users",
    uri: "users",
    titleAr: "المستخدمين",
    titleEn: "Users",
    role: menuRoles.branchAdmin,
    icon: "user",
    req: null,
    dep: null,
  },
  {
    id: 10,
    name: "accounts",
    uri: "accounts",
    titleAr: "الحسابات",
    titleEn: "Accounts",
    icon: "account",
    mainId: 6,
    role: menuRoles.branchAdmin,
    req: null,
    dep: null,
  },

  {
    id: 11,
    name: "options",
    uri: "options",
    titleAr: "الاعدادات",
    titleEn: "Options",
    icon: "options",
    req: null,
    dep: null,
  },
  // {
  //   id: 99,
  //   name: "logout",
  //   uri: "logout",
  //   titleAr: "تسجيل الخروج",
  //   titleEn: "Logout",
  //   icon: "logout",
  //   req: null,
  //   dep: null,
  // },
];
// export const mainmenu = [
//   {
//     id: 0,
//     name: "home",
//     uri: "/",
//     titleAr: "الرئيسية",
//     titleEn: "Home",
//     icon: "home",
//     req: null,
//     dep: null,
//   },
//   {
//     id: 1,
//     name: "maincalendar",
//     uri: "maincalendar",
//     titleAr: "المواعيد",
//     titleEn: "Calendar",
//     icon: "calendar",
//     req: "cal",
//     dep: "pos",
//     subMenu: [
//       {
//         id: 11,
//         name: "calendar",
//         uri: "calendar",
//         titleAr: "التقويم",
//         titleEn: "Calendar",
//         mainId: 1,
//         req: "cal",
//         dep: "pos",
//       },
//       {
//         id: 12,
//         name: "appointments",
//         uri: "appointments",
//         titleAr: "ادارة المواعيد",
//         titleEn: "Appointments",
//         mainId: 1,
//         req: "cal",
//         dep: "pos",
//       },
//       {
//         id: 13,
//         name: "calendarempl",
//         uri: "calendarempl",
//         titleAr: "جدول الموظفين",
//         titleEn: "Employees Calendar",
//         mainId: 1,
//         req: "cal",
//         dep: "pos",
//       },
//       {
//         id: 14,
//         name: "calreports",
//         uri: "calreports",
//         titleAr: "تقرير المواعيد",
//         titleEn: "Calendar Report",
//         mainId: 1,
//         req: "cal",
//         dep: "pos",
//       },
//     ],
//   },

//   {
//     id: 2,
//     name: "mainsales",
//     uri: "mainsales",
//     titleAr: "المبيعات",
//     titleEn: "Sales",
//     icon: "sales",
//     req: "pos",
//     dep: null,
//     subMenu: [
//       {
//         id: 21,
//         name: "sales",
//         uri: "sales",
//         titleAr: "ادارة الفواتير",
//         titleEn: "Invoices",
//         mainId: 2,
//         req: "pos",
//         dep: null,
//       },
//       {
//         id: 22,
//         name: "salesreport",
//         uri: "salesreport",
//         titleAr: "تقرير الايرادات",
//         titleEn: "Sales Report",
//         mainId: 2,
//         role: menuRoles.branchAdmin,
//         req: "pos",
//         dep: null,
//       },
//       {
//         id: 23,
//         name: "customers",
//         uri: "customers",
//         titleAr: "العملاء",
//         titleEn: "Customers",
//         mainId: 2,
//         req: "pos",
//         dep: null,
//       },
//     ],
//   },

//   {
//     id: 3,
//     name: "mainpurchases",
//     uri: "mainpurchases",
//     titleAr: "المشتريات",
//     titleEn: "Purchases",
//     icon: "purchase",
//     req: "pur",
//     dep: null,
//     subMenu: [
//       {
//         id: 31,
//         name: "purchases",
//         uri: "purchases",
//         titleAr: "ادارة المشتريات",
//         titleEn: "Purchases",
//         mainId: 3,
//         req: "pur",
//         dep: null,
//       },
//       {
//         id: 32,
//         name: "purchasereport",
//         uri: "purchasereport",
//         titleAr: "تقرير المشتريات",
//         titleEn: "Purchase Report",
//         mainId: 3,
//         req: "pur",
//         dep: null,
//       },
//       {
//         id: 33,
//         name: "suppliers",
//         uri: "suppliers",
//         titleAr: "الموردين",
//         titleEn: "Suppliers",
//         mainId: 3,
//         req: "pur",
//         dep: null,
//       },
//     ],
//   },

//   {
//     id: 4,
//     name: "mainexpenses",
//     uri: "mainexpenses",
//     titleAr: "المصاريف",
//     titleEn: "Expenses",
//     icon: "expenses",
//     req: "exp",
//     dep: null,
//     subMenu: [
//       {
//         id: 41,
//         name: "expenses",
//         uri: "expenses",
//         titleAr: "ادارة المصاريف",
//         titleEn: "Expenses",
//         mainId: 4,
//         req: "exp",
//         dep: null,
//       },
//       {
//         id: 42,
//         name: "expensesreport",
//         uri: "expensesreport",
//         titleAr: "تقرير المصاريف",
//         titleEn: "Expenses Report",
//         mainId: 4,
//         req: "exp",
//         dep: null,
//       },
//     ],
//   },

//   {
//     id: 5,
//     name: "maininventory",
//     uri: "maininventory",
//     titleAr: "المخازن",
//     titleEn: "Inventory",
//     icon: "inventory",
//     req: "inv",
//     dep: "pur",
//     subMenu: [
//       {
//         id: 51,
//         name: "stock",
//         uri: "stock",
//         titleAr: "الموجودات",
//         titleEn: "Stock",
//         mainId: 5,
//         req: "inv",
//         dep: "pur",
//       },
//       {
//         id: 52,
//         name: "stockmanage",
//         uri: "stockmanage",
//         titleAr: "ادراة المخازن",
//         titleEn: "Stock Managment",
//         mainId: 5,
//         req: "inv",
//         dep: "pur",
//       },
//       {
//         id: 53,
//         name: "stockreport",
//         uri: "stockreport",
//         titleAr: "تقرير المخازن",
//         titleEn: "Stock Report",
//         mainId: 5,
//         req: "inv",
//         dep: "pur",
//       },
//     ],
//   },

//   {
//     id: 6,
//     name: "maincash",
//     uri: "maincash",
//     titleAr: "المالية",
//     titleEn: "Finance",
//     icon: "finance",
//     req: null,
//     dep: null,
//     subMenu: [
//       {
//         id: 61,
//         name: "cash",
//         uri: "cash",
//         titleAr: "ادارة النقدية",
//         titleEn: "Cash",
//         mainId: 6,
//         req: null,
//         dep: null,
//       },
//       {
//         id: 62,
//         name: "financereport",
//         uri: "financereport",
//         titleAr: "تقرير المالية",
//         titleEn: "Finance Report",
//         mainId: 6,
//         role: menuRoles.branchAdmin,
//         req: null,
//         dep: null,
//       },
//       {
//         id: 63,
//         name: "accounts",
//         uri: "accounts",
//         titleAr: "ادارة الحسابات",
//         titleEn: "Accounts",
//         mainId: 6,
//         role: menuRoles.branchAdmin,
//         req: null,
//         dep: null,
//       },
//     ],
//   },

//   {
//     id: 7,
//     name: "adds",
//     uri: "adds",
//     titleAr: "الاضافات",
//     titleEn: "Additions",
//     icon: "add",
//     req: null,
//     dep: null,
//     subMenu: [
//       {
//         id: 71,
//         name: "departments",
//         uri: "departments",
//         titleAr: "الأقسام",
//         titleEn: "Departments",
//         mainId: 7,
//         req: null,
//         dep: null,
//       },
//       {
//         id: 72,
//         name: "employees",
//         uri: "employees",
//         titleAr: "الموظفين",
//         titleEn: "Employees",
//         mainId: 7,
//         req: null,
//         dep: null,
//       },
//       {
//         id: 73,
//         name: "categories",
//         uri: "categories",
//         titleAr: "التصنيفات",
//         titleEn: "Categories",
//         mainId: 7,
//         req: null,
//         dep: null,
//       },
//       {
//         id: 74,
//         name: "brands",
//         uri: "brands",
//         titleAr: "البراندات",
//         titleEn: "Brands",
//         mainId: 7,
//         req: "pur",
//         dep: null,
//       },
//       {
//         id: 75,
//         name: "products",
//         uri: "products",
//         titleAr: "المنتجات",
//         titleEn: "Products",
//         mainId: 7,
//         req: "pur",
//         dep: null,
//       },
//       {
//         id: 76,
//         name: "services",
//         uri: "services",
//         titleAr: "الخدمات",
//         titleEn: "Services",
//         mainId: 7,
//         req: null,
//         dep: null,
//       },
//     ],
//   },
//   {
//     id: 8,
//     name: "users",
//     uri: "users",
//     titleAr: "المستخدمين",
//     titleEn: "Users",
//     role: menuRoles.branchAdmin,
//     icon: "user",
//     req: null,
//     dep: null,
//   },

//   {
//     id: 9,
//     name: "options",
//     uri: "options",
//     titleAr: "الاعدادات",
//     titleEn: "Options",
//     icon: "options",
//     req: null,
//     dep: null,
//   },
// ];

// export const mainmenu = [
//   {
//     id: 0,
//     name: "home",
//     uri: "/",
//     titleAr: "الرئيسية",
//     titleEn: "Home",
//   },
//   {
//     id: 1,
//     name: "calendar",
//     uri: "calendar",
//     titleAr: "التقويم و المواعيد",
//     titleEn: "Calendar",
//   },
//   {
//     id: 2,
//     name: "appointments",
//     uri: "appointments",
//     titleAr: "ادارة المواعيد",
//     titleEn: "Appointments",
//   },
//   {
//     id: 3,
//     name: "sales",
//     uri: "sales",
//     titleAr: "ادارة الفواتير",
//     titleEn: "Invoices",
//   },

//   {
//     id: 4,
//     name: "cash",
//     uri: "cash",
//     titleAr: "ادارة النقدية",
//     titleEn: "Cash",
//   },
//   {
//     id: 4.5,
//     name: "purchases",
//     uri: "purchases",
//     titleAr: "ادارة المشتريات",
//     titleEn: "Purchases",
//   },
//   {
//     id: 4.6,
//     name: "expenses",
//     uri: "expenses",
//     titleAr: "ادارة المصاريف",
//     titleEn: "Expenses",
//   },

//   {
//     id: 5,
//     name: "reports",
//     uri: "reports",
//     titleAr: "التقارير",
//     titleEn: "Reports",
//     subMenu: [
//       {
//         id: 51,
//         name: "calendarempl",
//         uri: "calendarempl",
//         titleAr: "جدول الموظفين",
//         titleEn: "Employees Calendar",
//       },
//       {
//         id: 52,
//         name: "calreports",
//         uri: "calreports",
//         titleAr: "تقرير المواعيد",
//         titleEn: "Calendar Report",
//       },
//       {
//         id: 53,
//         name: "salesreport",
//         uri: "salesreport",
//         titleAr: "تقرير الايرادات",
//         titleEn: "Sales Report",
//         role: menuRoles.branchAdmin,
//       },
//       {
//         id: 54,
//         name: "financereport",
//         uri: "financereport",
//         titleAr: "تقرير المالية",
//         titleEn: "Finance Report",
//         role: menuRoles.branchAdmin,
//       },
//     ],
//   },
//   {
//     id: 6,
//     name: "adds",
//     uri: "adds",
//     titleAr: "الاضافات",
//     titleEn: "Additions",
//     subMenu: [
//       {
//         id: 61,
//         name: "departments",
//         uri: "departments",
//         titleAr: "الأقسام",
//         titleEn: "Departments",
//       },
//       {
//         id: 62,
//         name: "employees",
//         uri: "employees",
//         titleAr: "الموظفين",
//         titleEn: "Employees",
//       },
//       {
//         id: 63,
//         name: "categories",
//         uri: "categories",
//         titleAr: "التصنيفات",
//         titleEn: "Categories",
//       },
//       {
//         id: 64,
//         name: "brands",
//         uri: "brands",
//         titleAr: "البراندات",
//         titleEn: "rands",
//       },
//       {
//         id: 65,
//         name: "products",
//         uri: "products",
//         titleAr: "المنتجات",
//         titleEn: "Products",
//       },
//       {
//         id: 66,
//         name: "services",
//         uri: "services",
//         titleAr: "الخدمات",
//         titleEn: "Services",
//       },
//       {
//         id: 67,
//         name: "customers",
//         uri: "customers",
//         titleAr: "العملاء",
//         titleEn: "Customers",
//       },
//       {
//         id: 68,
//         name: "suppliers",
//         uri: "suppliers",
//         titleAr: "الموردين",
//         titleEn: "Suppliers",
//       },
//     ],
//   },
//   {
//     id: 7,
//     name: "users",
//     uri: "users",
//     titleAr: "المستخدمين",
//     titleEn: "Users",
//     role: menuRoles.branchAdmin,
//   },
//   {
//     id: 8,
//     name: "accounts",
//     uri: "accounts",
//     titleAr: "ادارة الحسابات",
//     titleEn: "Accounts",
//     role: menuRoles.branchAdmin,
//   },
//   {
//     id: 9,
//     name: "options",
//     uri: "options",
//     titleAr: "الاعدادات",
//     titleEn: "Options",
//   },
// ];

export const addButtonsList = [
  {
    id: 1,
    name: "category",
    titleAr: "التصنيفات",
    titleEn: "Categories",
  },
  {
    id: 2,
    name: "brand",
    titleAr: "البراندات",
    titleEn: "Brands",
  },
  {
    id: 3,
    name: "service",
    titleAr: "الخدمات",
    titleEn: "Services",
  },
  {
    id: 4,
    name: "product",
    titleAr: "البضاعة",
    titleEn: "Products",
  },
  {
    id: 5,
    name: "customer",
    titleAr: "العملاء",
    titleEn: "Customers",
  },
  {
    id: 6,
    name: "company",
    titleAr: "الشركة",
    titleEn: "Company",
  },
];

export const systemsNames = {
  cal: {
    name: "Calendar",
    nameAr: "جدول المواعيد",
  },
  pos: {
    name: "Sales",
    nameAr: "نظام المبيعات",
  },
  pur: {
    name: "Purchase",
    nameAr: "نظام المشتريات",
  },
  exp: {
    name: "Expenses",
    nameAr: "نظام المصاريف",
  },
  inv: {
    name: "Inventory",
    nameAr: "نظام المخازن",
  },
  hr: {
    name: "Human Resources",
    nameAr: "نظام الموارد البشرية",
  },
  ass: {
    name: "Assets Accounting",
    nameAr: "نظام حسابات الأصول",
  },
  acc: {
    name: "General Accounting",
    nameAr: "نظام الحسابات العامة",
  },
};
