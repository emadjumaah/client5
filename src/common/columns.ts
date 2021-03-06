/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { getStoreItem } from '../store';

const store = getStoreItem('store');
const template = store?.template;
const lang = store?.lang;
const tempwords = template?.words?.[lang];
// const options = template?.options;

export const getRowId = (row: { _id: any }) => row._id;

export const getColumns = ({ isRTL, words }: any) => {
  return {
    no: { id: 1, ref: 'no', name: 'no', title: words?.no },
    startDate: { id: 1.1, ref: 'date', name: 'startDate', title: words?.time },
    runtime: { id: 1.15, ref: 'date', name: 'runtime', title: words?.time },
    start: { id: 1.2, ref: 'date', name: 'start', title: words?.start },
    end: { id: 1.3, ref: 'date', name: 'end', title: words?.end },
    tasktype: {
      id: 1.4,
      ref: 'tasktype',
      name: 'tasktype',
      title: words?.type,
    },
    time: { id: 2, ref: 'time', name: 'time', title: words?.timedate },
    opTime: { id: 3, ref: 'opTime', name: 'opTime', title: words?.time },
    docNo: { id: 4, ref: 'docNo', name: 'docNo', title: words?.no },
    title: { id: 4, ref: 'title', name: 'title', title: words?.title },
    opDocNo: { id: 5, ref: 'opDocNo', name: 'opDocNo', title: words?.no },
    employee: {
      id: 6,
      ref: 'employee',
      name: isRTL ? 'employeeNameAr' : 'employeeName',
      title: tempwords?.employee,
    },
    name: {
      id: 61,
      ref: 'name',
      name: isRTL ? 'nameAr' : 'name',
      title: words?.name,
    },
    service: {
      id: 7,
      ref: 'service',
      name: isRTL ? 'itemNameAr' : 'itemName',
      title: words?.item,
    },
    department: {
      id: 8,
      ref: 'department',
      name: isRTL ? 'departmentNameAr' : 'departmentName',
      title: tempwords?.department,
    },
    contract: {
      id: 8.5,
      ref: 'contract',
      name: isRTL ? 'contractNameAr' : 'contractName',
      title: tempwords?.task,
    },
    resourse: {
      id: 9,
      ref: 'resourse',
      name: isRTL ? 'resourseNameAr' : 'resourseName',
      title: tempwords?.resourse,
    },
    category: {
      id: 9,
      ref: 'category',
      name: isRTL ? 'categoryNameAr' : 'categoryName',
      title: words?.category,
    },
    emptype: {
      id: 9.2,
      ref: 'emptype',
      name: isRTL ? 'emptypeNameAr' : 'emptypeName',
      title: isRTL ? '?????????? ????????????' : 'Employee Type',
    },
    restype: {
      id: 9.4,
      ref: 'restype',
      name: isRTL ? 'restypeNameAr' : 'restypeName',
      title: isRTL ? '?????? ????????????' : 'Resourse Type',
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
      title: words?.supplier,
    },
    project: {
      id: 10.5,
      ref: 'project',
      name: isRTL ? 'projectNameAr' : 'projectName',
      title: tempwords?.project,
    },
    status: { id: 11, ref: 'status', name: 'status', title: words?.status },
    carstatus: {
      id: 11,
      ref: 'carstatus',
      name: 'carstatus',
      title: words?.status,
    },
    amount: { id: 12, ref: 'amount', name: 'amount', title: words?.amount },
    acc: {
      id: 13,
      ref: 'acc',
      name: isRTL ? 'accNameAr' : 'accName',
      title: words?.account,
    },
    opAcc: {
      id: 14,
      ref: 'opAcc',
      name: isRTL ? 'opaccNameAr' : 'opaccName',
      title: isRTL ? '???????????? ??????????????' : 'Other side Account',
    },
    debit: { id: 15, ref: 'debit', name: 'debit', title: words?.debit },
    credit: { id: 16, ref: 'credit', name: 'credit', title: words?.credit },
    accType: { id: 17, ref: 'accType', name: 'accType', title: 'accType' },
    kaidType: { id: 18, ref: 'kaidType', name: 'kaidType', title: 'kaidType' },
    opType: {
      id: 19,
      ref: 'opType',
      name: 'opType',
      title: isRTL ? '??????????????' : 'Document',
    },
    retype: {
      id: 19.5,
      ref: 'retype',
      name: isRTL ? 'retypeNameAr' : 'retypeName',
      title: isRTL ? '??????????' : 'Type',
    },
    refNo: {
      id: 20,
      ref: 'refNo',
      name: 'refNo',
      title: isRTL ? '?????? ????????????' : 'Ref',
    },
    rased: {
      id: 20,
      ref: 'rased',
      name: 'rased',
      title: isRTL ? '????????????' : 'Balance',
    },
    eventNo: {
      id: 21,
      ref: 'eventNo',
      name: 'eventNo',
      title: isRTL ? '?????? ????????????' : 'Ref',
    },
    progress: {
      id: 22,
      ref: 'progress',
      name: 'progress',
      title: isRTL ? '???????? ??????????????' : 'Progress',
    },
    appointments: {
      id: 65,
      ref: 'appointments',
      name: 'appointments',
      title: isRTL ? '????????????????' : 'Appointments',
    },
    sales: {
      id: 66,
      ref: 'sales',
      name: 'sales',
      title: isRTL ? '????????????????' : 'Sales',
    },
    purchase: {
      id: 67,
      ref: 'purchase',
      name: 'purchase',
      title: isRTL ? '??????????????????' : 'Purchase',
    },
    expenses: {
      id: 68,
      ref: 'expenses',
      name: 'expenses',
      title: isRTL ? '??????????????????' : 'Expenses',
    },
    kaids: {
      id: 68,
      ref: 'kaids',
      name: 'kaids',
      title: isRTL ? '????????????' : 'Entries',
    },
    evQty: {
      id: 23,
      ref: 'evQty',
      name: 'evQty',
      title: isRTL ? '?????? ????????????????' : 'Appointments',
    },
    id: {
      id: 25,
      ref: 'id',
      name: 'id',
      title: isRTL ? '??????????' : 'No',
    },
    fromto: {
      id: 25,
      ref: 'fromto',
      name: 'fromto',
      title: isRTL ? '??????????' : 'Time',
    },
    done: {
      id: 25,
      ref: 'done',
      name: 'done',
      title: isRTL ? '??????????????' : 'Done',
    },
    sent: {
      id: 25,
      ref: 'sent',
      name: 'sent',
      title: isRTL ? '??????????????' : 'Done',
    },
    invo: {
      id: 25,
      ref: 'done',
      name: 'done',
      title: isRTL ? '??????????????' : 'Done',
    },
    totalinvoiced: {
      id: 26,
      ref: 'totalinvoiced',
      name: 'totalinvoiced',
      title: isRTL ? '????????????????' : 'Invoices',
    },
    totalpaid: {
      id: 27,
      ref: 'totalpaid',
      name: 'totalpaid',
      title: isRTL ? '??????????????????' : 'Receipts',
    },
    toatlExpenses: {
      id: 28,
      ref: 'toatlExpenses',
      name: 'toatlExpenses',
      title: isRTL ? '??????????????????' : 'Expenses',
    },
    toatlProdExpenses: {
      id: 28.1,
      ref: 'toatlExpenses',
      name: 'toatlExpenses',
      title: isRTL ? '?????????????? ????????????????' : 'Products Expenses',
    },
    desc: {
      id: 29,
      ref: 'desc',
      name: 'desc',
      title: isRTL ? '????????????' : 'Description',
    },
    item: {
      id: 30,
      ref: 'item',
      name: isRTL ? 'itemNameAr' : 'itemName',
      title: words?.service,
    },
    product: {
      id: 30.5,
      ref: 'product',
      name: isRTL ? 'itemNameAr' : 'itemName',
      title: words?.product,
    },
    amountdebit: {
      id: 31,
      ref: 'debit',
      name: 'debit',
      title: isRTL ? '????????' : 'Debit',
    },
    amountcredit: {
      id: 32,
      ref: 'credit',
      name: 'credit',
      title: isRTL ? '????????' : 'Credit',
    },
    createdAt: {
      id: 33,
      ref: 'createdAt',
      name: 'createdAt',
      title: isRTL ? '?????????? ??????????????' : 'Created Date',
    },
    location: {
      id: 34,
      ref: 'location',
      name: 'location',
      title: isRTL ? '????????????' : 'Lopcation',
    },
    nots: {
      id: 35,
      ref: 'nots',
      name: 'nots',
      title: isRTL ? '??????????????' : 'Notifications',
    },
    type: {
      id: 36,
      ref: 'type',
      name: 'type',
      title: isRTL ? '??????????' : 'Type',
    },
    raseed: {
      id: 37,
      ref: 'raseed',
      name: 'raseed',
      title: isRTL ? '????????????' : 'Balance',
    },
    data: {
      id: 38,
      ref: 'data',
      name: 'data',
      title: isRTL ? '????????????????' : 'Information',
    },
    taskconnect: {
      id: 38.6,
      ref: 'taskconnect',
      name: 'taskconnect',
      title: isRTL ? '???????????? ????????????????' : 'Connections',
    },
    daysdata: {
      id: 38,
      ref: 'daysdata',
      name: 'daysdata',
      title: isRTL ? '????????????' : 'Amount',
    },
    telHome: {
      id: 39,
      ref: 'telHome',
      name: 'telHome',
      title: words.telHome,
    },
    workId: {
      id: 40,
      ref: 'workId',
      name: 'workId',
      title: words.workId,
    },
    national: {
      id: 41,
      ref: 'national',
      name: 'national',
      title: words.national,
    },
    nationalNo: {
      id: 42,
      ref: 'nationalNo',
      name: 'nationalNo',
      title: words.nationalNo,
    },
    nationalDate: {
      id: 43,
      ref: 'nationalDate',
      name: 'nationalDate',
      title: words.nationalDate,
    },
    licenseNo: {
      id: 44,
      ref: 'licenseNo',
      name: 'licenseNo',
      title: words.licenseNo,
    },
    licenseDate: {
      id: 45,
      ref: 'licenseDate',
      name: 'licenseDate',
      title: words.licenseDate,
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
