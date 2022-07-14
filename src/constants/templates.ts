// 1 general
// 2 salon
// 3 education
// 4 rentcar
// 5 cleaning
// 6 contracting
// 7 realestate
// 8 services
export const templates = [
  {
    id: 1,
    title: 'general',
    name: 'General Template',
    nameAr: 'النموذج العام',
    options: {
      noPro: false,
      noTsk: false,
      noRes: false,
      noEmp: false,
      noDep: false,
      noServDep: false,
      noServEmp: false,
      noServRes: false,
      noSms: false,
      noReminder: false,
    },
    words: {
      ar: {
        main: 'الرئيسية',
        appointment: 'الموعد',
        appointments: 'المواعيد',
        task: 'المهمة',
        tasks: 'المهام',
        department: 'القسم',
        departments: 'الأقسام',
        customer: 'العميل',
        customers: 'العملاء',
        suppliers: 'الموردين',
        employee: 'الموظف',
        employees: 'الموظفين',
        resourse: 'المورد',
        resourses: 'الموارد',
        project: 'المشروع',
        projects: 'المشاريع',
        service: 'الخدمة',
        services: 'الخدمات',
        expenseitems: 'المصروف',
        servicesdepart: 'قسم الخدمات',
        servicesdeparts: 'اقسام الخدمات',
        servicesempl: 'فني الخدمات',
        servicesempls: 'فنيي الخدمات',
        servicesres: 'مورد الخدمات',
        servicesress: 'موارد الخدمات',
      },
      en: {
        main: 'Main',
        appointment: 'Appointment',
        appointments: 'Appointments',
        task: 'Task',
        tasks: 'Tasks',
        department: 'Department',
        departments: 'Departments',
        customer: 'Customer',
        suppliers: 'Suppliers',
        customers: 'Customers',
        employee: 'Employee',
        employees: 'Employees',
        resourse: 'Resourse',
        resourses: 'Resourses',
        project: 'Project',
        projects: 'Projects',
        service: 'Service',
        services: 'Services',
        expenseitems: 'Expenses Items',
        servicesdepart: 'Services Department',
        servicesdeparts: 'Services Departments',
        servicesempl: 'Services Employee',
        servicesempls: 'Services Employees',
        servicesres: 'Services Resourse',
        servicesress: 'Services Resourses',
      },
    },
    taskExtra: [],
    emplExtra: [],
    resoExtra: [],
    sortOrder: [0, 0.5, 0.55, 0.56, 0.6, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  },
  {
    id: 2,
    title: 'salon',
    name: 'Salon Template',
    nameAr: 'نموذج صالون ',
    options: {
      noPro: true,
      noTsk: true,
      noRes: true,
      noEmp: false,
      noDep: false,
      noServDep: true,
      noServEmp: true,
      noServRes: true,
      noSms: false,
      noReminder: false,
    },
    words: {
      ar: {
        main: 'الرئيسية',
        appointment: 'الموعد',
        appointments: 'المواعيد',
        task: 'كورس',
        tasks: 'الكورسات',
        department: 'القسم',
        departments: 'الأقسام',
        customer: 'العميل',
        customers: 'العملاء',
        suppliers: 'الموردين',
        employee: 'الموظف',
        employees: 'الموظفين',
        resourse: 'المورد',
        resourses: 'الموارد',
        project: 'المشروع',
        projects: 'المشاريع',
        service: 'الخدمة',
        services: 'الخدمات',
        expenseitems: 'المصروف',

        // no service relation
        servicesdepart: 'قسم الخدمات',
        servicesdeparts: 'اقسام الخدمات',
        servicesempl: 'فني الخدمات',
        servicesempls: 'فنيي الخدمات',
        servicesres: 'مورد الخدمات',
        servicesress: 'موارد الخدمات',
      },
      en: {
        main: 'Main',
        appointment: 'Appointment',
        appointments: 'Appointments',
        task: 'Task',
        tasks: 'Tasks',
        department: 'Department',
        departments: 'Departments',
        customer: 'Customer',
        customers: 'Customers',
        suppliers: 'Suppliers',

        employee: 'Employee',
        employees: 'Employees',
        resourse: 'Resourse',
        resourses: 'Resourses',
        project: 'Project',
        projects: 'Projects',
        service: 'Service',
        expenseitems: 'Expenses Items',

        services: 'Services',
        // no service relation
        servicesdepart: 'Services Department',
        servicesdeparts: 'Services Departments',
        servicesempl: 'Services Employee',
        servicesempls: 'Services Employees',
        servicesres: 'Services Resourse',
        servicesress: 'Services Resourses',
      },
    },
    taskExtra: [],
    emplExtra: [],
    resoExtra: [],
    sortOrder: [0, 0.5, 0.55, 0.56, 0.6, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  },
  {
    id: 3,
    title: 'education',
    name: 'Education Template',
    nameAr: 'نموذج مركز تعليمي',
    options: {
      noRes: true,
      noPro: true,
      noTsk: false,
      noEmp: false,
      noDep: false,
      noServDep: true,
      noServEmp: true,
      noServRes: true,
      noSms: false,
      noReminder: false,
    },
    words: {
      ar: {
        main: 'الرئيسية',
        appointment: 'حصة',
        appointments: 'حصص',
        task: 'الكورس',
        tasks: 'الكورسات',
        department: 'القسم',
        departments: 'الأقسام',
        customer: 'الطالب',
        customers: 'الطلاب',
        suppliers: 'الموردين',
        employee: 'المدرس',
        employees: 'المدرسين',
        resourse: 'المورد',
        resourses: 'الموارد',
        project: 'المشروع',
        projects: 'المشاريع',
        service: 'الخدمة',
        services: 'الخدمات',
        expenseitems: 'المصروف',
        // no service relation
        servicesdepart: 'قسم الخدمات',
        servicesdeparts: 'اقسام الخدمات',
        servicesempl: 'فني الخدمات',
        servicesempls: 'فنيي الخدمات',
        servicesres: 'مورد الخدمات',
        servicesress: 'موارد الخدمات',
      },
      en: {
        main: 'Main',
        appointment: 'Lesson',
        appointments: 'Lessons',
        task: 'Course',
        tasks: 'Courses',
        department: 'Department',
        departments: 'Departments',
        customer: 'Student',
        customers: 'Students',
        suppliers: 'Suppliers',
        employee: 'Teacher',
        employees: 'Teachers',
        resourse: 'Resourse',
        resourses: 'Resourses',
        project: 'Project',
        projects: 'Projects',
        service: 'Service',
        services: 'Services',
        expenseitems: 'Expenses Items',
        // no service relation
        servicesdepart: 'Services Department',
        servicesdeparts: 'Services Departments',
        servicesempl: 'Services Employee',
        servicesempls: 'Services Employees',
        servicesres: 'Services Resourse',
        servicesress: 'Services Resourses',
      },
    },
    taskExtra: [],
    emplExtra: [],
    resoExtra: [],
    sortOrder: [0, 0.5, 0.55, 0.56, 0.6, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  },
  {
    id: 4,
    title: 'rentcar',
    name: 'Rent Car Template',
    nameAr: 'نموذج شركة تأجير سيارات',
    options: {
      noPro: true,
      noTsk: false,
      noRes: false,
      noEmp: false,
      noDep: false,
      noServDep: true,
      noServEmp: true,
      noServRes: true,
      noSms: false,
      noReminder: false,
    },
    words: {
      ar: {
        main: 'الرئيسية',
        appointment: 'الموعد',
        appointments: 'المواعيد',
        task: 'العقد',
        tasks: 'العقود',
        department: 'القسم',
        departments: 'الأقسام',
        customer: 'العميل',
        customers: 'العملاء',
        suppliers: 'الموردين',
        employee: 'الموظف',
        employees: 'الموظفين',
        resourse: 'السيارة',
        resourses: 'السيارات',
        project: 'المشروع',
        projects: 'المشاريع',
        service: 'الخدمة',
        services: 'الخدمات',
        expenseitems: 'المصروف',
        // no service relation
        servicesdepart: 'قسم الخدمات',
        servicesdeparts: 'اقسام الخدمات',
        servicesempl: 'فني الخدمات',
        servicesempls: 'فنيي الخدمات',
        servicesres: 'مورد الخدمات',
        servicesress: 'موارد الخدمات',
      },
      en: {
        main: 'Main',
        appointment: 'Appointment',
        appointments: 'Appointments',
        task: 'Contract',
        tasks: 'Contracts',
        department: 'Department',
        departments: 'Departments',
        customer: 'Customer',
        customers: 'Customers',
        suppliers: 'Suppliers',
        employee: 'Employee',
        employees: 'Employees',
        resourse: 'Car',
        resourses: 'Cars',
        project: 'Project',
        projects: 'Projects',
        service: 'Service',
        services: 'Services',
        expenseitems: 'Expenses Items',
        // no service relation
        servicesdepart: 'Services Department',
        servicesdeparts: 'Services Departments',
        servicesempl: 'Services Employee',
        servicesempls: 'Services Employees',
        servicesres: 'Services Resourse',
        servicesress: 'Services Resourses',
      },
    },
    taskExtra: [
      {
        id: 1,
        name: 'Kilometer out',
        nameAr: 'العداد وقت الخروج',
        type: 'text',
        value: '',
      },
      {
        id: 2,
        name: 'Kilometer in',
        nameAr: 'العداد وقت العودة',
        type: 'text',
        value: '',
      },
      {
        id: 3,
        name: 'Notes',
        nameAr: 'ملاحظات',
        type: 'text',
        multiline: true,
        value: '',
      },
    ],
    emplExtra: [],
    resoExtra: [],
    sortOrder: [0, 0.5, 0.55, 0.56, 0.6, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  },
  {
    id: 5,
    title: 'cleaning',
    name: 'Cleaning Template',
    nameAr: 'نموذج شركة نظافة',
    options: {
      noPro: false,
      noTsk: false,
      noRes: false,
      noEmp: false,
      noDep: false,
      noServDep: true,
      noServEmp: true,
      noServRes: true,
      noSms: false,
      noReminder: false,
    },
    words: {
      ar: {
        main: 'الرئيسية',
        appointment: 'الموعد',
        appointments: 'المواعيد',
        task: 'المهمة',
        tasks: 'المهام',
        department: 'القسم',
        departments: 'الأقسام',
        customer: 'العميل',
        customers: 'العملاء',
        suppliers: 'الموردين',
        employee: 'الموظف',
        employees: 'الموظفين',
        resourse: 'المورد',
        resourses: 'الموارد',
        project: 'المشروع',
        projects: 'المشاريع',
        service: 'خدمة',
        services: 'خدمات',
        expenseitems: 'المصروف',
        // no service relation
        servicesdepart: 'قسم الخدمات',
        servicesdeparts: 'اقسام الخدمات',
        servicesempl: 'فني الخدمات',
        servicesempls: 'فنيي الخدمات',
        servicesres: 'مورد الخدمات',
        servicesress: 'موارد الخدمات',
      },
      en: {
        main: 'Main',
        appointment: 'Appointment',
        appointments: 'Appointments',
        task: 'Task',
        tasks: 'Tasks',
        department: 'Project',
        departments: 'Projects',
        customer: 'Customer',
        customers: 'Customers',
        suppliers: 'Suppliers',
        employee: 'Employee',
        employees: 'Employees',
        resourse: 'Resourse',
        resourses: 'Resourses',
        project: 'Project',
        projects: 'Projects',
        service: 'Service',
        services: 'Services',
        expenseitems: 'Expenses Items',
        // no service relation
        servicesdepart: 'Services Department',
        servicesdeparts: 'Services Departments',
        servicesempl: 'Services Employee',
        servicesempls: 'Services Employees',
        servicesres: 'Services Resourse',
        servicesress: 'Services Resourses',
      },
    },
    taskExtra: [],
    emplExtra: [],
    resoExtra: [],
    sortOrder: [0, 0.5, 0.55, 0.56, 0.6, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  },
  {
    id: 6,
    title: 'contracting',
    name: 'Contracting',
    nameAr: 'نموذج شركة مقاولات',
    options: {
      noPro: false,
      noTsk: false,
      noRes: false,
      noEmp: false,
      noDep: false,
      noServDep: false,
      noServEmp: false,
      noServRes: false,
      noSms: false,
      noReminder: false,
    },
    words: {
      ar: {
        main: 'الرئيسية',
        appointment: 'النشاط',
        appointments: 'الأنشطة',
        task: 'المرحلة',
        tasks: 'المراحل',
        department: 'القسم',
        departments: 'الأقسام',
        customer: 'العميل',
        customers: 'العملاء',
        suppliers: 'الموردين',
        employee: 'الموظف',
        employees: 'الموظفين',
        resourse: 'المعدة',
        resourses: 'المعدات',
        project: 'المشروع',
        projects: 'المشاريع',
        service: 'الخدمة',
        services: 'الخدمات',
        expenseitems: 'المصروف',
        servicesdepart: 'قسم الخدمات',
        servicesdeparts: 'اقسام الخدمات',
        servicesempl: 'فني الخدمات',
        servicesempls: 'فنيي الخدمات',
        servicesres: 'مورد الخدمات',
        servicesress: 'موارد الخدمات',
      },
      en: {
        main: 'Main',
        appointment: 'Activity',
        appointments: 'Activities',
        task: 'Phase',
        tasks: 'Phases',
        department: 'Department',
        departments: 'Departments',
        customer: 'Customer',
        suppliers: 'Suppliers',
        customers: 'Customers',
        employee: 'Employee',
        employees: 'Employees',
        resourse: 'Equipment',
        resourses: 'Equipments',
        project: 'Project',
        projects: 'Projects',
        service: 'Service',
        services: 'Services',
        expenseitems: 'Expenses Items',
        servicesdepart: 'Services Department',
        servicesdeparts: 'Services Departments',
        servicesempl: 'Services Employee',
        servicesempls: 'Services Employees',
        servicesres: 'Services Resourse',
        servicesress: 'Services Resourses',
      },
    },
    taskExtra: [],
    emplExtra: [],
    resoExtra: [],
    sortOrder: [0, 0.5, 0.55, 0.56, 0.6, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  },
  {
    id: 7,
    title: 'realestate',
    name: 'Real Estate Template',
    nameAr: 'نموذج شركة عقارات',
    options: {
      noPro: true,
      noTsk: false,
      noRes: false,
      noEmp: false,
      noDep: false,
      noServDep: true,
      noServEmp: true,
      noServRes: true,
      noSms: false,
      noReminder: false,
    },
    words: {
      ar: {
        main: 'الرئيسية',
        appointment: 'الموعد',
        appointments: 'المواعيد',
        task: 'العقد',
        tasks: 'العقود',
        department: 'القسم',
        departments: 'الأقسام',
        customer: 'العميل',
        customers: 'العملاء',
        suppliers: 'الموردين',
        employee: 'الموظف',
        employees: 'الموظفين',
        resourse: 'العقار',
        resourses: 'العقارات',
        project: 'المشروع',
        projects: 'المشاريع',
        service: 'الخدمة',
        services: 'الخدمات',
        expenseitems: 'المصروف',
        // no service relation
        servicesdepart: 'قسم الخدمات',
        servicesdeparts: 'اقسام الخدمات',
        servicesempl: 'فني الخدمات',
        servicesempls: 'فنيي الخدمات',
        servicesres: 'مورد الخدمات',
        servicesress: 'موارد الخدمات',
      },
      en: {
        main: 'Main',
        appointment: 'Appointment',
        appointments: 'Appointments',
        task: 'Contract',
        tasks: 'Contracts',
        department: 'Department',
        departments: 'Departments',
        customer: 'Customer',
        suppliers: 'Suppliers',
        customers: 'Customers',
        employee: 'Employee',
        employees: 'Employees',
        resourse: 'Real Esate',
        resourses: 'Real Esates',
        project: 'Project',
        projects: 'Projects',
        service: 'Service',
        services: 'Services',
        expenseitems: 'Expenses Items',
        // no service relation
        servicesdepart: 'Services Department',
        servicesdeparts: 'Services Departments',
        servicesempl: 'Services Employee',
        servicesempls: 'Services Employees',
        servicesres: 'Services Resourse',
        servicesress: 'Services Resourses',
      },
    },
    taskExtra: [],
    emplExtra: [],
    resoExtra: [],
    sortOrder: [0, 0.5, 0.55, 0.56, 0.6, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  },
  {
    id: 8,
    title: 'services',
    name: 'Services Template',
    nameAr: 'نموذج شركة خدمات',
    options: {
      noPro: true,
      noTsk: false,
      noRes: false,
      noEmp: false,
      noDep: false,
      noServDep: true,
      noServEmp: true,
      noServRes: true,
      noSms: false,
      noReminder: false,
    },
    words: {
      ar: {
        main: 'الرئيسية',
        appointment: 'الموعد',
        appointments: 'المواعيد',
        task: 'العقد',
        tasks: 'العقود',
        department: 'القسم',
        departments: 'الأقسام',
        customer: 'العميل',
        customers: 'العملاء',
        suppliers: 'الموردين',
        employee: 'الموظف',
        employees: 'الموظفين',
        resourse: 'المورد',
        resourses: 'الموارد',
        project: 'المشروع',
        projects: 'المشاريع',
        service: 'الخدمة',
        services: 'الخدمات',
        expenseitems: 'المصروف',
        // no service relation
        servicesdepart: 'قسم الخدمات',
        servicesdeparts: 'اقسام الخدمات',
        servicesempl: 'فني الخدمات',
        servicesempls: 'فنيي الخدمات',
        servicesres: 'مورد الخدمات',
        servicesress: 'موارد الخدمات',
      },
      en: {
        main: 'Main',
        appointment: 'Appointment',
        appointments: 'Appointments',
        task: 'Contract',
        tasks: 'Contracts',
        department: 'Department',
        departments: 'Departments',
        customer: 'Customer',
        customers: 'Customers',
        suppliers: 'Suppliers',

        employee: 'Employee',
        employees: 'Employees',
        resourse: 'Resourse',
        resourses: 'Resourses',
        project: 'Project',
        projects: 'Projects',
        service: 'Service',
        services: 'Services',
        expenseitems: 'Expenses Items',
        // no service relation
        servicesdepart: 'Services Department',
        servicesdeparts: 'Services Departments',
        servicesempl: 'Services Employee',
        servicesempls: 'Services Employees',
        servicesres: 'Services Resourse',
        servicesress: 'Services Resourses',
      },
    },
    taskExtra: [],
    emplExtra: [],
    resoExtra: [],
    sortOrder: [0, 0.5, 0.55, 0.56, 0.6, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  },
  {
    id: 9,
    title: 'delivery',
    name: 'Delivery Template',
    nameAr: 'نموذج شركة التوصيل',
    options: {
      noPro: true,
      noTsk: false,
      noRes: false,
      noEmp: false,
      noDep: false,
      noServDep: true,
      noServEmp: true,
      noServRes: true,
      noSms: false,
      noReminder: false,
    },
    words: {
      ar: {
        main: 'الرئيسية',
        appointment: 'الموعد',
        appointments: 'المواعيد',
        task: 'المهمة',
        tasks: 'المهام',
        department: 'القسم',
        departments: 'الأقسام',
        customer: 'العميل',
        customers: 'العملاء',
        suppliers: 'الموردين',
        employee: 'الموظف',
        employees: 'الموظفين',
        resourse: 'المركبة',
        resourses: 'المركبات',
        project: 'المشروع',
        projects: 'المشاريع',
        service: 'الخدمة',
        services: 'الخدمات',
        expenseitems: 'المصروف',
        // no service relation
        servicesdepart: 'قسم الخدمات',
        servicesdeparts: 'اقسام الخدمات',
        servicesempl: 'فني الخدمات',
        servicesempls: 'فنيي الخدمات',
        servicesres: 'مورد الخدمات',
        servicesress: 'موارد الخدمات',
      },
      en: {
        main: 'Main',
        appointment: 'Appointment',
        appointments: 'Appointments',
        task: 'Job',
        tasks: 'Jobs',
        department: 'Department',
        departments: 'Departments',
        customer: 'Customer',
        customers: 'Customers',
        suppliers: 'Suppliers',

        employee: 'Employee',
        employees: 'Employees',
        resourse: 'Vehicle',
        resourses: 'Vehicles',
        project: 'Project',
        projects: 'Projects',
        service: 'Service',
        services: 'Services',
        expenseitems: 'Expenses Items',
        // no service relation
        servicesdepart: 'Services Department',
        servicesdeparts: 'Services Departments',
        servicesempl: 'Services Employee',
        servicesempls: 'Services Employees',
        servicesres: 'Services Resourse',
        servicesress: 'Services Resourses',
      },
    },
    taskExtra: [],
    emplExtra: [],
    resoExtra: [],
    sortOrder: [0, 0.5, 0.55, 0.56, 0.6, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  },
];
