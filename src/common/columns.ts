/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { getStoreItem } from '../store';

const store = getStoreItem('store');
const template = store?.template;
const lang = store?.lang;
const tempwords = template?.words?.[lang];

export const getRowId = (row: { _id: any }) => row._id;

export const getColumns = ({ isRTL, words }: any) => {
  return {
    no: { id: 1, ref: 'no', name: 'no', title: words.no },
    startDate: { id: 1.1, ref: 'date', name: 'startDate', title: words.time },
    start: { id: 1.2, ref: 'date', name: 'start', title: words.start },
    end: { id: 1.3, ref: 'date', name: 'end', title: words.end },
    tasktype: { id: 1.4, ref: 'tasktype', name: 'tasktype', title: words.type },
    time: { id: 2, ref: 'time', name: 'time', title: words.timedate },
    opTime: { id: 3, ref: 'opTime', name: 'opTime', title: words.time },
    docNo: { id: 4, ref: 'docNo', name: 'docNo', title: words.no },
    title: { id: 4, ref: 'title', name: 'title', title: words.name },
    opDocNo: { id: 5, ref: 'opDocNo', name: 'opDocNo', title: words.no },
    employee: {
      id: 6,
      ref: 'employee',
      name: isRTL ? 'employeeNameAr' : 'employeeName',
      title: tempwords?.employee,
    },
    service: {
      id: 7,
      ref: 'service',
      name: isRTL ? 'itemNameAr' : 'itemName',
      title: words?.service,
    },
    department: {
      id: 8,
      ref: 'department',
      name: isRTL ? 'departmentNameAr' : 'departmentName',
      title: tempwords?.department,
    },
    category: {
      id: 9,
      ref: 'category',
      name: isRTL ? 'categoryNameAr' : 'categoryName',
      title: words.category,
    },
    customer: {
      id: 10,
      ref: 'customer',
      name: isRTL ? 'customerNameAr' : 'customerName',
      title: tempwords?.customer,
    },
    supplier: {
      id: 10,
      ref: 'supplier',
      name: isRTL ? 'supplierNameAr' : 'supplierName',
      title: words.supplier,
    },
    status: { id: 11, ref: 'status', name: 'status', title: words.status },
    amount: { id: 12, ref: 'amount', name: 'amount', title: words.amount },
    acc: {
      id: 13,
      ref: 'acc',
      name: isRTL ? 'accNameAr' : 'accName',
      title: words.account,
    },
    opAcc: {
      id: 14,
      ref: 'opAcc',
      name: isRTL ? 'opaccNameAr' : 'opaccName',
      title: isRTL ? 'الحساب المقابل' : 'Other side Account',
    },
    debit: { id: 15, ref: 'debit', name: 'debit', title: words.debit },
    credit: { id: 16, ref: 'credit', name: 'credit', title: words.credit },
    accType: { id: 17, ref: 'accType', name: 'accType', title: 'accType' },
    kaidType: { id: 18, ref: 'kaidType', name: 'kaidType', title: 'kaidType' },
    opType: {
      id: 19,
      ref: 'opType',
      name: 'opType',
      title: isRTL ? 'العملية' : 'Document',
    },
    refNo: {
      id: 20,
      ref: 'refNo',
      name: 'refNo',
      title: isRTL ? 'رقم المرجع' : 'Ref',
    },
    eventNo: {
      id: 21,
      ref: 'eventNo',
      name: 'eventNo',
      title: isRTL ? 'رقم المرجع' : 'Ref',
    },
    progress: {
      id: 22,
      ref: 'progress',
      name: 'progress',
      title: isRTL ? 'نسبة الانجاز' : 'Progress',
    },
    evQty: {
      id: 23,
      ref: 'evQty',
      name: 'evQty',
      title: isRTL ? 'عدد المواعيد' : 'Appointments',
    },
    taskId: {
      id: 24,
      ref: 'taskId',
      name: 'taskId',
      title: tempwords?.task,
    },
    id: {
      id: 25,
      ref: 'id',
      name: 'id',
      title: isRTL ? 'الرقم' : 'No',
    },
    fromto: {
      id: 25,
      ref: 'fromto',
      name: 'fromto',
      title: isRTL ? 'الوقت' : 'Time',
    },
    done: {
      id: 25,
      ref: 'done',
      name: 'done',
      title: isRTL ? 'الانجاز' : 'Done',
    },
    invo: {
      id: 25,
      ref: 'done',
      name: 'done',
      title: isRTL ? 'الانجاز' : 'Done',
    },
    totalinvoiced: {
      id: 26,
      ref: 'totalinvoiced',
      name: 'totalinvoiced',
      title: isRTL ? 'الفواتير' : 'Invoices',
    },
    totalpaid: {
      id: 27,
      ref: 'totalpaid',
      name: 'totalpaid',
      title: isRTL ? 'المقبوضات' : 'Receipts',
    },
    toatlExpenses: {
      id: 28,
      ref: 'toatlExpenses',
      name: 'toatlExpenses',
      title: isRTL ? 'المصاريف' : 'Expenses',
    },
    desc: {
      id: 29,
      ref: 'desc',
      name: 'desc',
      title: isRTL ? 'البيان' : 'Description',
    },
    item: {
      id: 30,
      ref: 'item',
      name: isRTL ? 'itemNameAr' : 'itemName',
      title: words.service,
    },
    amountdebit: {
      id: 31,
      ref: 'debit',
      name: 'debit',
      title: isRTL ? 'مدين' : 'Debit',
    },
    amountcredit: {
      id: 32,
      ref: 'credit',
      name: 'credit',
      title: isRTL ? 'دائن' : 'Credit',
    },
    createdAt: {
      id: 33,
      ref: 'createdAt',
      name: 'createdAt',
      title: isRTL ? 'تاريخ الانشاء' : 'Created Date',
    },
  };
};
export const userCol = [
  { name: 'avatar', title: 'Avatar' },
  { name: 'username', title: 'User Name' },
  { name: 'name', title: 'Name' },
  { name: 'type', title: 'type' },
  { name: 'phone', title: 'Phone' },
  { name: 'email', title: 'Email' },
  { name: 'roles', title: 'Roles' },
];

