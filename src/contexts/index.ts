import CalendarContext from "./calendar";
import { calendarReducer, initCalendar } from "./calendar/calendarReducer";
import EventsContext from "./events";
import { eventsReducer, initEventsContext } from "./events/eventsReducer";
import FinanceContext from "./finance";
import { financeReducer, initFinanceContext } from "./finance/financeReducer";
import ReceiptContext from "./receipt";
import { receiptReducer, initReceiptContext } from "./receipt/receiptReducer";
import ExpensesReportContext from "./expensesReport";
import {
  initExpensesReportContext,
  expensesReportReducer,
} from "./expensesReport/expensesReportReducer";
import CustomerReportContext from "./customerReport";
import {
  initCustomerReportContext,
  customerReportReducer,
} from "./customerReport/customerReportReducer";
import ExpensesContext from "./expenses";
import {
  expensesReducer,
  initExpensesContext,
} from "./expenses/expensesReducer";
import GlobalContext from "./global";
import SalesContext from "./sales";
import { initSalesContext, salesReducer } from "./sales/salesReducer";
import PurchaseContext from "./purchase";
import {
  initPurchaseContext,
  purchaseReducer,
} from "./purchase/purchaseReducer";
import SalesReportContext from "./salesreport";
import {
  initSalesReportContext,
  salesReportReducer,
} from "./salesreport/salesReducer";
import PurchaseReportContext from "./purchasereport";
import {
  initPurchaseReportContext,
  purchaseReportReducer,
} from "./purchasereport/purchaseReducer";

export {
  GlobalContext,
  initCalendar,
  calendarReducer,
  CalendarContext,
  initEventsContext,
  eventsReducer,
  EventsContext,
  initSalesContext,
  salesReducer,
  SalesContext,
  initSalesReportContext,
  salesReportReducer,
  SalesReportContext,
  initFinanceContext,
  financeReducer,
  FinanceContext,
  PurchaseContext,
  initPurchaseContext,
  purchaseReducer,
  ExpensesContext,
  expensesReducer,
  initExpensesContext,
  PurchaseReportContext,
  initPurchaseReportContext,
  purchaseReportReducer,
  ExpensesReportContext,
  initExpensesReportContext,
  expensesReportReducer,
  CustomerReportContext,
  initCustomerReportContext,
  customerReportReducer,
  ReceiptContext,
  receiptReducer,
  initReceiptContext,
};
