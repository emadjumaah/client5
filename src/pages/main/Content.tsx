/* eslint-disable no-var */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useContext, useReducer, useState } from 'react';
import { useTheme } from '@material-ui/core/styles';
import { Box, CssBaseline } from '@material-ui/core';
import { Route, Routes } from 'react-router-dom';
import { AppDrawer } from '../../components';
import { mainmenu } from '../../constants';
import Landing from './Landing';
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
  PurchaseContext,
} from '../../contexts';
import { layoutClasses } from '../../themes';
import Options from '../options';
import {
  Users,
  Departments,
  Employees,
  Customers,
  Services,
  Invoices,
  Accounts,
  Products,
} from '../adds';
import { GContextTypes } from '../../types';
import Finance from '../adds/Finance';

import { useBranches, useSuppliers } from '../../hooks';
import PageLayout from './PageLayout';
import Appointments from '../adds/Appointments';
import { CalendarContext } from '../../contexts/calendar';
import { initCalendar, calendarReducer } from '../../contexts';
import SalesReport from '../reports/SalesReport';
import useAccounts from '../../hooks/useAccounts';
import FinanceReport from '../reports/FinanceReport';
import {
  eventsReportReducer,
  initEventsReportContext,
} from '../../contexts/eventsreport/salesReducer';
import EventsReport from '../reports/EventsReport';
import CustomerReport from '../reports/CustomerReport';
import EventsReportContext from '../../contexts/eventsreport';
import {
  calendarReportReducer,
  initCalendarReportContext,
} from '../../contexts/calendarReport/eventsReducer';
import CalendarReportContext from '../../contexts/calendarReport';
// import Expenses from '../adds/Expenses';
import {
  filterMenu,
  getparentAccounts,
  getparentAccountsNames,
} from '../../common/helpers';
import PurchaseReport from '../reports/PurchaseReport';
import ExpensesReport from '../reports/ExpensesReport';
import Resourses from '../adds/Resourses';
import Receipt from '../adds/Receipt';
// import FinanceAll from '../adds/FinanceAll';
import Tasks from '../adds/Tasks';
import DocumentsReport from '../reports/DocumentsReport';
import {
  documentsReportReducer,
  initDocumentsReportContext,
} from '../../contexts/documentsReport/documentsReducer';
import DocumentsReportContext from '../../contexts/documentsReport';
import ServicesReportContext from '../../contexts/servicesReport';
import ServicesReport from '../reports/ServicesReport';
import {
  initServicesReportContext,
  servicesReportReducer,
} from '../../contexts/servicesReport/servicesReducer';
import ManageEmployees from '../adds/ManageEmployees';
import ManageDepartments from '../adds/ManageDepartments';
import EmployeesCalendar from '../calendar/EmployeesCalendar';
import ManageResourses from '../adds/ManageResourses';
import Branches from '../adds/Branches';
import React from 'react';
import AlertWithClose from '../../components/fields/AlertWithClose';
import ManageProjects from '../adds/ManageProjects';
import Main from '../calendar/Main';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import useCompany from '../../hooks/useCompany';
import Contacts from '../adds/Contacts';
import Groups from '../adds/Groups';
import Sendreqs from '../adds/Sendreqs';
import Reminders from '../adds/Reminders';
import RemindCal from '../calendar/RemindCal';
import Messages from '../adds/Messages';
import Actions from '../adds/Actions';
import Notifications from '../adds/Notifications';
import FinanceAllKaid from '../adds/FinanceAllKaid';
import ProfitReport from '../reports/ProfitReport';
import BudgetReport from '../reports/BudgetReport';
import ExpensesDoc from '../adds/ExpensesDoc';
import {
  initReminderContext,
  reminderReducer,
} from '../../contexts/reminder/salesReducer';
import ReminderContext from '../../contexts/reminder';
import ViewReminders from '../adds/ViewReminders';
import ExpenseItems from '../adds/ExpenseItems';
import Suppliers from '../adds/Suppliers';
import PurchaseInvoices from '../adds/PurchaseInvoices';
import Payment from '../adds/Payment';
import ExpProducts from '../adds/ExpProducts';
import SupplierReport from '../reports/SupplierReport';
import {
  initSupplierReportContext,
  supplierReportReducer,
} from '../../contexts/supplierReport/customerReportReducer';
import SupplierReportContext from '../../contexts/supplierReport';
import StockItems from '../adds/StockItems';
import ProductsReport from '../reports/ProductsReport';
import {
  ContractContext,
  contractReducer,
  DepartmentContext,
  departmentReducer,
  EmployeeContext,
  employeeReducer,
  initContractContext,
  initDepartmentContext,
  initEmployeeContext,
  initResourseContext,
  ResourseContext,
  resourseReducer,
  ProjectContext,
  initProjectContext,
  projectReducer,
  CustomerContext,
  initCustomerContext,
  customerReducer,
  SupplierContext,
  initSupplierContext,
  supplierReducer,
} from '../../contexts/managment';