export const catCol = [
  { name: 'name', title: 'Name' },
  { name: 'nameAr', title: 'Name Arabic' },
  // { name: "catType", title: "Type" },
];

export const brandCol = [
  { name: 'name', title: 'Name' },
  { name: 'nameAr', title: 'Name Arabic' },
];

export const custCol = [
  { name: 'name', title: 'Name' },
  { name: 'nameAr', title: 'Name Arabic' },
  { name: 'phone', title: 'Phone' },
  { name: 'email', title: 'Email' },
];

export const departCol = [
  { name: 'name', title: 'Name' },
  { name: 'nameAr', title: 'Name Arabic' },
  { name: 'color', title: 'Color' },
];

export const emplCol = [
  { name: 'avatar', title: 'Avatar' },
  { name: 'name', title: 'Name' },
  { name: 'nameAr', title: 'Name Arabic' },
  { name: 'phone', title: 'Phone' },
  { name: 'email', title: 'Email' },
  { name: 'departmentName', title: 'Department' },
];

export const emplColExtensions = [
  { columnName: 'avatar', width: '10%', align: 'left' },
  { columnName: 'name', width: '10%', align: 'left' },
  { columnName: 'nameAr', width: '10%', align: 'left' },
  { columnName: 'phone', width: '10%', align: 'left' },
  { columnName: 'email', width: '15%', align: 'left' },
  { columnName: 'departmentName', width: '20%', align: 'left' },
  { columnName: 'color', width: '10%', align: 'left' },
];

export const prodCol = [
  // { name: "barcode", title: "Barcode" },
  { name: 'name', title: 'Name' },
  { name: 'nameAr', title: 'Name Arabic' },
  { name: 'departmentName', title: 'Department' },
  { name: 'categoryName', title: 'Category' },
  { name: 'price', title: 'Price' },
  // { name: "brandName", title: "Brand" },
];

export const prodColExtensions = [
  { columnName: 'name', width: '20%', align: 'left' },
  { columnName: 'nameAr', width: '20%', align: 'left' },
  { columnName: 'price', width: '10%', align: 'right' },
  { columnName: 'departmentName', width: '15%', align: 'left' },
  { columnName: 'categoryName', width: '15%', align: 'left' },
];

export const servCol = [
  { name: 'name', title: 'Name' },
  { name: 'nameAr', title: 'Name Arabic' },
  { name: 'categoryName', title: 'Category' },
  { name: 'departmentName', title: 'Department' },
  { name: 'employeeName', title: 'Employee' },
  { name: 'price', title: 'Price' },
];
export const servColExtensions = [
  { columnName: 'name', width: '15%', align: 'left' },
  { columnName: 'nameAr', width: '15%', align: 'left' },
  { columnName: 'price', width: '10%', align: 'right' },
  { columnName: 'categoryName', width: '15%', align: 'left' },
  { columnName: 'departmentName', width: '15%', align: 'left' },
  { columnName: 'employeeName', width: '15%', align: 'left' },
];

