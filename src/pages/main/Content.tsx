/* eslint-disable no-var */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useContext, useEffect, useReducer, useState } from "react";
import { fade, useTheme } from "@material-ui/core/styles";
import { Box, CssBaseline } from "@material-ui/core";
import { Route } from "react-router-dom";
import { AppDrawer } from "../../components";
import { mainmenu } from "../../constants";
import Landing from "./Landing";
import {
  EventsContext,
  eventsReducer,
  ExpensesContext,
  initExpensesContext,
  expensesReducer,
  ExpensesReportContext,
  initExpensesReportContext,
  expensesReportReducer,
  CustomerReportContext,
  initCustomerReportContext,
  customerReportReducer,
  FinanceContext,
  financeReducer,
  GlobalContext,
  initEventsContext,
  initFinanceContext,
  initPurchaseReportContext,
  initSalesContext,
  initSalesReportContext,
  PurchaseReportContext,
  purchaseReportReducer,
  SalesContext,
  salesReducer,
  SalesReportContext,
  salesReportReducer,
  receiptReducer,
  initReceiptContext,
  ReceiptContext,
} from "../../contexts";
import { layoutClasses } from "../../themes";
import MainCalendar from "../calendar/MainCalendar";
import Options from "../options";
import {
  Users,
  Departments,
  Employees,
  Customers,
  Services,
  Invoices,
  Accounts,
} from "../adds";
import { GContextTypes } from "../../types";
import Finance from "../adds/Finance";

import { useBranches, useServices, useSuppliers } from "../../hooks";
import { roles } from "../../common";
import useCompany from "../../hooks/useCompany";
import PageLayout from "./PageLayout";
import Appointments from "../adds/Appointments";
import { CalendarContext } from "../../contexts/calendar";
import { initCalendar, calendarReducer } from "../../contexts";
import SalesReport from "../reports/SalesReport";
import useAccounts from "../../hooks/useAccounts";
import FinanceReport from "../reports/FinanceReport";
import {
  eventsReportReducer,
  initEventsReportContext,
} from "../../contexts/eventsreport/salesReducer";
import EventsReport from "../reports/EventsReport";
import CustomerReport from "../reports/CustomerReport";
import EventsReportContext from "../../contexts/eventsreport";
import {
  calendarReportReducer,
  initCalendarReportContext,
} from "../../contexts/calendarReport/eventsReducer";
import CalendarReportContext from "../../contexts/calendarReport";
import Expenses from "../adds/Expenses";
import { filterMenu, getparentAccounts } from "../../common/helpers";
import PurchaseReport from "../reports/PurchaseReport";
import ExpensesReport from "../reports/ExpensesReport";
import Resourses from "../adds/Resourses";
import Receipt from "../adds/Receipt";
import FinanceAll from "../adds/FinanceAll";
import Tasks from "../adds/Tasks";
import {
  initTasksContext,
  tasksReducer,
} from "../../contexts/tasks/tasksReducer";
import TasksContext from "../../contexts/tasks";
import DocumentsReport from "../reports/DocumentsReport";
import {
  documentsReportReducer,
  initDocumentsReportContext,
} from "../../contexts/documentsReport/documentsReducer";
import DocumentsReportContext from "../../contexts/documentsReport";
import ServicesReportContext from "../../contexts/servicesReport";
import ServicesReport from "../reports/ServicesReport";
import {
  initServicesReportContext,
  servicesReportReducer,
} from "../../contexts/servicesReport/servicesReducer";
import ManageEmployees from "../adds/ManageEmployees";
import ManageDepartments from "../adds/ManageDepartments";
import EmployeesCalendar from "../calendar/EmployeesCalendar";
import ManageResourses from "../adds/ManageResourses";
import Branches from "../adds/Branches";
// import { webFrame } from "electron";

