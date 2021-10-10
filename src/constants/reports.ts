import { operationTypes } from ".";

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export const groupList = (isRTL: any) => [
  {
    id: 1,
    value: "none",
    name: isRTL ? "بدون تجميع" : "No Grouping",
  },
  {
    id: 2,
    value: "employee",
    name: isRTL ? "تجميع بحسب الموظف" : "Group By Employee",
  },
  {
    id: 3,
    value: "department",
    name: isRTL ? "تجميع بحسب القسم" : "Group By Department",
  },
  {
    id: 4,
    value: "service",
    name: isRTL ? "تجميع بحسب الخدمة" : "Group By Service",
  },
  {
    id: 5,
    value: "customer",
    name: isRTL ? "تجميع بحسب العميل" : "Group By Customer",
  },
  {
    id: 6,
    value: "category",
    name: isRTL ? "تجميع بحسب التصنيف" : "Group By Category",
  },
  {
    id: 7,
    value: "status",
    name: isRTL ? "تجميع بحسب الحالة" : "Group By status",
  },
  {
    id: 8,
    value: "taskId",
    name: isRTL ? "تجميع بحسب المهمة" : "Group By Operation",
  },
  {
    id: 9,
    value: "opType",
    name: isRTL ? "تجميع بحسب الوثيقة" : "Group By Document",
  },
];

export const documentTypes = [
  {
    id: 1,
    value: "none",
    name: "All",
    nameAr: "الكل",
  },
  {
    id: 2,
    value: operationTypes.event,
    name: "Appointment",
    nameAr: "المواعيد",
  },
  {
    id: 3,
    value: operationTypes.salesInvoice,
    name: "Invoice",
    nameAr: "الفواتير",
  },
  {
    id: 4,
    value: operationTypes.customerReceipt,
    name: "Receipt",
    nameAr: "المقبوض",
  },
  {
    id: 6,
    value: operationTypes.expenses,
    name: "Expenses",
    nameAr: "المصروف",
  },
];

export const sectionTypes = [
  {
    id: 1,
    value: 1,
    name: "Managment",
    nameAr: "اداري",
  },
  {
    id: 2,
    value: 2,
    name: "Operational",
    nameAr: "فني",
  },
];
