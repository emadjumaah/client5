/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useContext, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { invoiceClasses } from "../themes";
import { useCustomers, useLastNos } from "../hooks";
import { dublicateAlert, errorAlert, messageAlert } from "../Shared";
import { GContextTypes } from "../types";
import { GlobalContext } from "../contexts";
import {
  Box,
  colors,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@material-ui/core";
import ServiceItemForm from "../Shared/ServiceItemForm";
import ItemsTable from "../Shared/ItemsTable";
import { PriceTotal } from "../Shared/TotalPrice";
import { operationTypes } from "../constants";
import { accountCode } from "../constants/kaid";
import PaymentSelect from "../pages/options/PaymentSelect";
import PopupCustomer from "./PopupCustomer";
import { useLazyQuery } from "@apollo/client";
import { getOperationItems } from "../graphql";
import LoadingInline from "../Shared/LoadingInline";
import PopupLayout from "../pages/main/PopupLayout";
import { Grid } from "@material-ui/core";
import AutoFieldLocal from "../components/fields/AutoFieldLocal";
import { getAppStartEndPeriod } from "../common/time";
import { CalenderLocal } from "../components";
import { useReactToPrint } from "react-to-print";
import { InvoicePrintA5 } from "../common/InvoicePrintA5";
import { weekdaysNNo } from "../constants/datatypes";
import useTasks from "../hooks/useTasks";
import useCompany from "../hooks/useCompany";

export const indexTheList = (list: any) => {
  return list.map((item: any, index: any) => {
    return {
      ...item,
      index,
    };
  });
};

const PopupInvoice = ({
  open,
  onClose,
  row,
  isNew,
  addAction,
  editAction,
  employees,
  departments,
  servicesproducts,
  theme,
  task,
  value,
  name,
}: any) => {
  const classes = invoiceClasses();
  const [loading, setLoading] = useState(false);
  const { tasks } = useTasks();
  const [alrt, setAlrt] = useState({ show: false, msg: "", type: undefined });
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [invNo, setInvNo] = useState<any>("");

  const [itemsList, setItemsList] = useState<any>([]);
  const [accounts, setAccounts] = useState<any>([]);
  const [ptype, setPtype] = useState<any>("");

  const [discount, setDiscount] = useState(0);
  const [totals, setTotals] = useState<any>({});

  const { company } = useCompany();

  const [departvalue, setDepartvalue] = useState<any>(
    name === "departmentId" ? value : null
  );
  const [departError, setDepartError] = useState<any>(false);
  const departRef: any = React.useRef();

  const [emplvalue, setEmplvalue] = useState<any>(
    name === "employeeId" ? value : null
  );
  const [emplError, setEmplError] = useState<any>(false);
  const emplRef: any = React.useRef();

  const [custvalue, setCustvalue] = useState<any>(
    name === "customerId" ? value : null
  );
  const [taskvalue, setTaskvalue] = useState<any>(
    name === "taskId" ? value : null
  );

  const [openCust, setOpenCust] = useState(false);
  const [newtext, setNewtext] = useState("");

  const [isCash, setIsCash] = useState(false);
  const [resKind, setResKind] = useState<any>(null);
  const [emplslist, setEmplslist] = useState<any>([]);

  const [getItems, itemsData]: any = useLazyQuery(getOperationItems, {
    fetchPolicy: "cache-and-network",
  });

  const { lastNos, freshlastNos } = useLastNos();
  const { customers, addCustomer, editCustomer } = useCustomers();

  useEffect(() => {
    if (employees && employees.length > 0) {
      const filtered = employees.filter(
        (emp: any) => emp.resKind === resKind && emp.resType === 1
      );
      setEmplslist(filtered);
    }
  }, [resKind, employees]);

  useEffect(() => {
    if (isNew) {
      if (taskvalue) {
        if (taskvalue?.departmentId && name !== "departmentId") {
          const dept = departments.filter(
            (dep: any) => dep._id === taskvalue?.departmentId
          )?.[0];
          setDepartvalue(dept);
        }
        if (taskvalue?.employeeId && name !== "employeeId") {
          const dept = employees.filter(
            (dep: any) => dep._id === taskvalue?.employeeId
          )?.[0];
          setEmplvalue(dept);
        }
      }
    }
  }, [taskvalue]);

  useEffect(() => {
    if (isNew) {
      if (emplvalue) {
        if (emplvalue?.departmentId && name !== "departmentId") {
          const dept = departments.filter(
            (dep: any) => dep._id === emplvalue?.departmentId
          )?.[0];
          setDepartvalue(dept);
        }
      }
    }
  }, [emplvalue]);

  useEffect(() => {
    const items = itemsData?.data?.["getOperationItems"]?.data || [];
    if (items && items.length > 0) {
      const ids = items.map((it: any) => it.itemId);
      const servlist = servicesproducts.filter((ser: any) =>
        ids.includes(ser._id)
      );

      const itemsWqtyprice = items.map((item: any, index: any) => {
        const {
          categoryId,
          categoryName,
          categoryNameAr,
          departmentId,
          departmentName,
          departmentNameAr,
          departmentColor,
          employeeId,
          employeeName,
          employeeNameAr,
          employeeColor,
        } = item;
        const serv = servlist.filter((se: any) => se._id === item.itemId)[0];
        return {
          ...serv,
          categoryId,
          categoryName,
          categoryNameAr,
          departmentId,
          departmentName,
          departmentNameAr,
          departmentColor,
          employeeId,
          employeeName,
          employeeNameAr,
          employeeColor,
          index,
          itemprice: item.itemPrice,
          itemqty: item.qty,
          itemtotal: item.total,
        };
      });
      itemsWqtyprice.sort((a: any, b: any) =>
        a.indx > b.indx ? 1 : b.indx > a.indx ? -1 : 0
      );
      setItemsList(itemsWqtyprice);
      setLoading(false);
    }
  }, [itemsData]);

  const { handleSubmit, reset } = useForm({});
  const {
    translate: { words, isRTL },
    store: { user },
  }: GContextTypes = useContext(GlobalContext);

  const openCustomer = () => {
    setOpenCust(true);
  };
  const onCloseCustomer = () => {
    setOpenCust(false);
    setNewtext("");
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
    setTaskvalue(null);
    setIsCash(false);
    setSelectedDate(new Date());
    setDepartvalue(null);
    setEmplvalue(null);
    setResKind(null);
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
    if (isNew) {
      if (name === "taskId") {
        if (value?.departmentId) {
          const dept = departments.filter(
            (dep: any) => dep._id === value?.departmentId
          )?.[0];
          setDepartvalue(dept);
        }
        if (value?.employeeId) {
          const dept = employees.filter(
            (dep: any) => dep._id === value?.employeeId
          )?.[0];
          setEmplvalue(dept);
        }
        if (value?.customerId) {
          const dept = customers.filter(
            (dep: any) => dep._id === value?.customerId
          )?.[0];
          setCustvalue(dept);
        }
      }
    }
  }, [open]);

  useEffect(() => {
    getOverallTotal();
  }, [itemsList, discount, ptype, isCash]);

  useEffect(() => {
    if (row && row._id) {
      setLoading(true);
      const variables = { opId: row._id };
      getItems({
        variables,
      });
      const _id = row.customerId;
      const cust = customers.filter((it: any) => it._id === _id)[0];

      const depId = row.departmentId;
      const empId = row.employeeId;
      if (depId) {
        const depart = departments.filter((dep: any) => dep._id === depId)[0];
        setDepartvalue(depart);
      }
      if (empId) {
        const empl = employees.filter((emp: any) => emp._id === empId)[0];
        setEmplvalue(empl);
      }

      if (!task && row.taskId) {
        const tsk = tasks.filter((ts: any) => ts.id === row.taskId)[0];
        setTaskvalue(tsk);
      }
      setCustvalue(cust);
      setIsCash(row.isCash);
      setDiscount(row.discount);
      setInvNo(row.docNo);
      handleDateChange(row.time);
      setPtype(row.paymentType ? row.paymentType : "");
    }
  }, [row]);

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
    const { startPeriod, endPeriod } = getAppStartEndPeriod();
    if (selectedDate < startPeriod || selectedDate > endPeriod) {
      await messageAlert(
        setAlrt,
        isRTL ? "يجب تعديل التاريخ" : "Date should be change"
      );
      return;
    }
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
          ? `رقم الفاتورة يجب ان يكون أكبب من ${lastNos.salesInvoice}`
          : `Invoice no must be more than ${lastNos.salesInvoice}`
      );

      return;
    }
    if (!itemsList || itemsList.length === 0) {
      await messageAlert(
        setAlrt,
        isRTL
          ? `يجب اضافة عنصر (خدمة او منتج) واحد للفاتورة على الأقل`
          : `You should add min one service to invoice`
      );
      return;
    }
    const { amount, costAmount, profit, total } = totals;
    const variables: any = {
      _id: row && row._id ? row._id : undefined, // is it new or edit
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
      taskId: taskvalue ? taskvalue.id : undefined,
      userId: user._id,
    };
    const mutate = isNew ? addAction : editAction;

    apply(mutate, variables);
  };

  const apply = async (mutate: any, variables: any) => {
    try {
      mutate({ variables });
      if (row && row._id) {
        itemsData?.refetch();
      }
      // handlePrint();
      freshlastNos({});
      onCloseForm();
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
      console.log(error);
    }
  };

  const onNewFieldChange = (nextValue: any) => {
    setCustvalue(nextValue);
  };

  const onCloseForm = () => {
    resetAllForms();
    onClose();
  };

  const onHandleSubmit = () => {
    handleReactPrint();
    handleSubmit(onSubmit)();
  };

  const componentRef: any = useRef();
  const handleReactPrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Invoice #${row?.invoiceNo}`,
    removeAfterPrint: true,
  });
  const printData = {
    invoiceNo: row?.invoiceNo,
    time: selectedDate,
    customerName: custvalue?.name,
    customerPhone: custvalue?.phone,
    total: totals.total,
    amount: totals.amount,
    items: itemsList,
  };
  const date = row?.startDate ? new Date(row?.startDate) : new Date();
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
            disabled={name === "customerId"}
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
            disabled={name === "taskId"}
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
          <Box style={{ marginRight: 10, marginTop: 0, marginBottom: 0 }}>
            <RadioGroup
              aria-label="Views"
              name="views"
              row
              value={resKind}
              onChange={(e: any) => {
                setResKind(Number(e.target.value));
                setEmplvalue(null);
              }}
            >
              <FormControlLabel
                value={1}
                control={
                  <Radio style={{ padding: 0, margin: 0 }} color="primary" />
                }
                label={isRTL ? "الموظف" : "Employee"}
              />

              <FormControlLabel
                value={2}
                control={
                  <Radio style={{ padding: 0, margin: 0 }} color="primary" />
                }
                label={isRTL ? "المورد" : "Resourse"}
              />
            </RadioGroup>
          </Box>
        </Grid>
        <Grid item xs={6}></Grid>
        <Grid item xs={6}>
          <AutoFieldLocal
            name="employee"
            title={words.employee}
            words={words}
            options={emplslist}
            disabled={!resKind || name === "employeeId"}
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
            options={departments.filter((dep: any) => dep.depType === 1)}
            value={departvalue}
            setSelectValue={setDepartvalue}
            setSelectError={setDepartError}
            selectError={departError}
            refernce={departRef}
            noPlus
            isRTL={isRTL}
            width={420}
            disabled={name === "departmentId"}
          ></AutoFieldLocal>
        </Grid>

        <Grid item xs={12}>
          <Box
            style={{
              backgroundColor: "#f3f3f3",
              padding: 10,
              marginTop: 15,
              marginBottom: 15,
              borderRadius: 10,
            }}
          >
            <Box display="flex" style={{ paddingLeft: 10, paddingRight: 10 }}>
              <ServiceItemForm
                options={servicesproducts}
                addItem={addItemToList}
                words={words}
                employees={employees}
                departments={departments}
                classes={classes}
                user={user}
                isRTL={isRTL}
              ></ServiceItemForm>
            </Box>
            {!loading && (
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
            )}
            {loading && <LoadingInline></LoadingInline>}
          </Box>
          <Box
            display="flex"
            style={{
              alignItems: "center",
              justifyContent: "space-between",
              marginRight: 10,
              marginLeft: 10,
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

export default PopupInvoice;