const Content = () => {
  // webFrame.setZoomFactor(0.9);
  // webFrame.setZoomFactor(1);

  const classes = layoutClasses();
  const [menuitem, setMenuitem] = useState(mainmenu[0]);
  const [isEditor, setIsEditor] = useState(false);

  const theme = useTheme();

  const { branches } = useBranches();
  const { services, refreshservice, addService, editService } = useServices();
  const { company, editCompany, refreshcompany } = useCompany();
  const { suppliers } = useSuppliers();
  const { accounts, refreshAccount } = useAccounts();

  const {
    store: { user, calendar, network },
    dispatch,
    translate: { words, isRTL },
  }: GContextTypes = useContext(GlobalContext);
  const logout = () => {
    dispatch({ type: "logout" });
  };

  useEffect(() => {
    const isCalPOSEditor = roles.isCalEditor() || roles.isPOSEditor();
    setIsEditor(isCalPOSEditor);
  }, []);

  const [calendarStore, calendarDispatch] = useReducer(
    calendarReducer,
    initCalendar
  );

  const [eventsStore, eventsDispatch] = useReducer(
    eventsReducer,
    initEventsContext
  );
  const [documentsStore, documentsDispatch] = useReducer(
    documentsReportReducer,
    initDocumentsReportContext
  );
  const [servicesStore, servicesDispatch] = useReducer(
    servicesReportReducer,
    initServicesReportContext
  );
  const [tasksStore, tasksDispatch] = useReducer(
    tasksReducer,
    initTasksContext
  );
  const [salesStore, salesDispatch] = useReducer(
    salesReducer,
    initSalesContext
  );
  const [salesReportStore, salesReportDispatch] = useReducer(
    salesReportReducer,
    initSalesReportContext
  );
  const [purchaseReportStore, purchaseReportDispatch] = useReducer(
    purchaseReportReducer,
    initPurchaseReportContext
  );
  const [eventsReportStore, eventsReportDispatch] = useReducer(
    eventsReportReducer,
    initEventsReportContext
  );

  const [financeStore, financeDispatch] = useReducer(
    financeReducer,
    initFinanceContext
  );
  const [receiptStore, receiptDispatch] = useReducer(
    receiptReducer,
    initReceiptContext
  );
  const [expensesStore, expensesDispatch] = useReducer(
    expensesReducer,
    initExpensesContext
  );
  const [expensesReportStore, expensesReportDispatch] = useReducer(
    expensesReportReducer,
    initExpensesReportContext
  );
  const [customerReportStore, customerReportDispatch] = useReducer(
    customerReportReducer,
    initCustomerReportContext
  );
  const [calendarReportStore, calendarReportDispatch] = useReducer(
    calendarReportReducer,
    initCalendarReportContext
  );

  let systems: any;
  const barnch = branches.filter((br: any) => br.basename === user.branch);
  if (barnch && barnch.length > 0) {
    systems = barnch?.[0]?.systems;
  }

  const menu = systems ? filterMenu(systems) : [];
  const accs = user.isSuperAdmin
    ? accounts
    : accounts.filter((acc: any) => acc.branch === user.branch);
  const mainaccounts = getparentAccounts(systems);
  const filteredAccounts =
    accs?.length > 0
      ? accs.filter((acc: any) => mainaccounts.includes(acc.parentcode))
      : [];
  filteredAccounts.sort((a: any, b: any) => a.code - b.code);
  return (
    <Box
      className={classes.root}
      dir={isRTL ? "rtl" : undefined}
      display="flex"
      style={{
        flex: 1,
        backgroundColor: fade(theme.palette.info.light, 0.05),
      }}
    >
      <CssBaseline />
      <AppDrawer
        isRTL={isRTL}
        setMenuitem={setMenuitem}
        menuitem={menuitem}
        user={user}
        branches={branches}
        menu={menu}
        logout={logout}
        network={network}
      ></AppDrawer>
      <main className={classes.content}>
        <div>
          <Route
            path="/"
            exact
            component={() => (
              <Landing
                menuitem={menuitem}
                isRTL={isRTL}
                words={words}
                user={user}
                theme={theme}
              ></Landing>
            )}
          />
          <Route
            path="/calendar"
            component={() => (
              <CalendarContext.Provider
                value={{ state: calendarStore, dispatch: calendarDispatch }}
              >
                <MainCalendar
                  menuitem={menuitem}
                  isRTL={isRTL}
                  words={words}
                  theme={theme}
                  isEditor={isEditor}
                  calendar={calendar}
                  company={company}
                  services={services}
                  addService={addService}
                  editService={editService}
                ></MainCalendar>
              </CalendarContext.Provider>
            )}
          />
          <Route
            path="/calendarempl"
            component={() => (
              <CalendarReportContext.Provider
                value={{
                  state: calendarReportStore,
                  dispatch: calendarReportDispatch,
                }}
              >
                <EmployeesCalendar
                  menuitem={menuitem}
                  isRTL={isRTL}
                  words={words}
                  theme={theme}
                  isEditor={isEditor}
                  calendar={calendar}
                  services={services}
                  company={company}
                ></EmployeesCalendar>
              </CalendarReportContext.Provider>
            )}
          />
          <Route
            path="/sales"
            component={() => (
              <SalesContext.Provider
                value={{ state: salesStore, dispatch: salesDispatch }}
              >
                <Invoices
                  menuitem={menuitem}
                  isRTL={isRTL}
                  words={words}
                  isEditor={isEditor}
                  theme={theme}
                  company={company}
                  servicesproducts={services}
                ></Invoices>
              </SalesContext.Provider>
            )}
          />
          <Route
            path="/tasks"
            component={() => (
              <TasksContext.Provider
                value={{ state: tasksStore, dispatch: tasksDispatch }}
              >
                <Tasks
                  menuitem={menuitem}
                  isRTL={isRTL}
                  words={words}
                  isEditor={isEditor}
                  theme={theme}
                  company={company}
                  servicesproducts={services}
                ></Tasks>
              </TasksContext.Provider>
            )}
          />
          <Route
            path="/appointments"
            component={() => (
              <EventsContext.Provider
                value={{ state: eventsStore, dispatch: eventsDispatch }}
              >
                <Appointments
                  menuitem={menuitem}
                  isRTL={isRTL}
                  words={words}
                  isEditor={isEditor}
                  theme={theme}
                  company={company}
                  servicesproducts={services}
                ></Appointments>
              </EventsContext.Provider>
            )}
          />

          <Route
            path="/cash"
            component={() => (
              <FinanceContext.Provider
                value={{ state: financeStore, dispatch: financeDispatch }}
              >
                <Finance
                  menuitem={menuitem}
                  isRTL={isRTL}
                  words={words}
                  isEditor={isEditor}
                  theme={theme}
                ></Finance>
              </FinanceContext.Provider>
            )}
          />
          <Route
            path="/receipts"
            component={() => (
              <ReceiptContext.Provider
                value={{ state: receiptStore, dispatch: receiptDispatch }}
              >
                <Receipt
                  menuitem={menuitem}
                  isRTL={isRTL}
                  words={words}
                  isEditor={isEditor}
                  theme={theme}
                ></Receipt>
              </ReceiptContext.Provider>
            )}
          />
          <Route
            path="/expenses"
            component={() => (
              <ExpensesContext.Provider
                value={{ state: expensesStore, dispatch: expensesDispatch }}
              >
                <Expenses
                  menuitem={menuitem}
                  isRTL={isRTL}
                  words={words}
                  isEditor={isEditor}
                  theme={theme}
                ></Expenses>
              </ExpensesContext.Provider>
            )}
          />
          <Route
            path="/financeall"
            component={() => (
              <FinanceContext.Provider
                value={{ state: financeStore, dispatch: financeDispatch }}
              >
                <FinanceAll
                  menuitem={menuitem}
                  isRTL={isRTL}
                  words={words}
                  isEditor={isEditor}
                  theme={theme}
                ></FinanceAll>
              </FinanceContext.Provider>
            )}
          />
          <Route
            path="/customers"
            component={() => (
              <Customers
                isRTL={isRTL}
                words={words}
                theme={theme}
                menuitem={menuitem}
                isEditor={isEditor}
                company={company}
                servicesproducts={services}
              ></Customers>
            )}
          />
          <Route
            path="/users"
            component={() => (
              <Users
                words={words}
                isEditor={isEditor}
                menuitem={menuitem}
                theme={theme}
                isRTL={isRTL}
              ></Users>
            )}
          />
          <Route
            path="/accounts"
            component={() => (
              <PageLayout
                menuitem={menuitem}
                isRTL={isRTL}
                words={words}
                isEditor={isEditor}
                theme={theme}
                refresh={refreshAccount}
              >
                <Accounts accounts={accs}></Accounts>
              </PageLayout>
            )}
          />
          <Route
            path="/branches"
            component={() => (
              <PageLayout
                menuitem={menuitem}
                isRTL={isRTL}
                words={words}
                theme={theme}
                isEditor={isEditor}
              >
                <Branches isRTL={isRTL} words={words} theme={theme}>
                  {" "}
                </Branches>
              </PageLayout>
            )}
          />
          <Route
            path="/options"
            component={() => (
              <PageLayout
                menuitem={menuitem}
                isRTL={isRTL}
                words={words}
                isEditor={isEditor}
                theme={theme}
                refresh={refreshcompany}
                editCompany={editCompany}
                company={company}
              >
                <Options></Options>
              </PageLayout>
            )}
          />
          <Route
            path="/departments"
            component={() => (
              <Departments
                menuitem={menuitem}
                isRTL={isRTL}
                words={words}
                isEditor={isEditor}
                theme={theme}
              ></Departments>
            )}
          />
          <Route
            path="/managedepartments"
            component={() => (
              <ManageDepartments
                menuitem={menuitem}
                isRTL={isRTL}
                words={words}
                isEditor={isEditor}
                theme={theme}
                servicesproducts={services}
                company={company}
              ></ManageDepartments>
            )}
          />
          <Route
            path="/employees"
            component={() => (
              <Employees
                menuitem={menuitem}
                isRTL={isRTL}
                words={words}
                isEditor={isEditor}
                theme={theme}
              ></Employees>
            )}
          />
          <Route
            path="/manageemployees"
            component={() => (
              <ManageEmployees
                menuitem={menuitem}
                isRTL={isRTL}
                words={words}
                isEditor={isEditor}
                theme={theme}
                servicesproducts={services}
                company={company}
              ></ManageEmployees>
            )}
          />
          <Route
            path="/resourses"
            component={() => (
              <Resourses
                menuitem={menuitem}
                isRTL={isRTL}
                words={words}
                isEditor={isEditor}
                theme={theme}
              ></Resourses>
            )}
          />
          <Route
            path="/manageresourses"
            component={() => (
              <ManageResourses
                menuitem={menuitem}
                isRTL={isRTL}
                words={words}
                isEditor={isEditor}
                theme={theme}
                servicesproducts={services}
                company={company}
              ></ManageResourses>
            )}
          />
          <Route
            path="/services"
            component={() => (
              <PageLayout
                menuitem={menuitem}
                isRTL={isRTL}
                words={words}
                isEditor={isEditor}
                theme={theme}
                refresh={refreshservice}
              >
                <Services></Services>
              </PageLayout>
            )}
          />

          <Route
            path="/calreports"
            component={() => (
              <EventsReportContext.Provider
                value={{
                  state: eventsReportStore,
                  dispatch: eventsReportDispatch,
                }}
              >
                <EventsReport
                  isEditor={isEditor}
                  menuitem={menuitem}
                  isRTL={isRTL}
                  words={words}
                  services={services}
                  categories={[]}
                  company={company}
                  theme={theme}
                ></EventsReport>
              </EventsReportContext.Provider>
            )}
          />
          <Route
            path="/docreports"
            component={() => (
              <DocumentsReportContext.Provider
                value={{
                  state: documentsStore,
                  dispatch: documentsDispatch,
                }}
              >
                <DocumentsReport
                  isEditor={isEditor}
                  menuitem={menuitem}
                  isRTL={isRTL}
                  words={words}
                  services={services}
                  categories={[]}
                  company={company}
                  theme={theme}
                ></DocumentsReport>
              </DocumentsReportContext.Provider>
            )}
          />
          <Route
            path="/servicesreports"
            component={() => (
              <ServicesReportContext.Provider
                value={{
                  state: servicesStore,
                  dispatch: servicesDispatch,
                }}
              >
                <ServicesReport
                  isEditor={isEditor}
                  menuitem={menuitem}
                  isRTL={isRTL}
                  words={words}
                  services={services}
                  categories={[]}
                  company={company}
                  theme={theme}
                ></ServicesReport>
              </ServicesReportContext.Provider>
            )}
          />
          <Route
            path="/salesreport"
            component={() => (
              <SalesReportContext.Provider
                value={{
                  state: salesReportStore,
                  dispatch: salesReportDispatch,
                }}
              >
                <SalesReport
                  isRTL={isRTL}
                  words={words}
                  isEditor={isEditor}
                  menuitem={menuitem}
                  theme={theme}
                  services={services}
                  categories={[]}
                  company={company}
                ></SalesReport>
              </SalesReportContext.Provider>
            )}
          />
          <Route
            path="/purchasereport"
            component={() => (
              <PurchaseReportContext.Provider
                value={{
                  state: purchaseReportStore,
                  dispatch: purchaseReportDispatch,
                }}
              >
                <PurchaseReport
                  isRTL={isRTL}
                  words={words}
                  isEditor={isEditor}
                  menuitem={menuitem}
                  theme={theme}
                  services={services}
                  suppliers={suppliers}
                  categories={[]}
                  company={company}
                ></PurchaseReport>
              </PurchaseReportContext.Provider>
            )}
          />
          <Route
            path="/financereport"
            component={() => (
              <FinanceContext.Provider
                value={{
                  state: financeStore,
                  dispatch: financeDispatch,
                }}
              >
                <FinanceReport
                  isRTL={isRTL}
                  words={words}
                  isEditor={isEditor}
                  menuitem={menuitem}
                  theme={theme}
                  services={services}
                  categories={[]}
                  company={company}
                  mainaccounts={filteredAccounts}
                ></FinanceReport>
              </FinanceContext.Provider>
            )}
          />
          <Route
            path="/expensesreport"
            component={() => (
              <ExpensesReportContext.Provider
                value={{
                  state: expensesReportStore,
                  dispatch: expensesReportDispatch,
                }}
              >
                <ExpensesReport
                  isRTL={isRTL}
                  words={words}
                  isEditor={isEditor}
                  menuitem={menuitem}
                  theme={theme}
                  services={services}
                  categories={[]}
                  company={company}
                  mainaccounts={filteredAccounts}
                ></ExpensesReport>
              </ExpensesReportContext.Provider>
            )}
          />
          <Route
            path="/customerreport"
            component={() => (
              <CustomerReportContext.Provider
                value={{
                  state: customerReportStore,
                  dispatch: customerReportDispatch,
                }}
              >
                <CustomerReport
                  isRTL={isRTL}
                  words={words}
                  isEditor={isEditor}
                  menuitem={menuitem}
                  theme={theme}
                  services={services}
                  categories={[]}
                  company={company}
                  mainaccounts={filteredAccounts}
                ></CustomerReport>
              </CustomerReportContext.Provider>
            )}
          />
        </div>
      </main>
    </Box>
  );
};
export default Content;
