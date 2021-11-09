export const roles = [
  {
    branchName: { type: String },
    isBranchAdmin: { type: Boolean },
    systems: [
      {
        systemName: { type: String },
        isSystemAdmin: { type: Boolean },
        levels: {
          view: { type: Boolean },
          add: { type: Boolean },
          edit: { type: Boolean },
          delete: { type: Boolean },
          report: { type: Boolean },
        },
      },
    ],
  },
];

export const rolesExample = {
  branchs: [
    {
      name: 'branch1',
      isAdmin: true,
      systems: [
        {
          name: 'system1',
          isAdmin: true,
          levels: {
            view: true,
            add: true,
            edit: true,
            delete: true,
            report: true,
          },
        },
      ],
    },
  ],
};

export const packages = [
  {
    name: 'free',
    title: 'Free',
    titleAr: 'الحزمة المجانية',
    eventsQty: 100,
    durationQty: -1,
    docsQty: 500,
    cost: 0,
    users: 1,
  },
  {
    name: 'basic',
    title: 'Basic',
    titleAr: 'الحزمة الأساسية',
    eventsQty: 1500,
    docsQty: 5000,
    durationQty: 1,
    durationType: 'y',
    cost: 1000,
    users: 3,
  },
  {
    name: 'standard',
    title: 'Standard',
    titleAr: 'الحزمة القياسية',
    eventsQty: 4500,
    docsQty: 15000,
    durationQty: 1,
    durationType: 'y',
    cost: 1400,
    users: 10,
  },
  {
    name: 'premium',
    title: 'Premium',
    titleAr: 'الحزمة الممتازة',
    eventsQty: 9000,
    docsQty: -1,
    durationQty: 1,
    durationType: 'y',
    cost: 1800,
    users: 20,
  },
  {
    name: 'custom',
    title: 'Custom',
    titleAr: 'الحزمة المخصصة',
    eventsQty: -1,
    docsQty: -1,
    durationQty: 1,
    durationType: 'y',
    cost: 1800,
    users: -1,
  },
];

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
        appointment: 'الموعد',
        appointments: 'المواعيد',
        task: 'المهمة',
        tasks: 'المهام',
        department: 'القسم',
        departments: 'الأقسام',
        customer: 'العميل',
        customers: 'العملاء',
        employee: 'الموظف',
        employees: 'الموظفين',
        resourse: 'المورد',
        resourses: 'الموارد',
        project: 'المشروع',
        projects: 'المشاريع',
        service: 'الخدمة',
        services: 'الخدمات',
        servicesdepart: 'قسم الخدمات',
        servicesdeparts: 'اقسام الخدمات',
        servicesempl: 'فني الخدمات',
        servicesempls: 'فنيي الخدمات',
        servicesres: 'مورد الخدمات',
        servicesress: 'موارد الخدمات',
      },
      en: {
        appointment: 'Appointment',
        appointments: 'Appointments',
        task: 'Task',
        tasks: 'Tasks',
        department: 'Department',
        departments: 'Departments',
        customer: 'Customer',
        customers: 'Customers',
        employee: 'Employee',
        employees: 'Employees',
        resourse: 'Resourse',
        resourses: 'Resourses',
        project: 'Project',
        projects: 'Projects',
        service: 'Service',
        services: 'Services',
        servicesdepart: 'Services Department',
        servicesdeparts: 'Services Departments',
        servicesempl: 'Services Employee',
        servicesempls: 'Services Employees',
        servicesres: 'Services Resourse',
        servicesress: 'Services Resourses',
      },
    },
  },
  {
    id: 2,
    title: 'salon',
    name: 'Salon Template',
    nameAr: 'نموذج صالون ',
    options: {
      noPro: true,
      noTsk: false,
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
        appointment: 'الموعد',
        appointments: 'المواعيد',
        task: 'موعد متعدد',
        tasks: 'المواعيد المتعددة',
        department: 'القسم',
        departments: 'الأقسام',
        customer: 'العميل',
        customers: 'العملاء',
        employee: 'الموظف',
        employees: 'الموظفين',
        resourse: 'المورد',
        resourses: 'الموارد',
        project: 'المشروع',
        projects: 'المشاريع',
        service: 'الخدمة',
        services: 'الخدمات',
        // no service relation
        servicesdepart: 'قسم الخدمات',
        servicesdeparts: 'اقسام الخدمات',
        servicesempl: 'فني الخدمات',
        servicesempls: 'فنيي الخدمات',
        servicesres: 'مورد الخدمات',
        servicesress: 'موارد الخدمات',
      },
      en: {
        appointment: 'Appointment',
        appointments: 'Appointments',
        task: 'Task',
        tasks: 'Tasks',
        department: 'Department',
        departments: 'Departments',
        customer: 'Customer',
        customers: 'Customers',
        employee: 'Employee',
        employees: 'Employees',
        resourse: 'Resourse',
        resourses: 'Resourses',
        project: 'Project',
        projects: 'Projects',
        service: 'Service',
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
        appointment: 'حصة',
        appointments: 'حصص',
        task: 'كورس',
        tasks: 'كورسات',
        department: 'قسم',
        departments: 'أقسام',
        customer: 'طالب',
        customers: 'طلاب',
        employee: 'مدرس',
        employees: 'مدرسين',
        resourse: 'مورد',
        resourses: 'موارد',
        project: 'مشروع',
        projects: 'مشاريع',
        service: 'خدمة',
        services: 'خدمات',
        // no service relation
        servicesdepart: 'قسم الخدمات',
        servicesdeparts: 'اقسام الخدمات',
        servicesempl: 'فني الخدمات',
        servicesempls: 'فنيي الخدمات',
        servicesres: 'مورد الخدمات',
        servicesress: 'موارد الخدمات',
      },
      en: {
        appointment: 'Lesson',
        appointments: 'Lessons',
        task: 'Course',
        tasks: 'Courses',
        department: 'Department',
        departments: 'Departments',
        customer: 'Student',
        customers: 'Students',
        employee: 'Teacher',
        employees: 'Teachers',
        resourse: 'Resourse',
        resourses: 'Resourses',
        project: 'Project',
        projects: 'Projects',
        service: 'Service',
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
  },
  {
    id: 4,
    title: 'rentcar',
    name: 'Rent Car Template',
    nameAr: 'نموذج شركة تأجير سيارات',
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
        appointment: 'موعد',
        appointments: 'مواعيد',
        task: 'عقد',
        tasks: 'عقود',
        department: 'قسم',
        departments: 'أقسام',
        customer: 'عميل',
        customers: 'عملاء',
        employee: 'موظف',
        employees: 'موظفين',
        resourse: 'سيارة',
        resourses: 'سيارات',
        project: 'مشروع',
        projects: 'مشاريع',
        service: 'خدمة',
        services: 'خدمات',
        // no service relation
        servicesdepart: 'قسم الخدمات',
        servicesdeparts: 'اقسام الخدمات',
        servicesempl: 'فني الخدمات',
        servicesempls: 'فنيي الخدمات',
        servicesres: 'مورد الخدمات',
        servicesress: 'موارد الخدمات',
      },
      en: {
        appointment: 'Appointment',
        appointments: 'Appointments',
        task: 'Contract',
        tasks: 'Contracts',
        department: 'Department',
        departments: 'Departments',
        customer: 'Customer',
        customers: 'Customers',
        employee: 'Employee',
        employees: 'Employees',
        resourse: 'Car',
        resourses: 'Cars',
        project: 'Project',
        projects: 'Projects',
        service: 'Service',
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
        appointment: 'موعد',
        appointments: 'مواعيد',
        task: 'مهمة',
        tasks: 'مهام',
        department: 'مشروع',
        departments: 'مشاريع',
        customer: 'عميل',
        customers: 'عملاء',
        employee: 'موظف',
        employees: 'موظفين',
        resourse: 'مورد',
        resourses: 'موارد',
        project: 'مشروع',
        projects: 'مشاريع',
        service: 'خدمة',
        services: 'خدمات',
        // no service relation
        servicesdepart: 'قسم الخدمات',
        servicesdeparts: 'اقسام الخدمات',
        servicesempl: 'فني الخدمات',
        servicesempls: 'فنيي الخدمات',
        servicesres: 'مورد الخدمات',
        servicesress: 'موارد الخدمات',
      },
      en: {
        appointment: 'Appointment',
        appointments: 'Appointments',
        task: 'Task',
        tasks: 'Tasks',
        department: 'Project',
        departments: 'Projects',
        customer: 'Customer',
        customers: 'Customers',
        employee: 'Employee',
        employees: 'Employees',
        resourse: 'Resourse',
        resourses: 'Resourses',
        project: 'Project',
        projects: 'Projects',
        service: 'Service',
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
  },
];
