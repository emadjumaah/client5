import { getAppStartEndPeriod } from './time';

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export const commitAppointmentChanges = async ({
  added,
  changed,
  deleted,
  addEvent,
  editEvent,
  removeEvent,
  isRTL,
}: any) => {
  try {
    if (added) {
      const {
        title,
        startDate,
        endDate,
        items,
        customer,
        department,
        employee,
        resourse,
        contract,
        project,
        retype,
        ...rest
      } = added;
      const { startPeriod, endPeriod } = getAppStartEndPeriod();
      if (
        startDate < startPeriod ||
        startDate > endPeriod ||
        endDate < startPeriod ||
        endDate > endPeriod ||
        startDate > endDate ||
        startDate.getDate() !== endDate.getDate()
      ) {
        window.alert(isRTL ? 'يجب تعديل التاريخ' : 'Date should be change');
        return;
      } else if (!customer) {
        window.alert(isRTL ? 'يرجى اضافة عميل' : 'Please add Customer');
        return;
      } else {
        const variables = {
          title,
          startDate,
          endDate,
          items,
          customer: customer
            ? {
                customerId: customer._id,
                customerName: customer.name,
                customerNameAr: customer.nameAr,
                customerPhone: customer.phone,
              }
            : undefined,
          department: department
            ? {
                departmentId: department._id,
                departmentName: department.name,
                departmentNameAr: department.nameAr,
                departmentColor: department.color,
              }
            : undefined,
          employee: employee
            ? {
                employeeId: employee._id,
                employeeName: employee.name,
                employeeNameAr: employee.nameAr,
                employeeColor: employee.color,
                employeePhone: employee.phone,
              }
            : undefined,
          resourse: resourse
            ? {
                resourseId: resourse._id,
                resourseName: resourse.name,
                resourseNameAr: resourse.nameAr,
                resourseColor: resourse.color,
              }
            : undefined,
          contract: contract
            ? {
                contractId: contract._id,
                contractName: contract.name,
                contractNameAr: contract.nameAr,
              }
            : undefined,
          retype: retype
            ? {
                retypeId: retype._id,
                retypeName: retype.name,
                retypeNameAr: retype.nameAr,
              }
            : undefined,
          project: project
            ? {
                projectId: project._id,
                projectName: project.name,
                projectNameAr: project.nameAr,
              }
            : undefined,
          ...rest,
        };
        await addEvent({ variables });
      }
    }
    if (changed) {
      const id = Object.keys(changed)[0];
      const data = changed[id];
      const {
        items,
        customer,
        department,
        employee,
        resourse,
        contract,
        project,
        retype,
        ...rest
      } = data;

      const variables = {
        id: Number(id),
        items,
        customer: customer
          ? {
              customerId: customer._id,
              customerName: customer.name,
              customerNameAr: customer.nameAr,
              customerPhone: customer.phone,
            }
          : undefined,
        department: department
          ? {
              departmentId: department._id,
              departmentName: department.name,
              departmentNameAr: department.nameAr,
              departmentColor: department.color,
            }
          : undefined,
        employee: employee
          ? {
              employeeId: employee._id,
              employeeName: employee.name,
              employeeNameAr: employee.nameAr,
              employeeColor: employee.color,
              employeePhone: employee.phone,
            }
          : undefined,
        resourse: resourse
          ? {
              resourseId: resourse._id,
              resourseName: resourse.name,
              resourseNameAr: resourse.nameAr,
              resourseColor: resourse.color,
            }
          : undefined,
        contract: contract
          ? {
              contractId: contract._id,
              contractName: contract.name,
              contractNameAr: contract.nameAr,
            }
          : undefined,
        retype: retype
          ? {
              retypeId: retype._id,
              retypeName: retype.name,
              retypeNameAr: retype.nameAr,
            }
          : undefined,
        project: project
          ? {
              projectId: project._id,
              projectName: project.name,
              projectNameAr: project.nameAr,
            }
          : undefined,
        ...rest,
      };

      await editEvent({
        variables,
        optimisticResponse: {
          __typename: 'updateEvent',
          updateEvent: {
            __typename: 'Operation',
            id,
            ...variables,
          },
        },
      });
    }
    if (deleted !== undefined) {
      await removeEvent({ variables: { id: Number(deleted) } });
    }
  } catch (error) {
    console.log(error);
  }
};
export const commitReminderChanges = async ({
  added,
  changed,
  deleted,
  addEvent,
  editEvent,
  removeEvent,
  isRTL,
}: any) => {
  try {
    if (added) {
      const {
        title,
        startDate,
        endDate,
        items,
        customer,
        department,
        employee,
        resourse,
        contract,
        ...rest
      } = added;
      const { startPeriod, endPeriod } = getAppStartEndPeriod();
      const itemslist = JSON.parse(items);
      if (!(itemslist.length > 0)) {
        window.alert(isRTL ? 'يجب اضافة خدمة' : 'Service should be added');
        return;
      }
      if (
        startDate < startPeriod ||
        startDate > endPeriod ||
        endDate < startPeriod ||
        endDate > endPeriod ||
        startDate > endDate ||
        startDate.getDate() !== endDate.getDate()
      ) {
        window.alert(isRTL ? 'يجب تعديل التاريخ' : 'Date should be change');
        return;
      } else if (!customer) {
        window.alert(isRTL ? 'يرجى اضافة عميل' : 'Please add Customer');
        return;
      } else {
        const variables = {
          title,
          startDate,
          endDate,
          items,
          customer: customer
            ? {
                customerId: customer._id,
                customerName: customer.name,
                customerNameAr: customer.nameAr,
                customerPhone: customer.phone,
              }
            : undefined,
          department: department
            ? {
                departmentId: department._id,
                departmentName: department.name,
                departmentNameAr: department.nameAr,
                departmentColor: department.color,
              }
            : undefined,
          employee: employee
            ? {
                employeeId: employee._id,
                employeeName: employee.name,
                employeeNameAr: employee.nameAr,
                employeeColor: employee.color,
                employeePhone: employee.phone,
              }
            : undefined,
          resourse: resourse
            ? {
                resourseId: resourse._id,
                resourseName: resourse.name,
                resourseNameAr: resourse.nameAr,
                resourseColor: resourse.color,
              }
            : undefined,
          contract: contract
            ? {
                contractId: contract._id,
                contractName: contract.name,
                contractNameAr: contract.nameAr,
              }
            : undefined,
          ...rest,
        };
        await addEvent({ variables });
      }
    }
    if (changed) {
      const id = Object.keys(changed)[0];
      const data = changed[id];
      const {
        items,
        customer,
        department,
        employee,
        resourse,
        contract,
        ...rest
      } = data;

      const variables = {
        id: Number(id),
        items,
        customer: customer
          ? {
              customerId: customer._id,
              customerName: customer.name,
              customerNameAr: customer.nameAr,
              customerPhone: customer.phone,
            }
          : undefined,
        department: department
          ? {
              departmentId: department._id,
              departmentName: department.name,
              departmentNameAr: department.nameAr,
              departmentColor: department.color,
            }
          : undefined,
        employee: employee
          ? {
              employeeId: employee._id,
              employeeName: employee.name,
              employeeNameAr: employee.nameAr,
              employeeColor: employee.color,
              employeePhone: employee.phone,
            }
          : undefined,
        resourse: resourse
          ? {
              resourseId: resourse._id,
              resourseName: resourse.name,
              resourseNameAr: resourse.nameAr,
              resourseColor: resourse.color,
            }
          : undefined,
        contract: contract
          ? {
              contractId: contract._id,
              contractName: contract.name,
              contractNameAr: contract.nameAr,
            }
          : undefined,
        ...rest,
      };

      await editEvent({
        variables,
        optimisticResponse: {
          __typename: 'updateEvent',
          updateEvent: {
            __typename: 'Operation',
            id,
            ...variables,
          },
        },
      });
    }
    if (deleted !== undefined) {
      await removeEvent({ variables: { id: Number(deleted) } });
    }
  } catch (error) {
    console.log(error);
  }
};