const Content = () => {
  const classes = layoutClasses();
  const [mmenu, setMmenu] = useState(null);
  // const [menu, setmenu] = useState(filterMenu());
  const [menuitem, setMenuitem] = useState(mainmenu[0]);
  // const [mlocation, setMlocation] = useState('/');

  const theme = useTheme();
  // const navigate = useNavigate();
  // const location = useLocation();

  const { company, editCompany, refreshcompany } = useCompany();
  const { branches } = useBranches();
  const { suppliers } = useSuppliers();
  const { accounts, refreshAccount } = useAccounts();

  const {
    store: { user, calendar, network, packIssue, packIssueMsg, notify },
    dispatch,
    translate: { words, isRTL },
  }: GContextTypes = useContext(GlobalContext);
  const { isMobile } = useWindowDimensions();

  const logout = () => {
    dispatch({ type: 'logout' });
  };

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

  const [salesStore, salesDispatch] = useReducer(
    salesReducer,
    initSalesContext
  );
  const [reminderStore, reminderDispatch] = useReducer(
    reminderReducer,
    initReminderContext
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
  const [supplierReportStore, supplierReportDispatch] = useReducer(
    supplierReportReducer,
    initSupplierReportContext
  );
  const [calendarReportStore, calendarReportDispatch] = useReducer(
    calendarReportReducer,
    initCalendarReportContext
  );
  const [contractStore, contractDispatch] = useReducer(
    contractReducer,
    initContractContext
  );
  const [resourseStore, resourseDispatch] = useReducer(
    resourseReducer,
    initResourseContext
  );
  const [employeeStore, employeeDispatch] = useReducer(
    employeeReducer,
    initEmployeeContext
  );
  const [departmentStore, departmentDispatch] = useReducer(
    departmentReducer,
    initDepartmentContext
  );
  const [projectStore, projectDispatch] = useReducer(
    projectReducer,
    initProjectContext
  );
  const [customerStore, customerDispatch] = useReducer(
    customerReducer,
    initCustomerContext
  );
  const [supplierStore, supplierDispatch] = useReducer(
    supplierReducer,
    initSupplierContext
  );

  const accs = user.isSuperAdmin
    ? accounts
    : accounts.filter((acc: any) => acc.branch === user.branch);
  const mainaccounts = getparentAccounts();
  const mainaccountsnames = getparentAccountsNames();
  const filteredAccounts =
    accs?.length > 0
      ? accs.filter((acc: any) => mainaccounts.includes(acc.parentcode))
      : [];
  filteredAccounts.sort((a: any, b: any) => a.code - b.code);

  return (
    <Box
      className={classes.root}
      dir={isRTL ? 'rtl' : undefined}
      display="flex"
      style={{
        flex: 1,
        // backgroundColor: fade(theme.palette.info.light, 0.05),
      }}
    >
      <CssBaseline />
      <AppDrawer
        isRTL={isRTL}
        setMenuitem={setMenuitem}
        menuitem={menuitem}
        user={user}
        branches={branches}
        menu={filterMenu()}
        logout={logout}
        network={network}
        setMmenu={setMmenu}
        mmenu={mmenu}
        notify={notify}
        dispatch={dispatch}
        company={company}
      ></AppDrawer>
      <main
        style={{ marginTop: isMobile ? 50 : undefined }}
        className={classes.content}
      >
        <Routes>
          <Route
            path="/"
            element={
              <Landing
                menuitem={menuitem}
                isRTL={isRTL}
                words={words}
                user={user}
                theme={theme}
              ></Landing>
            }
          />
          <Route
            path="/calendar"
            element={
              <CalendarContext.Provider
                value={{ state: calendarStore, dispatch: calendarDispatch }}
              >
                <Main
                  menuitem={menuitem}
                  isRTL={isRTL}
                  words={words}
                  theme={theme}
                  calendar={calendar}
                  company={company}
                ></Main>
              </CalendarContext.Provider>
            }
          />
          <Route
            path="/remindcal"
            element={
              <CalendarContext.Provider
                value={{ state: calendarStore, dispatch: calendarDispatch }}
              >
                <RemindCal
                  menuitem={menuitem}
                  isRTL={isRTL}
                  words={words}
                  theme={theme}
                  calendar={calendar}
                  company={company}
                ></RemindCal>
              </CalendarContext.Provider>
            }
          />
          <Route
            path="/calendarempl"
            element={
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
                  calendar={calendar}
                  company={company}
                ></EmployeesCalendar>
              </CalendarReportContext.Provider>
            }
          />
          <Route
            path="/invoices"
            element={
              <SalesContext.Provider
                value={{ state: salesStore, dispatch: salesDispatch }}
              >
                <Invoices
                  menuitem={menuitem}
                  isRTL={isRTL}
                  words={words}
                  theme={theme}
                  company={company}
                ></Invoices>
              </SalesContext.Provider>
            }
          />
          <Route
            path="/purchase"
            element={
              <PurchaseContext.Provider
                value={{ state: salesStore, dispatch: salesDispatch }}
              >
                <PurchaseInvoices
                  menuitem={menuitem}
                  isRTL={isRTL}
                  words={words}
                  theme={theme}
                  company={company}
                ></PurchaseInvoices>
              </PurchaseContext.Provider>
            }
          />
          <Route
            path="/tasks"
            element={
              <ContractContext.Provider
                value={{ state: contractStore, dispatch: contractDispatch }}
              >
                <Tasks
                  menuitem={menuitem}
                  isRTL={isRTL}
                  words={words}
                  theme={theme}
                  company={company}
                ></Tasks>
              </ContractContext.Provider>
            }
          />
          <Route
            path="/appointments"
            element={
              <EventsContext.Provider
                value={{ state: eventsStore, dispatch: eventsDispatch }}
              >
                <Appointments
                  menuitem={menuitem}
                  isRTL={isRTL}
                  words={words}
                  theme={theme}
                  company={company}
                ></Appointments>
              </EventsContext.Provider>
            }
          />

          <Route
            path="/cash"
            element={
              <FinanceContext.Provider
                value={{ state: financeStore, dispatch: financeDispatch }}
              >
                <Finance
                  menuitem={menuitem}
                  isRTL={isRTL}
                  words={words}
                  theme={theme}
                ></Finance>
              </FinanceContext.Provider>
            }
          />
          <Route
            path="/receipts"
            element={
              <ReceiptContext.Provider
                value={{ state: receiptStore, dispatch: receiptDispatch }}
              >
                <Receipt
                  menuitem={menuitem}
                  isRTL={isRTL}
                  words={words}
                  theme={theme}
                  company={company}
                ></Receipt>
              </ReceiptContext.Provider>
            }
          />
          <Route
            path="/payments"
            element={
              <ReceiptContext.Provider
                value={{ state: receiptStore, dispatch: receiptDispatch }}
              >
                <Payment
                  menuitem={menuitem}
                  isRTL={isRTL}
                  words={words}
                  theme={theme}
                  company={company}
                ></Payment>
              </ReceiptContext.Provider>
            }
          />
          {/* <Route
            path="/expenses"
            element={
              <ExpensesContext.Provider
                value={{ state: expensesStore, dispatch: expensesDispatch }}
              >
                <Expenses
                  menuitem={menuitem}
                  isRTL={isRTL}
                  words={words}
                  theme={theme}
                  company={company}
                ></Expenses>
              </ExpensesContext.Provider>
            }
          /> */}
          <Route
            path="/expenses"
            element={
              <ExpensesContext.Provider
                value={{ state: expensesStore, dispatch: expensesDispatch }}
              >
                <ExpensesDoc
                  menuitem={menuitem}
                  isRTL={isRTL}
                  words={words}
                  theme={theme}
                  company={company}
                ></ExpensesDoc>
              </ExpensesContext.Provider>
            }
          />
          <Route
            path="/expproducts"
            element={
              <ExpensesContext.Provider
                value={{ state: expensesStore, dispatch: expensesDispatch }}
              >
                <ExpProducts
                  menuitem={menuitem}
                  isRTL={isRTL}
                  words={words}
                  theme={theme}
                  company={company}
                ></ExpProducts>
              </ExpensesContext.Provider>
            }
          />
          <Route
            path="/financeall"
            element={
              <FinanceContext.Provider
                value={{ state: financeStore, dispatch: financeDispatch }}
              >
                <FinanceAllKaid
                  menuitem={menuitem}
                  isRTL={isRTL}
                  words={words}
                  theme={theme}
                  company={company}
                ></FinanceAllKaid>
              </FinanceContext.Provider>
            }
          />
          <Route
            path="/customers"
            element={
              <CustomerContext.Provider
                value={{ state: customerStore, dispatch: customerDispatch }}
              >
                <Customers
                  isRTL={isRTL}
                  words={words}
                  theme={theme}
                  menuitem={menuitem}
                  company={company}
                ></Customers>
              </CustomerContext.Provider>
            }
          />
          <Route
            path="/supliers"
            element={
              <SupplierContext.Provider
                value={{ state: supplierStore, dispatch: supplierDispatch }}
              >
                <Suppliers
                  isRTL={isRTL}
                  words={words}
                  theme={theme}
                  menuitem={menuitem}
                  company={company}
                ></Suppliers>
              </SupplierContext.Provider>
            }
          />
          <Route
            path="/contacts"
            element={
              <Contacts
                isRTL={isRTL}
                words={words}
                theme={theme}
                menuitem={menuitem}
              ></Contacts>
            }
          />
          <Route
            path="/groups"
            element={
              <Groups
                isRTL={isRTL}
                words={words}
                theme={theme}
                menuitem={menuitem}
              ></Groups>
            }
          />
          <Route
            path="/managereminders"
            element={
              <ReminderContext.Provider
                value={{ state: reminderStore, dispatch: reminderDispatch }}
              >
                <Reminders
                  isRTL={isRTL}
                  words={words}
                  theme={theme}
                  menuitem={menuitem}
                ></Reminders>
              </ReminderContext.Provider>
            }
          />
          <Route
            path="/viewreminders"
            element={
              <ReminderContext.Provider
                value={{ state: reminderStore, dispatch: reminderDispatch }}
              >
                <ViewReminders
                  isRTL={isRTL}
                  words={words}
                  theme={theme}
                  menuitem={menuitem}
                ></ViewReminders>
              </ReminderContext.Provider>
            }
          />
          <Route
            path="/messages"
            element={
              <EventsContext.Provider
                value={{ state: calendarStore, dispatch: calendarDispatch }}
              >
                <Messages
                  isRTL={isRTL}
                  words={words}
                  theme={theme}
                  menuitem={menuitem}
                  company={company}
                  refreshcompany={refreshcompany}
                ></Messages>
              </EventsContext.Provider>
            }
          />
          <Route
            path="/notifications"
            element={
              <Notifications
                isRTL={isRTL}
                words={words}
                theme={theme}
                menuitem={menuitem}
                notify={notify}
                dispatch={dispatch}
                company={company}
              ></Notifications>
            }
          />
          <Route
            path="/sendreqs"
            element={
              <Sendreqs
                isRTL={isRTL}
                words={words}
                theme={theme}
                menuitem={menuitem}
                company={company}
              ></Sendreqs>
            }
          />
          <Route
            path="/actions"
            element={
              <EventsContext.Provider
                value={{ state: expensesStore, dispatch: expensesDispatch }}
              >
                <Actions
                  isRTL={isRTL}
                  words={words}
                  theme={theme}
                  menuitem={menuitem}
                ></Actions>
              </EventsContext.Provider>
            }
          />
          <Route
            path="/users"
            element={
              <Users
                words={words}
                menuitem={menuitem}
                theme={theme}
                isRTL={isRTL}
                user={user}
              ></Users>
            }
          />
          <Route
            path="/accounts"
            element={
              <PageLayout
                menuitem={menuitem}
                isRTL={isRTL}
                words={words}
                theme={theme}
                refresh={refreshAccount}
              >
                <Accounts accounts={accs}></Accounts>
              </PageLayout>
            }
          />
          {user.isSuperAdmin && (
            <Route
              path="/branches"
              element={
                <PageLayout
                  menuitem={menuitem}
                  isRTL={isRTL}
                  words={words}
                  theme={theme}
                >
                  <Branches
                    isRTL={isRTL}
                    words={words}
                    theme={theme}
                  ></Branches>
                </PageLayout>
              }
            />
          )}
          <Route
            path="/options"
            element={
              <PageLayout
                menuitem={menuitem}
                isRTL={isRTL}
                words={words}
                theme={theme}
                refresh={refreshcompany}
                editCompany={editCompany}
                company={company}
              >
                <Options></Options>
              </PageLayout>
            }
          />
          <Route
            path="/departments"
            element={
              <Departments
                menuitem={menuitem}
                isRTL={isRTL}
                words={words}
                theme={theme}
              ></Departments>
            }
          />
          <Route
            path="/managedepartments"
            element={
              <DepartmentContext.Provider
                value={{ state: departmentStore, dispatch: departmentDispatch }}
              >
                <ManageDepartments
                  menuitem={menuitem}
                  isRTL={isRTL}
                  words={words}
                  theme={theme}
                  company={company}
                ></ManageDepartments>
              </DepartmentContext.Provider>
            }
          />
          <Route
            path="/manageprojects"
            element={
              <ProjectContext.Provider
                value={{ state: projectStore, dispatch: projectDispatch }}
              >
                <ManageProjects
                  menuitem={menuitem}
                  isRTL={isRTL}
                  words={words}
                  theme={theme}
                  company={company}
                ></ManageProjects>
              </ProjectContext.Provider>
            }
          />
          <Route
            path="/employees"
            element={
              <Employees
                menuitem={menuitem}
                isRTL={isRTL}
                words={words}
                theme={theme}
              ></Employees>
            }
          />
          <Route
            path="/manageemployees"
            element={
              <EmployeeContext.Provider
                value={{ state: employeeStore, dispatch: employeeDispatch }}
              >
                <ManageEmployees
                  menuitem={menuitem}
                  isRTL={isRTL}
                  words={words}
                  theme={theme}
                  company={company}
                ></ManageEmployees>
              </EmployeeContext.Provider>
            }
          />

          <Route
            path="/resourses"
            element={
              <Resourses
                menuitem={menuitem}
                isRTL={isRTL}
                words={words}
                theme={theme}
              ></Resourses>
            }
          />
          <Route
            path="/manageresourses"
            element={
              <ResourseContext.Provider
                value={{ state: resourseStore, dispatch: resourseDispatch }}
              >
                <ManageResourses
                  menuitem={menuitem}
                  isRTL={isRTL}
                  words={words}
                  theme={theme}
                  company={company}
                ></ManageResourses>
              </ResourseContext.Provider>
            }
          />
          <Route
            path="/services"
            element={
              <PageLayout
                menuitem={menuitem}
                isRTL={isRTL}
                words={words}
                theme={theme}
                refresh={() => null}
              >
                <Services></Services>
              </PageLayout>
            }
          />
          <Route
            path="/products"
            element={
              <PageLayout
                menuitem={menuitem}
                isRTL={isRTL}
                words={words}
                theme={theme}
                refresh={() => null}
              >
                <Products></Products>
              </PageLayout>
            }
          />
          <Route
            path="/stockitems"
            element={
              <PageLayout
                menuitem={menuitem}
                isRTL={isRTL}
                words={words}
                theme={theme}
                refresh={() => null}
              >
                <StockItems></StockItems>
              </PageLayout>
            }
          />
          <Route
            path="/expenseitems"
            element={
              <PageLayout
                menuitem={menuitem}
                isRTL={isRTL}
                words={words}
                theme={theme}
                refresh={() => null}
              >
                <ExpenseItems></ExpenseItems>
              </PageLayout>
            }
          />
          <Route
            path="/calreports"
            element={
              <EventsReportContext.Provider
                value={{
                  state: eventsReportStore,
                  dispatch: eventsReportDispatch,
                }}
              >
                <EventsReport
                  menuitem={menuitem}
                  isRTL={isRTL}
                  words={words}
                  categories={[]}
                  company={company}
                  theme={theme}
                ></EventsReport>
              </EventsReportContext.Provider>
            }
          />
          <Route
            path="/docreports"
            element={
              <DocumentsReportContext.Provider
                value={{
                  state: documentsStore,
                  dispatch: documentsDispatch,
                }}
              >
                <DocumentsReport
                  menuitem={menuitem}
                  isRTL={isRTL}
                  words={words}
                  categories={[]}
                  company={company}
                  theme={theme}
                ></DocumentsReport>
              </DocumentsReportContext.Provider>
            }
          />
          <Route
            path="/servicesreports"
            element={
              <ServicesReportContext.Provider
                value={{
                  state: servicesStore,
                  dispatch: servicesDispatch,
                }}
              >
                <ServicesReport
                  menuitem={menuitem}
                  isRTL={isRTL}
                  words={words}
                  categories={[]}
                  company={company}
                  theme={theme}
                ></ServicesReport>
              </ServicesReportContext.Provider>
            }
          />
          <Route
            path="/stockreport"
            element={
              <ServicesReportContext.Provider
                value={{
                  state: servicesStore,
                  dispatch: servicesDispatch,
                }}
              >
                <ProductsReport
                  menuitem={menuitem}
                  isRTL={isRTL}
                  words={words}
                  categories={[]}
                  company={company}
                  theme={theme}
                ></ProductsReport>
              </ServicesReportContext.Provider>
            }
          />
          <Route
            path="/salesreport"
            element={
              <SalesReportContext.Provider
                value={{
                  state: salesReportStore,
                  dispatch: salesReportDispatch,
                }}
              >
                <SalesReport
                  isRTL={isRTL}
                  words={words}
                  menuitem={menuitem}
                  theme={theme}
                  categories={[]}
                  company={company}
                ></SalesReport>
              </SalesReportContext.Provider>
            }
          />
          <Route
            path="/purchasereport"
            element={
              <PurchaseReportContext.Provider
                value={{
                  state: purchaseReportStore,
                  dispatch: purchaseReportDispatch,
                }}
              >
                <PurchaseReport
                  isRTL={isRTL}
                  words={words}
                  menuitem={menuitem}
                  theme={theme}
                  suppliers={suppliers}
                  categories={[]}
                  company={company}
                ></PurchaseReport>
              </PurchaseReportContext.Provider>
            }
          />
          <Route
            path="/financereport"
            element={
              <FinanceContext.Provider
                value={{
                  state: financeStore,
                  dispatch: financeDispatch,
                }}
              >
                <FinanceReport
                  isRTL={isRTL}
                  words={words}
                  menuitem={menuitem}
                  theme={theme}
                  categories={[]}
                  company={company}
                  mainaccounts={mainaccountsnames}
                  accounts={filteredAccounts}
                ></FinanceReport>
              </FinanceContext.Provider>
            }
          />
          <Route
            path="/profitreport"
            element={
              <FinanceContext.Provider
                value={{
                  state: financeStore,
                  dispatch: financeDispatch,
                }}
              >
                <ProfitReport
                  isRTL={isRTL}
                  words={words}
                  menuitem={menuitem}
                  theme={theme}
                  categories={[]}
                  company={company}
                  mainaccounts={filteredAccounts}
                ></ProfitReport>
              </FinanceContext.Provider>
            }
          />
          <Route
            path="/budgetreport"
            element={
              <FinanceContext.Provider
                value={{
                  state: financeStore,
                  dispatch: financeDispatch,
                }}
              >
                <BudgetReport
                  isRTL={isRTL}
                  words={words}
                  menuitem={menuitem}
                  theme={theme}
                  categories={[]}
                  company={company}
                  mainaccounts={filteredAccounts}
                ></BudgetReport>
              </FinanceContext.Provider>
            }
          />
          <Route
            path="/expensesreport"
            element={
              <ExpensesReportContext.Provider
                value={{
                  state: expensesReportStore,
                  dispatch: expensesReportDispatch,
                }}
              >
                <ExpensesReport
                  isRTL={isRTL}
                  words={words}
                  menuitem={menuitem}
                  theme={theme}
                  categories={[]}
                  company={company}
                  mainaccounts={filteredAccounts}
                ></ExpensesReport>
              </ExpensesReportContext.Provider>
            }
          />
          <Route
            path="/customerreport"
            element={
              <CustomerReportContext.Provider
                value={{
                  state: customerReportStore,
                  dispatch: customerReportDispatch,
                }}
              >
                <CustomerReport
                  isRTL={isRTL}
                  words={words}
                  menuitem={menuitem}
                  theme={theme}
                  categories={[]}
                  company={company}
                  mainaccounts={filteredAccounts}
                ></CustomerReport>
              </CustomerReportContext.Provider>
            }
          />
          <Route
            path="/supplierreport"
            element={
              <SupplierReportContext.Provider
                value={{
                  state: supplierReportStore,
                  dispatch: supplierReportDispatch,
                }}
              >
                <SupplierReport
                  isRTL={isRTL}
                  words={words}
                  menuitem={menuitem}
                  theme={theme}
                  categories={[]}
                  company={company}
                  mainaccounts={filteredAccounts}
                ></SupplierReport>
              </SupplierReportContext.Provider>
            }
          />
        </Routes>
        <AlertWithClose
          open={packIssue}
          dispatch={dispatch}
          isRTL={isRTL}
          msg={packIssueMsg}
          onClose={() => dispatch({ type: 'closePackIssue' })}
        ></AlertWithClose>
      </main>
    </Box>
  );
};
export default Content;