export const eventCol = [
  { name: 'startDate', title: 'Time' },
  // { name: "endDate", title: "End" },
  { name: 'customerName', title: 'Customer' },
  { name: 'itemName', title: 'Service' },
  { name: 'departmentName', title: 'Department' },
  { name: 'employeeName', title: 'Employee' },
  { name: 'status', title: 'Status' },
  { name: 'amount', title: 'Amount' },
];
export const eventColExtensions = [
  { columnName: 'startDate', width: '15%', align: 'left' },
  { columnName: 'customerName', width: '15%', align: 'left' },
  { columnName: 'itemName', width: '20%', align: 'left' },
  { columnName: 'departmentName', width: '20%', align: 'left' },
  { columnName: 'employeeName', width: '10%', align: 'left' },
  { columnName: 'status', width: '8%', align: 'left' },
  { columnName: 'amount', width: '10%', align: 'right' },
];
export const defaultEventColExtensions = [
  { columnName: 'startDate', width: 180 },
  { columnName: 'customerName', width: 180 },
  { columnName: 'itemName', width: 180 },
  { columnName: 'departmentName', width: 180 },
  { columnName: 'employeeName', width: 180 },
  { columnName: 'status', width: 100 },
  { columnName: 'amount', width: 100 },
];
export const salesCol = [
  { name: 'opTime', title: 'Time' },
  { name: 'opDocNo', title: 'Invoice' },
  { name: 'itemName', title: 'Service' },
  { name: 'categoryName', title: 'Category' },
  { name: 'departmentName', title: 'Department' },
  { name: 'employeeName', title: 'Employee' },
  { name: 'customerName', title: 'Customer' },
  { name: 'amount', title: 'Amount' },
];
export const salesColExtensions = [
  { columnName: 'opTime', width: '15%', align: 'left' },
  { columnName: 'opDocNo', width: '10%', align: 'left' },
  { columnName: 'itemName', width: '20%', align: 'left' },
  { columnName: 'categoryName', width: '15%', align: 'left' },
  { columnName: 'departmentName', width: '15%', align: 'left' },
  { columnName: 'employeeName', width: '10%', align: 'left' },
  { columnName: 'customerName', width: '15%', align: 'left' },
  { columnName: 'amount', width: '10%', align: 'right' },
];
export const defaultSalesColExtensions = [
  { columnName: 'opTime', width: 150 },
  { columnName: 'opDocNo', width: 100 },
  { columnName: 'itemName', width: 150 },
  { columnName: 'categoryName', width: 130 },
  { columnName: 'departmentName', width: 130 },
  { columnName: 'employeeName', width: 130 },
  { columnName: 'customerName', width: 150 },
  { columnName: 'amount', width: 100 },
];

export const invCol = [
  { name: 'time', title: 'Date' },
  { name: 'docNo', title: 'No' },
  { name: 'customerName', title: 'Customer' },
  { name: 'customerPhone', title: 'Phone' },
  { name: 'total', title: 'Total' },
  { name: 'discount', title: 'Discount' },
  { name: 'amount', title: 'Net Amount' },
];
export const invColExtensions = [
  { columnName: 'time', width: '10%', align: 'left' },
  { columnName: 'docNo', width: '10%', align: 'left' },
  { columnName: 'customerName', width: 'auto' },
  { columnName: 'customerPhone', width: '10%', align: 'left' },
  { columnName: 'total', width: '10%', align: 'right' },
  { columnName: 'discount', width: '10%', align: 'right' },
  { columnName: 'amount', width: '10%', align: 'right' },
];

export const financeCol = [
  { name: 'time', title: 'Date' },
  { name: 'debitAcc', title: 'To' },
  { name: 'creditAcc', title: 'From' },
  { name: 'type', title: 'Type' },
  { name: 'desc', title: 'Description' },
  { name: 'docNo', title: 'No' },
  { name: 'refNo', title: 'Ref' },
  { name: 'amount', title: 'Amount' },
];
export const financeColExtensions = [
  { columnName: 'time', width: '8%', align: 'left' },
  { columnName: 'type', width: '10%', align: 'left' },
  { columnName: 'docNo', width: '8%', align: 'left' },
  { columnName: 'refNo', width: '8%', align: 'left' },
  { columnName: 'desc', width: 'auto' },
  { columnName: 'creditAcc', width: '10%' },
  { columnName: 'debitAcc', width: '14%' },
  { columnName: 'amount', width: '10%', align: 'right' },
];