export const getSelectedFromAppointment = (row: any) => {
  const { item, customer, department, employee, contract } = row;
  const selectedDepartment = row.departmentId
    ? {
        _id: department ? department._id : row.departmentId,
        name: department ? department.name : row.departmentName,
        nameAr: department ? department.nameAr : row.departmentNameAr,
        color: department ? department.color : row.departmentColor,
      }
    : null;
  const selectedEmployee = row.employeeId
    ? {
        _id: employee ? employee._id : row.employeeId,
        name: employee ? employee.name : row.employeeName,
        nameAr: employee ? employee.nameAr : row.employeeNameAr,
        color: employee ? employee.color : row.employeeColor,
      }
    : null;
  const selectedContract = row.contractId
    ? {
        _id: contract ? contract._id : row.contractId,
        name: contract ? contract.name : row.contractName,
        nameAr: contract ? contract.nameAr : row.contractNameAr,
        color: contract ? contract.color : row.contractColor,
      }
    : null;
  const selectedItem = row.itemId
    ? {
        _id: item ? item._id : row.itemId,
        name: item ? item.name : row.itemName,
        nameAr: item ? item.nameAr : row.itemNameAr,
      }
    : null;
  const priceValue = row.amount ? row.amount : item ? item.price : '';

  const selectedCustomer = row.customerId
    ? {
        _id: customer ? customer._id : row.customerId,
        name: customer ? customer.name : row.customerName,
        nameAr: customer ? customer.nameAr : row.customerNameAr,
        phone: customer ? customer.phone : row.customerPhone,
      }
    : null;
  return {
    selectedDepartment,
    selectedEmployee,
    selectedItem,
    priceValue,
    selectedCustomer,
    selectedContract,
  };
};
export const setRowFromAppointment = (row: any) => {
  const {
    departmentId,
    departmentName,
    departmentNameAr,
    departmentColor,
    employeeId,
    employeeName,
    employeeNameAr,
    employeeColor,
    resourseId,
    resourseName,
    resourseNameAr,
    resourseColor,
    contractId,
    contractName,
    contractNameAr,
    itemId,
    itemName,
    itemNameAr,
    customerId,
    customerName,
    customerNameAr,
    customerPhone,
    ...rest
  } = row;

  const newrow = { ...rest };

  newrow.department = row.department
    ? row.department
    : {
        _id: row.departmentId,
        name: row.departmentName,
        nameAr: row.departmentNameAr,
        color: row.departmentColor,
      };

  if (employeeId) {
    newrow.employee = row.employee
      ? row.employee
      : {
          _id: row.employeeId,
          name: row.employeeName,
          nameAr: row.employeeNameAr,
          color: row.employeeColor,
        };
  }
  if (resourseId) {
    newrow.resourse = row.resourse
      ? row.resourse
      : {
          _id: row.resourseId,
          name: row.resourseName,
          nameAr: row.resourseNameAr,
          color: row.resourseColor,
        };
  }
  if (contractId) {
    newrow.contract = row.contract
      ? row.contract
      : {
          _id: row.contractId,
          name: row.contractName,
          nameAr: row.contractNameAr,
        };
  }
  if (itemId) {
    newrow.item = row.item
      ? row.item
      : {
          _id: row.itemId,
          name: row.itemName,
          nameAr: row.itemNameAr,
        };
  }
  if (customerId) {
    newrow.customer = row.customer
      ? row.customer
      : {
          _id: row.customerId,
          name: row.customerName,
          nameAr: row.customerNameAr,
          phone: row.customerPhone,
        };
  }
  return newrow;
};
export const addObjectsToAppointment = (row: any) => {
  const { departmentId, employeeId, itemId, customerId, contractId } = row;
  const newRow = row;
  if (departmentId) {
    const department = {
      _id: row.departmentId,
      name: row.departmentName,
      nameAr: row.departmentNameAr,
      color: row.departmentColor,
    };
    newRow.department = department;
  }
  if (employeeId) {
    const employee = {
      _id: row.employeeId,
      name: row.employeeName,
      nameAr: row.employeeNameAr,
      color: row.employeeColor,
    };
    newRow.employee = employee;
  }
  if (contractId) {
    const contract = {
      _id: row.contractId,
      name: row.contractName,
      nameAr: row.contractNameAr,
    };
    newRow.contract = contract;
  }
  if (itemId) {
    const item = {
      _id: row.itemId,
      name: row.itemName,
      nameAr: row.itemNameAr,
    };
    newRow.item = item;
  }
  if (customerId) {
    const customer = {
      _id: row.customerId,
      name: row.customerName,
      nameAr: row.customerNameAr,
      phone: row.customerPhone,
    };
    newRow.customer = customer;
  }
  return newRow;
};

export const timeToHourMinute = (time: any, zone = 'en-US') => {
  return time.toLocaleString(zone, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};
