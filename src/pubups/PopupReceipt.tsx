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
import { useCustomers, useTemplate } from '../hooks';
import { useLazyQuery } from '@apollo/client';
import getInvoicesList from '../graphql/query/getInvoicesList';
import PopupCustomer from './PopupCustomer';
import { ReceiptPrint } from '../print';
import { successAlert } from '../Shared/helpers';
const PopupReceipt = ({
  open,
  onClose,
  row,
  task,
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
  const [debaccounts, setDebaccounts] = React.useState([]);

  const [debitAcc, setDebitAcc]: any = React.useState(null);
  const [creditAcc, setCreditAcc]: any = React.useState(null);

  const [custvalue, setCustvalue] = useState<any>(
    name === 'customerId' ? value : null
  );
  const [custError, setCustError] = useState<any>(false);

  const [invoices, setInvoices] = useState<any>([]);
  const [invoicevalue, setInvoicevalue] = useState<any>(null);

  const [newtext, setNewtext] = useState('');
  const [openCust, setOpenCust] = useState(false);

  const { register, handleSubmit, errors, reset } = useForm(
    yup.depositResolver
  );
  const {
    translate: { words, isRTL },
    store: { user },
  }: GContextTypes = useContext(GlobalContext);

  const { accounts } = useAccounts();
  const { customers, addCustomer, editCustomer } = useCustomers();
  const { tempwords } = useTemplate();

  const [loadInvoices, invoicesData]: any = useLazyQuery(getInvoicesList, {
    fetchPolicy: 'cache-and-network',
  });

  const openCustomer = () => {
    setOpenCust(true);
  };
  const onCloseCustomer = () => {
    setOpenCust(false);
    setNewtext('');
  };
  const onNewCustChange = (nextValue: any) => {
    setCustvalue(nextValue);
  };

  useEffect(() => {
    if (custvalue) {
      const variables = { customerId: custvalue._id };
      loadInvoices({ variables });
    }
    if (isNew) {
      if (name === 'contractId') {
        if (value?.customerId) {
          const dept = customers.filter(
            (dep: any) => dep._id === value?.customerId
          )?.[0];
          setCustvalue(dept);
        }
      }
    }
  }, [custvalue, open]);

  useEffect(() => {
    if (name && value) {
      if (name === 'customerId') {
        setCustvalue(value);
      }
    }
  }, [name, value, open]);

  useEffect(() => {
    if (invoicesData?.data?.getInvoicesList?.data) {
      const { data } = invoicesData.data.getInvoicesList;
      if (data?.length > 0) {
        const ndata = data.map((d: any) => {
          const ramount = d.amount - d.discount;
          const title = `${d.docNo} - ${ramount}QR`;
          return {
            ...d,
            name: title,
            nameAr: title,
          };
        });
        if (task) {
          const tndata = ndata.filter((nd: any) => nd.contractId === task._id);
          setInvoices(tndata);
        } else {
          setInvoices(ndata);
        }
        if (row?.refNo) {
          const inv = ndata.filter((ts: any) => ts.docNo === row?.refNo)?.[0];
          setInvoicevalue(inv);
        }
      }
    } else {
      setInvoices([]);
      setInvoicevalue(null);
    }
  }, [invoicesData]);

  useEffect(() => {
    if (row && row._id) {
      const ca = row.creditAcc;
      const da = row.debitAcc;

      const filteredcredit = accounts.filter(
        (acc: any) => acc.parentcode === parents.CASH
      );
      setDebaccounts(filteredcredit);

      if (ca) {
        const credit = accounts.filter((acc: any) => acc.code === ca)[0];
        setCreditAcc(credit);
      }
      if (da) {
        const debit = accounts.filter((acc: any) => acc.code === da)[0];
        setDebitAcc(debit);
      }
      const customerId = row?.customerId;
      if (customerId) {
        const cust = customers.filter((it: any) => it._id === customerId)[0];
        setCustvalue(cust);
      }
      handleDateChange(row.time);
    } else {
      const filtereddebits = accounts.filter(
        (acc: any) => acc.parentcode === parents.ACCOUNTS_RECEIVABLE
      );
      const filteredcredit = accounts.filter(
        (acc: any) => acc.parentcode === parents.CASH
      );
      setDebaccounts(filteredcredit);
      setDebitAcc(filteredcredit?.[0]);
      setCreditAcc(filtereddebits?.[0]);
    }
  }, [row, open]);
  const componentRef: any = useRef();
  const handleReactPrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Invoice #${row?.docNo}`,
    removeAfterPrint: true,
  });
  const printData = {
    no: row?.docNo,
    time: selectedDate,
    customerName: custvalue?.name,
    customerNameAr: custvalue?.nameAr,
    customerPhone: custvalue?.phone,
    refNo: row?.refNo,
    title: row?.title,
    desc: row?.desc,
    amount: row?.amount,
    isRTL: isRTL,
    chequeBank: row?.chequeBank,
    chequeNo: row?.chequeNo,
    chequeDate: row?.chequeDate,
    invoice: invoicevalue,
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
    if (!debitAcc) {
      await messageAlert(
        setAlrt,
        isRTL ? 'يجب تحديد الحساب' : 'You have to select Account'
      );
      return;
    }

    if (!custvalue) {
      await messageAlert(
        setAlrt,
        isRTL ? 'يجب تحديد العميل' : 'You have to select Customer'
      );
      return;
    }
    setSaving(true);
    const customer = custvalue
      ? {
          customerId: custvalue._id,
          customerName: custvalue.name,
          customerNameAr: custvalue.nameAr,
          customerPhone: custvalue.color,
        }
      : {
          customerId: undefined,
          customerName: undefined,
          customerNameAr: undefined,
          customerPhone: undefined,
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
    const employee = invoicevalue
      ? {
          employeeId: invoicevalue.employeeId,
          employeeName: invoicevalue.employeeName,
          employeeNameAr: invoicevalue.employeeNameAr,
          employeeColor: invoicevalue.employeeColor,
        }
      : {
          employeeId: undefined,
          employeeName: undefined,
          employeeNameAr: undefined,
          employeeColor: undefined,
        };
    const contract = invoicevalue
      ? {
          contractId: invoicevalue.contractId,
          contractName: invoicevalue.contractName,
          contractNameAr: invoicevalue.contractNameAr,
          contractColor: invoicevalue.contractColor,
        }
      : {
          contractId: undefined,
          contractName: undefined,
          contractNameAr: undefined,
          contractColor: undefined,
        };

    const project = invoicevalue
      ? {
          projectId: invoicevalue.projectId,
          projectName: invoicevalue.projectName,
          projectNameAr: invoicevalue.projectNameAr,
        }
      : {
          projectId: undefined,
          projectName: undefined,
          projectNameAr: undefined,
        };

    const variables: any = {
      _id: row && row._id ? row._id : undefined, // is it new or edit
      opType: operationTypes.customerReceipt,
      time: selectedDate,
      debitAcc: debitAcc.code,
      creditAcc: creditAcc.code,
      refNo: invoicevalue ? invoicevalue.docNo : undefined,
      customer,
      department,
      employee,
      project,
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
      await mutate({ variables });
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
    setCreditAcc(null);
    setDebitAcc(null);
    setDebaccounts([]);
    setInvoices([]);
    setCustvalue(name === 'customerId' ? value : null);
    setInvoicevalue(null);
    setCustError(false);
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
      title={words.receipts}
      onSubmit={onHandleSubmit}
      saving={saving}
      theme={theme}
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
            <Grid item xs={12}>
              <AutoFieldLocal
                name="customer"
                title={tempwords?.customer}
                words={words}
                options={customers}
                value={custvalue}
                setSelectValue={(value: any) => {
                  setCustvalue(value);
                  setInvoicevalue(null);
                }}
                setSelectError={setCustError}
                selectError={custError}
                isRTL={isRTL}
                fullwidth
                openAdd={openCustomer}
                disabled={name === 'customerId' || name === 'contractId'}
                mb={0}
              ></AutoFieldLocal>
            </Grid>

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
                disabled={!custvalue}
                fullWidth
                mb={0}
              ></AutoFieldLocal>
            </Grid>
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
                name="debitAcc"
                title={isRTL ? 'حساب القبض' : 'Receipt Acc'}
                words={words}
                options={debaccounts}
                value={debitAcc}
                setSelectValue={setDebitAcc}
                register={register}
                isRTL={isRTL}
                fullwidth
                mb={0}
              ></AutoFieldLocal>
            </Grid>
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
        <PopupCustomer
          newtext={newtext}
          open={openCust}
          onClose={onCloseCustomer}
          isNew={true}
          setNewValue={onNewCustChange}
          row={null}
          addAction={addCustomer}
          editAction={editCustomer}
        ></PopupCustomer>

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

export default PopupReceipt;
