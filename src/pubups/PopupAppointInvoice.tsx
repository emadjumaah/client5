/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useContext, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { invoiceClasses } from "../themes";
import {
  useCustomers,
  useDepartments,
  useEmployees,
  useLastNos,
} from "../hooks";
import { dublicateAlert, errorAlert, messageAlert } from "../Shared";
import { GContextTypes } from "../types";
import { GlobalContext } from "../contexts";

import { Box, colors, TextField, Typography } from "@material-ui/core";
import ServiceItemForm from "../Shared/ServiceItemForm";
import ItemsTable from "../Shared/ItemsTable";
import { PriceTotal } from "../Shared/TotalPrice";
import { operationTypes } from "../constants";
import { useMutation } from "@apollo/client";
import {
  createInvoice,
  getCustomers,
  getDepartments,
  getEmployees,
  getInvoices,
  getLandingChartData,
  getLastNos,
} from "../graphql";
import { accountCode } from "../constants/kaid";
import PaymentSelect from "../pages/options/PaymentSelect";
import PopupLayout from "../pages/main/PopupLayout";
import { Grid } from "@material-ui/core";
import AutoFieldLocal from "../components/fields/AutoFieldLocal";
import { CalenderLocal } from "../components";
import PopupCustomer from "./PopupCustomer";
import { weekdaysNNo } from "../constants/datatypes";
import getTasks from "../graphql/query/getTasks";
import useTasks from "../hooks/useTasks";
import { InvoicePrintA5 } from "../common/InvoicePrintA5";
import { useReactToPrint } from "react-to-print";
import useCompany from "../hooks/useCompany";

export const indexTheList = (list: any) => {
  return list.map((item: any, index: any) => {
    return {
      ...item,
      index,
    };
  });
};

