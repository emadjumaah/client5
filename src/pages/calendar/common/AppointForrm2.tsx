/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useContext, useEffect, useState } from 'react';
import { Box } from '@material-ui/core';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import {
  useDepartments,
  useEmployees,
  useCustomers,
  useServices,
} from '../../../hooks';
import {
  PopupDeprtment,
  PopupEmployee,
  PopupCustomer,
  PopupService,
} from '../../../pubups';
import {
  PopupAutoField,
  CustomerAutoField,
  ServiceAutoField,
  PopupAutoFieldEmp,
} from '../../../Shared';
import { getSelectedFromAppointment, roles } from '../../../common';
import { GContextTypes } from '../../../types';
import { GlobalContext } from '../../../contexts';
import { DateTimePicker } from '@material-ui/pickers';
import { StatusSelect } from './StatusSelect';

export const AppointForm2 = ({ onFieldChange, appointmentData }: any) => {
  const {
    translate: { words, isRTL },
  }: GContextTypes = useContext(GlobalContext);
  const [openDep, setOpenDep] = useState(false);
  const [openEmp, setOpenEmp] = useState(false);
  const [openCust, setOpenCust] = useState(false);
  const [openItm, setOpenItm] = useState(false);

  const [isEditor, setIsEditor] = useState(false);

  const [newtext, setNewtext] = useState('');
  const [status, setStatus] = useState(appointmentData.status || 2);

  useEffect(() => {
    const isCalPOSEditor = roles.isEditor();
    setIsEditor(isCalPOSEditor);
  }, []);

  const openDepartment = () => {
    setOpenDep(true);
  };
  const onCloseDepartment = () => {
    setOpenDep(false);
    setNewtext('');
  };
  const openEmployee = () => {
    setOpenEmp(true);
  };
  const onCloseEmploee = () => {
    setOpenEmp(false);
    setNewtext('');
  };
  const openCustomer = () => {
    setOpenCust(true);
  };
  const onCloseCustomer = () => {
    setOpenCust(false);
    setNewtext('');
  };
  const openItem = () => {
    setOpenItm(true);
  };
  const onCloseItem = () => {
    setOpenItm(false);
    setNewtext('');
  };

  const { departments, addDepartment, editDepartment } = useDepartments();
  const { employees, addEmployee, editEmployee } = useEmployees();
  const { services, addService, editService } = useServices();
  const { customers, addCustomer, editCustomer } = useCustomers();

  useEffect(() => {
    if (!appointmentData.status) {
      onNewFieldChange(2, 'status');
    }
  }, []);

  const onNewFieldChange = (nextValue: any, name: any) => {
    onFieldChange({ [name]: nextValue });
  };

  const onSelectServiceChange = (nextValue: any, name: any) => {
    onFieldChange({ [name]: nextValue });
    if (nextValue?.employeeId) {
      const itememp = employees.filter(
        (emp: any) => emp._id === nextValue.employeeId
      )[0];
      onNewFieldChange(itememp, 'employee');
    }
    if (nextValue?.departmentId) {
      const itemdep = departments.filter(
        (dep: any) => dep._id === nextValue.departmentId
      )[0];
      onNewFieldChange(itemdep, 'department');
    }
  };

  const { startDate, endDate } = appointmentData;

  const {
    selectedDepartment,
    selectedEmployee,
    selectedItem,
    priceValue,
    selectedCustomer,
  } = getSelectedFromAppointment(appointmentData);

  return (
    <Box style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      <Box padding={3}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Box
            display="flex"
            style={{
              paddingBottom: 10,
              alignItems: 'center',
              justifyContent: 'space-between',
              marginRight: isRTL ? undefined : 54,
              marginLeft: isRTL ? 54 : undefined,
            }}
          >
            <DateTimePicker
              autoOk
              variant="inline"
              id="time-pickerstart"
              label={words.start}
              name="startDate"
              inputVariant="standard"
              format="dd/MM/yyyy hh:mm"
              value={startDate}
              onChange={(d: any) => onNewFieldChange(d, 'startDate')}
              style={{ width: 175 }}
            />
            <DateTimePicker
              autoOk
              variant="inline"
              id="time-pickerend"
              format="dd/MM/yyyy hh:mm"
              margin="dense"
              label={words.end}
              name="endDate"
              inputVariant="standard"
              value={endDate}
              onChange={(d: any) => onNewFieldChange(d, 'endDate')}
              style={{ width: 175 }}
            />
          </Box>
        </MuiPickersUtilsProvider>

        <CustomerAutoField
          name="customer"
          title={words.customer}
          options={customers}
          value={selectedCustomer || appointmentData.customer || null}
          onNewFieldChange={onNewFieldChange}
          open={openCustomer}
          setNewtext={setNewtext}
          isRTL={isRTL}
          canAdd={isEditor}
        ></CustomerAutoField>
        <ServiceAutoField
          setNewtext={setNewtext}
          name="item"
          priceValue={priceValue}
          title={words.service}
          options={services}
          value={selectedItem || appointmentData.item || null}
          onNewFieldChange={onSelectServiceChange}
          open={openItem}
          isRTL={isRTL}
          canAdd={isEditor}
        ></ServiceAutoField>
        <Box style={{ marginTop: 30 }}></Box>
        <PopupAutoField
          name="department"
          title={words.department}
          options={departments}
          value={selectedDepartment || appointmentData.department || null}
          onNewFieldChange={onNewFieldChange}
          open={openDepartment}
          setNewtext={setNewtext}
          isRTL={isRTL}
          canAdd={isEditor}
        ></PopupAutoField>
        <PopupAutoFieldEmp
          name="employee"
          title={words.employee}
          options={employees}
          value={selectedEmployee || appointmentData.employee || null}
          onNewFieldChange={onNewFieldChange}
          open={openEmployee}
          setNewtext={setNewtext}
          isRTL={isRTL}
          appointmentData={appointmentData}
          canAdd={isEditor}
        ></PopupAutoFieldEmp>
        <StatusSelect
          status={status}
          setStatus={setStatus}
          onNewFieldChange={onNewFieldChange}
          isRTL={isRTL}
          title={words.status}
        ></StatusSelect>
      </Box>
      <PopupDeprtment
        newtext={newtext}
        open={openDep}
        onClose={onCloseDepartment}
        isNew={true}
        setNewValue={onNewFieldChange}
        row={null}
        addAction={addDepartment}
        editAction={editDepartment}
      ></PopupDeprtment>
      <PopupEmployee
        newtext={newtext}
        open={openEmp}
        onClose={onCloseEmploee}
        isNew={true}
        setNewValue={onNewFieldChange}
        row={null}
        addAction={addEmployee}
        editAction={editEmployee}
      ></PopupEmployee>
      <PopupCustomer
        newtext={newtext}
        open={openCust}
        onClose={onCloseCustomer}
        isNew={true}
        setNewValue={onNewFieldChange}
        row={null}
        addAction={addCustomer}
        editAction={editCustomer}
      ></PopupCustomer>
      <PopupService
        newtext={newtext}
        open={openItm}
        onClose={onCloseItem}
        isNew={true}
        setNewValue={onNewFieldChange}
        row={null}
        addAction={addService}
        editAction={editService}
      ></PopupService>
    </Box>
  );
};
