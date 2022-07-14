/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { dublicateAlert, errorAlert, yup, messageAlert } from '../Shared';
import { GContextTypes } from '../types';
import { GlobalContext } from '../contexts';
import useAccounts from '../hooks/useAccounts';
import { operationTypes } from '../constants';
import { parents } from '../constants/kaid';
import PopupLayout from '../pages/main/PopupLayout';
import { Box, Grid } from '@material-ui/core';
import { useReactToPrint } from 'react-to-print';
import { CalenderLocal, TextFieldLocal } from '../components';
import AutoFieldLocal from '../components/fields/AutoFieldLocal';
import { useSuppliers, useTemplate } from '../hooks';
import { useLazyQuery } from '@apollo/client';
import getInvoicesList from '../graphql/query/getInvoicesList';
import { ReceiptPrint } from '../print';
import PopupSupplier from './PopupSupplier';
import { sleep, successAlert } from '../Shared/helpers';
import useEmployees from '../hooks/useEmployees';
import { SelectLocal } from '../pages/calendar/common/SelectLocal';
import { payTypes } from '../constants/datatypes';
import PopupEmployee from './PopupEmployee';
const PopupPayment = ({
  open,
  onClose,
  row,
  isNew,
  addAction,
  editAction,
  theme,
  name,
  value,
  company,
}: any) => {
  const [saving, setSaving] = useState(false);
  const [alrt, setAlrt] = useState({ show: false, msg: '', type: undefined });
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [ptype, setPtype] = React.useState(1);
  const [credaccounts, setCredaccounts] = React.useState([]);

  const [debitAcc, setDebitAcc]: any = React.useState(null);
  const [creditAcc, setCreditAcc]: any = React.useState(null);

  const [suppvalue, setSuppvalue] = useState<any>(
    name === 'supplierId' ? value : null
  );
  const [suppError, setSuppError] = useState<any>(false);

  const [emplvalue, setEmplvalue] = useState<any>(
    name === 'employeeId' ? value : null
  );
  const [emplError, setEmplError] = useState<any>(false);

  const [invoices, setInvoices] = useState<any>([]);
  const [invoicevalue, setInvoicevalue] = useState<any>(null);

  const [newtext, setNewtext] = useState('');
  const [openCust, setOpenCust] = useState(false);
  const [openEmp, setOpenEmp] = useState(false);

  const { register, handleSubmit, errors, reset } = useForm(
    yup.depositResolver
  );

  const {
    translate: { words, isRTL },
    store: { user },
  }: GContextTypes = useContext(GlobalContext);

  const { accounts } = useAccounts();
  const { suppliers, addSupplier, editSupplier } = useSuppliers();
  const { employees, addEmployee, editEmployee } = useEmployees();
  const { tempwords } = useTemplate();

  const [loadInvoices, invoicesData]: any = useLazyQuery(getInvoicesList, {
    fetchPolicy: 'cache-and-network',
  });

  const openSupplier = () => {
    setOpenCust(true);
  };
  const openEmployee = () => {
    setOpenEmp(true);
  };
  const onCloseEmploee = () => {
    setOpenEmp(false);
    setNewtext('');
  };
  const onCloseSupplier = () => {
    setOpenCust(false);
    setNewtext('');
  };
  const onNewSuppChange = (nextValue: any) => {
    setSuppvalue(nextValue);
  };
  const onNewEmplChange = (nextValue: any) => {
    setEmplvalue(nextValue);
  };

  useEffect(() => {
    if (suppvalue) {
      const variables = { supplierId: suppvalue._id };
      loadInvoices({ variables });
    }
    if (isNew) {
      if (name === 'contractId') {
        if (value?.supplierId) {
          const dept = suppliers.filter(
            (dep: any) => dep._id === value?.supplierId
          )?.[0];
          setSuppvalue(dept);
        }
      }
    }
  }, [suppvalue, open]);

  useEffect(() => {
    if (name && value) {
      if (name === 'supplierId') {
        setSuppvalue(value);
      }
    }
  }, [name, value, open]);

  useEffect(() => {
    if (invoicesData?.data?.getInvoicesList?.data) {
      const { data } = invoicesData.data.getInvoicesList;
      if (data?.length > 0) {
        const ndata = data.map((d: any) => {
          const title = `${d.docNo} - ${d.amount}QR`;
          return {
            ...d,
            name: title,
            nameAr: title,
          };
        });
        setInvoices(ndata);
        if (row.refNo) {
          const inv = ndata.filter((ts: any) => ts.docNo === row.refNo)?.[0];
          setInvoicevalue(inv);
        }
      }
    }
  }, [invoicesData]);

  useEffect(() => {
    if (row && row._id) {
      const ca = row.creditAcc;
      const da = row.debitAcc;

      const filteredcredit = accounts.filter(
        (acc: any) => acc.parentcode === parents.CASH
      );
      setCredaccounts(filteredcredit);

      if (ca) {
        const credit = accounts.filter((acc: any) => acc.code === ca)[0];
        setCreditAcc(credit);
      }
      if (da) {
        const debit = accounts.filter((acc: any) => acc.code === da)[0];
        setDebitAcc(debit);
        if (debit.code === 1350) {
          setPtype(2);
        } else {
          setPtype(1);
        }
      }
      const supplierId = row?.supplierId;
      if (supplierId) {
        const supp = suppliers.filter((it: any) => it._id === supplierId)[0];
        setSuppvalue(supp);
      }
      const employeeId = row?.employeeId;
      if (employeeId) {
        const emp = employees.filter((it: any) => it._id === employeeId)[0];
        setEmplvalue(emp);
      }
      handleDateChange(row.time);
    } else {
      const filtereddebits =
        ptype === 1
          ? accounts.filter(
              (acc: any) => acc.parentcode === parents.ACCOUNTS_PAYABLE
            )
          : accounts.filter((acc: any) => acc.code === 1350);
      const filteredcredit = accounts.filter(
        (acc: any) => acc.parentcode === parents.CASH
      );
      setCredaccounts(filteredcredit);
      setDebitAcc(filtereddebits?.[0]);
      setCreditAcc(filteredcredit?.[0]);
    }
  }, [row, ptype, open]);

  const componentRef: any = useRef();
  const handleReactPrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Invoice #${row?.docNo}`,
    removeAfterPrint: true,
  });
  const printData = {
    no: row?.docNo,
    time: selectedDate,
    supplierName: suppvalue?.name,
    supplierNameAr: suppvalue?.nameAr,
    supplierPhone: suppvalue?.phone,
    refNo: row?.refNo,
    title: row?.title,
    desc: row?.desc,
    amount: row?.amount,
    isRTL: isRTL,
    chequeBank: row?.chequeBank,
    chequeNo: row?.chequeNo,
    chequeDate: row?.chequeDate,
  };
  const onSubmit = async (data: any) => {
    if (selectedDate > new Date()) {
      await messageAlert(
        setAlrt,
        isRTL ? 'يجب تعديل التاريخ' : 'Date should be change'
      );
      return;
    }
    const { amount, title, desc, chequeBank, chequeNo, chequeDate } = data;
    if (!creditAcc) {
      await messageAlert(
        setAlrt,
        isRTL ? 'يجب تحديد الحساب' : 'You have to select Account'
      );
      return;
    }
    if (ptype === 2 && !emplvalue) {
      await messageAlert(
        setAlrt,
        isRTL ? 'يجب تحديد الموظف' : 'You have to select Employee'
      );
      return;
    }
    if (ptype === 1 && !suppvalue) {
      await messageAlert(
        setAlrt,
        isRTL ? 'يجب تحديد المورد' : 'You have to select Supplier'
      );
      return;
    }
    setSaving(true);
    const supplier = suppvalue
      ? {
          supplierId: suppvalue._id,
          supplierName: suppvalue.name,
          supplierNameAr: suppvalue.nameAr,
          supplierPhone: suppvalue.color,
        }
      : {
          supplierId: undefined,
          supplierName: undefined,
          supplierNameAr: undefined,
          supplierPhone: undefined,
        };
    const employee = emplvalue
      ? {
          employeeId: emplvalue._id,
          employeeName: emplvalue.name,
          employeeNameAr: emplvalue.nameAr,
          employeeColor: emplvalue.color,
        }
      : {
          employeeId: undefined,
          employeeName: undefined,
          employeeNameAr: undefined,
          employeeColor: undefined,
        };
    const department = invoicevalue
      ? {
          departmentId: invoicevalue.departmentId,
          departmentName: invoicevalue.departmentName,
          departmentNameAr: invoicevalue.departmentNameAr,
          departmentColor: invoicevalue.departmentColor,
        }
      : {
          departmentId: undefined,
          departmentName: undefined,
          departmentNameAr: undefined,
          departmentColor: undefined,
        };

    const resourse = invoicevalue
      ? {
          resourseId: invoicevalue.resourseId,
          resourseName: invoicevalue.resourseName,
          resourseNameAr: invoicevalue.resourseNameAr,
          resourseColor: invoicevalue.resourseColor,
        }
      : {
          resourseId: undefined,
          resourseName: undefined,
          resourseNameAr: undefined,
          resourseColor: undefined,
        };
    const contract = invoicevalue
      ? {
          contractId: invoicevalue.contractId,
          contractName: invoicevalue.contractName,
          contractNameAr: invoicevalue.contractNameAr,
        }
      : {
          contractId: undefined,
          contractName: undefined,
          contractNameAr: undefined,
        };

    const variables: any = {
      _id: row && row._id ? row._id : undefined, // is it new or edit
      opType: operationTypes.supplierPayemnt,
      time: selectedDate,
      debitAcc: debitAcc.code,
      creditAcc: creditAcc.code,
      refNo: invoicevalue ? invoicevalue.docNo : undefined,
      supplier,
      department,
      employee,
      resourse,
      contract,
      amount,
      chequeBank,
      chequeNo,
      chequeDate,
      title,
      desc,
      branch: user.branch,
      userId: user._id,
    };
    const mutate = isNew ? addAction : editAction;
    apply(mutate, variables);
  };

  const apply = async (mutate: any, variables: any) => {
    try {
      mutate({ variables });
      await sleep(2);
      await successAlert(setAlrt, isRTL);
      setSaving(false);
      closeModal();
    } catch (error) {
      onError(error);
      setSaving(false);
    }
  };

  const onError = async (error: any) => {
    if (error.message.includes('duplicate')) {
      await dublicateAlert(setAlrt, isRTL);
    } else {
      await errorAlert(setAlrt, isRTL);
      resetAll();
      console.log(error);
    }
  };

  const resetAll = () => {
    reset();
    setPtype(1);
    setCreditAcc(null);
    setDebitAcc(null);
    setCredaccounts([]);
    setInvoices([]);
    setSuppvalue(name === 'supplierId' ? value : null);
    setEmplvalue(name === 'employeeId' ? value : null);
    setInvoicevalue(null);
    setSaving(false);
  };
  const closeModal = () => {
    resetAll();
    onClose();
  };

  const handleDateChange = (date: any) => {
    setSelectedDate(date);
  };

  const onHandleSubmit = () => {
    handleSubmit(onSubmit)();
  };
  return (
    <PopupLayout
      isRTL={isRTL}
      open={open}
      onClose={closeModal}
      title={words.payments}
      onSubmit={onHandleSubmit}
      theme={theme}
      saving={saving}
      alrt={alrt}
      print={!isNew ? handleReactPrint : undefined}
      mt={10}
    >
      <Grid container spacing={2}>
        <Grid item xs={1}></Grid>
        <Grid item xs={10}>
          <Grid container spacing={1}>
            <Grid item xs={5}>
              <CalenderLocal
                isRTL={isRTL}
                label={words.time}
                value={selectedDate}
                onChange={handleDateChange}
              ></CalenderLocal>
            </Grid>
            <Grid item xs={7}>
              <Box style={{ marginTop: 20 }}>
                <SelectLocal
                  options={payTypes}
                  value={ptype}
                  onChange={(e: any) => {
                    setPtype(e.target.value);
                    setEmplvalue(null);
                    setSuppvalue(null);
                  }}
                  isRTL={isRTL}
                  width={230}
                ></SelectLocal>
              </Box>
            </Grid>
            {ptype === 1 && (
              <Grid item xs={12}>
                <AutoFieldLocal
                  name="supplier"
                  title={words?.supplier}
                  words={words}
                  options={suppliers}
                  value={suppvalue}
                  setSelectValue={setSuppvalue}
                  setSelectError={setSuppError}
                  selectError={suppError}
                  isRTL={isRTL}
                  fullwidth
                  openAdd={openSupplier}
                  disabled={name === 'supplierId'}
                  mb={0}
                ></AutoFieldLocal>
              </Grid>
            )}
            {ptype === 2 && (
              <Grid item xs={12}>
                <AutoFieldLocal
                  name="employee"
                  title={tempwords?.employee}
                  words={words}
                  options={employees}
                  value={emplvalue}
                  setSelectValue={setEmplvalue}
                  setSelectError={setEmplError}
                  selectError={emplError}
                  isRTL={isRTL}
                  fullwidth
                  openAdd={openEmployee}
                  disabled={name === 'emploueeId' || name === 'contractId'}
                  mb={0}
                ></AutoFieldLocal>
              </Grid>
            )}
            {ptype === 1 && (
              <Grid item xs={6}>
                <AutoFieldLocal
                  name="invoice"
                  title={isRTL ? 'الفواتير' : 'Invoices'}
                  words={words}
                  options={invoices}
                  value={invoicevalue}
                  setSelectValue={setInvoicevalue}
                  register={register}
                  isRTL={isRTL}
                  disabled={!suppvalue}
                  fullWidth
                  mb={0}
                ></AutoFieldLocal>
              </Grid>
            )}
            <Grid item xs={6}>
              <TextFieldLocal
                required
                name="amount"
                label={words.amount}
                register={register}
                errors={errors}
                row={row}
                type="number"
                fullWidth
                mb={0}
              />
            </Grid>

            <Grid item xs={12}>
              <AutoFieldLocal
                name="creditAcc"
                title={isRTL ? 'حساب الدفع' : 'Payment Acc'}
                words={words}
                options={credaccounts}
                value={creditAcc}
                setSelectValue={setCreditAcc}
                register={register}
                isRTL={isRTL}
                fullwidth
                mb={0}
              ></AutoFieldLocal>
            </Grid>
            {ptype === 1 && (
              <Grid item xs={4}>
                <TextFieldLocal
                  name="chequeBank"
                  label={words.chequeBank}
                  register={register}
                  errors={errors}
                  row={row}
                  fullWidth
                  mb={0}
                />
              </Grid>
            )}
            {ptype === 1 && (
              <Grid item xs={4}>
                <TextFieldLocal
                  name="chequeNo"
                  label={words.chequeNo}
                  register={register}
                  errors={errors}
                  row={row}
                  fullWidth
                  mb={0}
                />
              </Grid>
            )}
            {ptype === 1 && (
              <Grid item xs={4}>
                <TextFieldLocal
                  name="chequeDate"
                  label={words.chequeDate}
                  register={register}
                  errors={errors}
                  row={row}
                  fullWidth
                  mb={0}
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <TextFieldLocal
                name="desc"
                rows={4}
                label={words.for}
                register={register}
                errors={errors}
                row={row}
                multiline
                fullWidth
                mb={0}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={1}></Grid>
        <PopupSupplier
          newtext={newtext}
          open={openCust}
          onClose={onCloseSupplier}
          isNew={true}
          setNewValue={onNewSuppChange}
          row={null}
          addAction={addSupplier}
          editAction={editSupplier}
        ></PopupSupplier>
        <PopupEmployee
          newtext={newtext}
          open={openEmp}
          onClose={onCloseEmploee}
          isNew={true}
          setNewValue={onNewEmplChange}
          row={null}
          addAction={addEmployee}
          editAction={editEmployee}
        ></PopupEmployee>
        <Box>
          <div style={{ display: 'none' }}>
            <ReceiptPrint
              company={company}
              user={user}
              printData={printData}
              ref={componentRef}
            />
          </div>
        </Box>
      </Grid>
    </PopupLayout>
  );
};

export default PopupPayment;