const PopupAppointInvoice = ({
  open,
  onClose,
  appoint,
  services,
  editEvent,
  isNew = true,
  theme,
  items,
  onCloseAppoint = () => null,
}: any) => {
  const classes = invoiceClasses();
  const [alrt, setAlrt] = useState({ show: false, msg: "", type: undefined });
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [invNo, setInvNo] = useState<any>("");

  const [itemsList, setItemsList] = useState<any>([]);
  const [accounts, setAccounts] = useState<any>([]);
  const [ptype, setPtype] = useState<any>("cash");

  const [discount, setDiscount] = useState(0);
  const [totals, setTotals] = useState<any>({});

  const [custvalue, setCustvalue] = useState<any>(null);

  const [departvalue, setDepartvalue] = useState<any>(null);
  const [departError, setDepartError] = useState<any>(false);
  const departRef: any = React.useRef();

  const [emplvalue, setEmplvalue] = useState<any>(null);
  const [emplError, setEmplError] = useState<any>(false);
  const emplRef: any = React.useRef();

  const [taskvalue, setTaskvalue] = useState<any>(null);

  const [openCust, setOpenCust] = useState(false);
  const [newtext, setNewtext] = useState("");

  const [isCash, setIsCash] = useState(false);
  const { customers, addCustomer, editCustomer } = useCustomers();
  const { tasks } = useTasks();
  const { employees } = useEmployees();
  const { departments } = useDepartments();
  const { company } = useCompany();

  const { handleSubmit, reset } = useForm({});
  const {
    translate: { words, isRTL },
    store: { user },
  }: GContextTypes = useContext(GlobalContext);

  const refresQuery = {
    refetchQueries: [
      {
        query: getInvoices,
        variables: {
          start: new Date().setHours(0, 0, 0, 0),
          end: new Date().setHours(23, 59, 59, 999),
        },
      },
      {
        query: getLastNos,
      },
      {
        query: getLandingChartData,
      },
      {
        query: getTasks,
      },
      {
        query: getCustomers,
      },
      {
        query: getEmployees,
      },
      {
        query: getDepartments,
      },
    ],
  };

  const [addInvoice] = useMutation(createInvoice, refresQuery);

  const { lastNos, freshlastNos } = useLastNos();

  const openCustomer = () => {
    setOpenCust(true);
  };
  const onCloseCustomer = () => {
    setOpenCust(false);
    setNewtext("");
  };
  const onNewFieldChange = (nextValue: any) => {
    setCustvalue(nextValue);
  };

  const resetAllForms = () => {
    reset();
    setItemsList([]);
    setDiscount(0);
    setTotals({});
    setCustvalue(null);
    setInvNo("");
    setAccounts([]);
    setPtype("");
    setIsCash(false);
    setSelectedDate(new Date());
    setDepartvalue(null);
    setEmplvalue(null);
  };

  const addItemToList = (item: any) => {
    const newArray = [...itemsList, { ...item, userId: user._id }];
    const listwithindex = indexTheList(newArray);
    setItemsList(listwithindex);
  };
  const editItemInList = (item: any) => {
    const newArray = itemsList.map((it: any) => {
      if (it._id === item._id) {
        return item;
      } else {
        return it;
      }
    });
    const listwithindex = indexTheList(newArray);
    setItemsList(listwithindex);
  };

  const removeItemFromList = (index: any) => {
    const newList = [...itemsList];
    newList.splice(index, 1);
    const listwithindex = indexTheList(newList);
    setItemsList(listwithindex);
  };

  const handleDateChange = (date: any) => {
    setSelectedDate(date);
  };

  useEffect(() => {
    if (isNew && lastNos) {
      setInvNo(lastNos?.salesInvoice ? Number(lastNos?.salesInvoice) + 1 : 1);
    }
  }, [open]);

  useEffect(() => {
    getOverallTotal();
  }, [itemsList, discount, ptype, isCash]);

  useEffect(() => {
    if (appoint && appoint.startDate) {
      const _id = appoint.customerId;
      const cust = customers.filter((it: any) => it._id === _id)[0];
      setCustvalue(cust);
    }
    const depId = appoint.departmentId;
    const empId = appoint.employeeId;
    if (depId) {
      const depart = departments.filter((dep: any) => dep._id === depId)[0];
      setDepartvalue(depart);
    }
    if (empId) {
      const empl = employees.filter((emp: any) => emp._id === empId)[0];
      setEmplvalue(empl);
    }
    if (appoint.taskId) {
      const empl = tasks.filter((emp: any) => emp.id === appoint.taskId)[0];
      setTaskvalue(empl);
    }
    if (items) {
      setItemsList(items);
    }
  }, [appoint, services, customers, items]);

  const getOverallTotal = () => {
    const totalsin = itemsList.map((litem: any) => litem.itemtotal);
    const sum = totalsin.reduce((psum: any, a: any) => psum + a, 0);
    const costtotals = itemsList.map((litem: any) => litem.itemtotalcost);
    const costsum = costtotals.reduce((psum: any, a: any) => psum + a, 0);
    const amount = sum - discount;
    const profit = sum - discount - costsum;
    const tots = {
      itemsSum: amount,
      itemsCostSum: costsum,
      costAmount: costsum,
      total: sum,
      amount,
      profit,
    };
    setTotals(tots);
    const accs = [
      {
        debitAcc: accountCode.accounts_receivable,
        creditAcc: accountCode.sales_income,
        amount: sum,
        type: operationTypes.salesInvoice,
      },
      {
        debitAcc: accountCode.sales_income,
        creditAcc: accountCode.accounts_receivable,
        amount: discount,
        type: operationTypes.customerDiscount,
      },
      {
        debitAcc:
          ptype === "cash" ? accountCode.cash_on_hand : accountCode.card,
        creditAcc: accountCode.accounts_receivable,
        amount: isCash ? sum - discount : 0,
        type: operationTypes.customerReceipt,
      },
    ];
    setAccounts(accs);
  };

  const onSubmit = async () => {
    // const { startPeriod, endPeriod } = getAppStartEndPeriod();
    // if (selectedDate < startPeriod || selectedDate > endPeriod) {
    //   await messageAlert(
    //     setAlrt,
    //     isRTL ? "يجب تعديل التاريخ" : "Date should be change"
    //   );
    //   return;
    // }
    if (discount < 0) {
      await messageAlert(
        setAlrt,
        isRTL ? "الحسم لا يمكن ان يكون سلبي" : "Discount can't be minus"
      );
      return;
    }
    if (discount > totals?.total) {
      await messageAlert(
        setAlrt,
        isRTL
          ? "الحسم لا يمكن ان يكون اكبر من قيمة الفاتورة"
          : "Discount can't be biger than Total"
      );
      return;
    }
    if (!custvalue) {
      await messageAlert(
        setAlrt,
        isRTL ? "يرجى اضافة عميل للفاتورة" : "Please add Customer"
      );
      return;
    }
    if (isNew && Number(invNo) <= Number(lastNos.salesInvoice)) {
      await messageAlert(
        setAlrt,
        isRTL
          ? `Invoice no must be more than ${lastNos.salesInvoice}`
          : `رقم الفاتورة يجب ان يكون أكبب من ${lastNos.salesInvoice}`
      );
      return;
    }
    if (!itemsList || itemsList.length === 0) {
      await messageAlert(
        setAlrt,
        isRTL
          ? `رقم الفاتورة يجب ان يكون أكبب من ${lastNos.salesInvoice}`
          : `Invoice no must be more than ${lastNos.salesInvoice}`
      );
      return;
    }
    const { amount, costAmount, profit, total } = totals;

    const variables: any = {
      docNo: invNo ? invNo.toString() : undefined,
      time: selectedDate,
      customer: {
        customerId: custvalue._id,
        customerName: custvalue.name,
        customerNameAr: custvalue.nameAr,
        customerPhone: custvalue.phone,
      },
      department: departvalue
        ? {
            departmentId: departvalue._id,
            departmentName: departvalue.name,
            departmentNameAr: departvalue.nameAr,
            departmentColor: departvalue.color,
          }
        : {
            departmentId: undefined,
            departmentName: undefined,
            departmentNameAr: undefined,
            departmentColor: undefined,
          },
      employee: emplvalue
        ? {
            employeeId: emplvalue._id,
            employeeName: emplvalue.name,
            employeeNameAr: emplvalue.nameAr,
            employeeColor: emplvalue.color,
            employeePhone: emplvalue.phone,
          }
        : {
            employeeId: undefined,
            employeeName: undefined,
            employeeNameAr: undefined,
            employeeColor: undefined,
            employeePhone: undefined,
          },
      items: JSON.stringify(itemsList),
      costAmount,
      total,
      discount,
      amount,
      profit,
      isPaid: isCash,
      isCash,
      amountPaid: isCash ? amount : 0,
      accounts,
      paymentType: ptype,
      userId: user._id,
      eventId: appoint.id,
      taskId: taskvalue ? taskvalue.id : undefined,
      eventNo: appoint.docNo,
    };

    apply(addInvoice, variables);
  };

  const apply = async (mutate: any, variables: any) => {
    try {
      mutate({ variables });
      editEvent({ variables: { id: appoint.id, status: 10 } });
      freshlastNos();
      onCloseForm();
      onCloseAppoint();
    } catch (error) {
      onError(error);
      console.log(error);
    }
  };

  const onError = async (error: any) => {
    if (error.message.includes("duplicate")) {
      await dublicateAlert(setAlrt, isRTL);
    } else {
      await errorAlert(setAlrt, isRTL);
      reset();
      console.log(error);
    }
  };

  const onCloseForm = () => {
    resetAllForms();
    onClose();
  };

  const onHandleSubmit = () => {
    handleSubmit(onSubmit)();
  };

  const componentRef: any = useRef();
  const handleReactPrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Invoice #${invNo}`,
    removeAfterPrint: true,
  });
  const printData = {
    invoiceNo: invNo,
    time: selectedDate,
    customerName: custvalue?.name,
    customerPhone: custvalue?.phone,
    total: totals.total,
    amount: totals.amount,
    items: itemsList,
  };

  const date = appoint?.startDate ? new Date(appoint?.startDate) : new Date();
  const day = weekdaysNNo?.[date.getDay()];

  const title = isRTL
    ? isNew
      ? "فاتورة جديدة"
      : "تعديل فاتورة"
    : isNew
    ? "New Invoice"
    : "Edit Invoice";

  return (
    <PopupLayout
      isRTL={isRTL}
      open={open}
      onClose={onCloseForm}
      title={title}
      onSubmit={onHandleSubmit}
      theme={theme}
      alrt={alrt}
      print={handleReactPrint}
      maxWidth="md"
      mt={0}
      mb={50}
      bgcolor={colors.green[500]}
    >
      <Grid container spacing={0}>
        <Grid item xs={4}>
          <CalenderLocal
            isRTL={isRTL}
            label={words.time}
            value={selectedDate}
            onChange={handleDateChange}
          ></CalenderLocal>
        </Grid>
        <Grid item xs={8}>
          <PaymentSelect
            words={words}
            ptype={ptype}
            isCash={isCash}
            setIsCash={setIsCash}
            setPtype={setPtype}
          ></PaymentSelect>
        </Grid>
        <Grid item xs={6}>
          <AutoFieldLocal
            name="customer"
            title={words.customer}
            words={words}
            options={customers}
            value={custvalue}
            setSelectValue={setCustvalue}
            isRTL={isRTL}
            fullWidth
            openAdd={openCustomer}
            showphone
          ></AutoFieldLocal>
        </Grid>
        <Grid item xs={4}>
          <AutoFieldLocal
            name="task"
            title={words.task}
            words={words}
            options={tasks}
            value={taskvalue}
            setSelectValue={setTaskvalue}
            isRTL={isRTL}
            fullWidth
          ></AutoFieldLocal>
        </Grid>
        <Grid item xs={2}>
          <Box
            display="flex"
            style={{
              flex: 1,
              flexDirection: isRTL ? "row-reverse" : "row",
              alignItems: "center",
              justifyContent: "flex-end",
              marginLeft: isRTL ? undefined : 20,
              marginRight: isRTL ? 20 : undefined,
            }}
          >
            {isNew && (
              <Typography style={{ color: "#777" }}>{words.no}</Typography>
            )}
            <TextField
              name="invNo"
              disabled={!isNew}
              value={invNo}
              onChange={(e: any) => setInvNo(Number(e.target.value))}
              variant="outlined"
              style={{ width: isNew ? 70 : 100, marginLeft: 20 }}
              margin="dense"
              // type="number"
              inputProps={{
                style: {
                  textAlign: "center",
                  fontSize: 14,
                  height: 13,
                },
              }}
            />
          </Box>
        </Grid>

        <Grid item xs={6}>
          <AutoFieldLocal
            name="employee"
            title={words.employee}
            words={words}
            options={employees.filter((em: any) => em.resType === 1)}
            value={emplvalue}
            setSelectValue={setEmplvalue}
            setSelectError={setEmplError}
            selectError={emplError}
            refernce={emplRef}
            noPlus
            isRTL={isRTL}
            fullWidth
            day={day}
          ></AutoFieldLocal>
        </Grid>
        <Grid item xs={6}>
          <AutoFieldLocal
            name="department"
            title={words.department}
            words={words}
            options={departments.filter((em: any) => em.depType === 1)}
            value={departvalue}
            setSelectValue={setDepartvalue}
            setSelectError={setDepartError}
            selectError={departError}
            refernce={departRef}
            noPlus
            isRTL={isRTL}
            width={420}
          ></AutoFieldLocal>
        </Grid>
        <Grid item xs={12}>
          <Box
            style={{
              backgroundColor: "#f4f4f4",
              padding: 10,
              marginTop: 15,
              marginBottom: 15,
              borderRadius: 10,
            }}
          >
            <Box display="flex">
              <ServiceItemForm
                options={services}
                addItem={addItemToList}
                words={words}
                employees={employees}
                departments={departments}
                classes={classes}
                user={user}
                isRTL={isRTL}
              ></ServiceItemForm>
            </Box>

            <Box style={{ marginBottom: 20 }}>
              <ItemsTable
                rows={itemsList}
                editItem={editItemInList}
                removeItem={removeItemFromList}
                isRTL={isRTL}
                words={words}
                user={user}
              ></ItemsTable>
            </Box>
          </Box>
          <Box
            display="flex"
            style={{
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <TextField
              name="discount"
              label={words.discount}
              value={discount.toString()}
              onChange={(e: any) => setDiscount(Number(e.target.value))}
              variant="outlined"
              style={{ width: 200 }}
              margin="dense"
              type="number"
              onFocus={(e) => e.target.select()}
            />

            <PriceTotal
              amount={totals?.amount}
              total={totals?.total}
              discount={discount}
              words={words}
            ></PriceTotal>
          </Box>
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
          <Box>
            <div style={{ display: "none" }}>
              <InvoicePrintA5
                company={company}
                printData={printData}
                ref={componentRef}
              />
            </div>
          </Box>
        </Grid>
      </Grid>
    </PopupLayout>
  );
};

export default PopupAppointInvoice;