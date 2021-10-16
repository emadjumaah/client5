import _ from 'lodash';
import { getDateMonthFormat } from '../Shared/colorFormat';

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export const getSummaryViee = (current: any) => {
  let reptype;
  if (current === 'item') {
    reptype = { item: true };
  } else if (current === 'category') {
    reptype = { category: true };
  } else if (current === 'department') {
    reptype = { department: true };
  } else if (current === 'employee') {
    reptype = { employee: true };
  } else if (current === 'customer') {
    reptype = { customer: true };
  }
  return reptype;
};

export const getReportData = ({ list, refdata }: any) => {
  const data = refdata
    ? list.map((cs: any) => {
        const emp = refdata.filter(
          (de: any) => de._id === cs._id.employee
        )?.[0];
        const employeeName = emp?.name;
        const employeeNameAr = emp?.nameAr;
        const employeeColor = emp?.color;
        return {
          ...cs,
          amount: cs.credit - cs.debit,
          employeeName: employeeName ? employeeName : 'Not available',
          employeeNameAr: employeeNameAr ? employeeNameAr : 'غير متوفر',
          employeeColor,
        };
      })
    : null;
  return data;
};

export const groupSumCount = ({ list, name }: any) => {
  const items = _(list)
    .groupBy(name)
    .map((array, key) => ({
      name: key,
      count: _.uniqBy(array, '_id').length,
      total: _.sumBy(array, 'amount'),
    }))
    .value();
  const count = list.length;
  const total = _.sumBy(list, 'amount');
  return {
    items,
    count,
    total,
  };
};

export const formatKeyToMonth = (k: any, isRTL: any) => {
  if (k) {
    const a = k.split('-');
    const date = new Date(Number(a[1]), Number(a[0] - 1), 1);
    return getDateMonthFormat(date, isRTL);
  }
  return null;
};
