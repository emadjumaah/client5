export const actionType = {
  DEBIT: 1,
  CREDIT: 2,
};
export const accountType = {
  DEBIT: 1,
  CREDIT: 2,
};

export const closedAccounts = {
  BALNCE_SHEET: 1,
  INCOME_STATEMENT: 2,
};

export const parents = {
  CASH: 1,
  ACCOUNTS_RECEIVABLE: 2,
  INVENTORY: 3,
  OTHER_CURRENT_ASSETS: 4,
  FIXED_ASSETS: 5,
  ACCUMULATED_DEPRECIATION: 6,
  ACCOUNTS_PAYABLE: 7,
  OTHER_CURRENT_LIABILITIES: 8,
  LONG_TERM_LIABILITIES: 9,
  EQUITY_RETAINED_EARNINGS: 10,
  EQUITY_DOESNT_CLOSE: 11,
  EQUITY_GETS_CLOSED: 12,
  INCOME: 13,
  COST_OF_SALES: 14,
  EXPENCES: 15,
};
export const accountCodes = {
  1: { min: 1000, max: 1099 },
  2: { min: 1100, max: 1199 },
  3: { min: 1200, max: 1299 },
  4: { min: 1300, max: 1399 },
  5: { min: 1400, max: 1499 },
  6: { min: 1500, max: 1599 },
  7: { min: 2000, max: 2099 },
  8: { min: 2100, max: 2899 },
  9: { min: 2900, max: 2999 },
  10: { min: 3000, max: 3099 },
  11: { min: 3100, max: 3199 },
  12: { min: 3200, max: 3299 },
  13: { min: 4000, max: 4999 },
  14: { min: 5000, max: 5999 },
  15: { min: 6000, max: 6999 },
};

export const parentsAccounts = {
  CASH: {
    parentcode: parents.CASH,
    parent: "CASH",
    parentAr: "النقدية",
    accType: accountType.DEBIT,
    closedAcc: closedAccounts.BALNCE_SHEET,
  },
  ACCOUNTS_RECEIVABLE: {
    parentcode: parents.ACCOUNTS_RECEIVABLE,
    parent: "ACCOUNTS RECEIVABLE",
    parentAr: "المدينون",
    accType: accountType.DEBIT,
    closedAcc: closedAccounts.BALNCE_SHEET,
  },
  INVENTORY: {
    parentcode: parents.INVENTORY,
    parent: "INVENTORY",
    parentAr: "المخزون",
    accType: accountType.DEBIT,
    closedAcc: closedAccounts.BALNCE_SHEET,
  },
  OTHER_CURRENT_ASSETS: {
    parentcode: parents.OTHER_CURRENT_ASSETS,
    parent: "OTHER CURRENT ASSETS",
    parentAr: "حسابات مدينة أخرى",
    accType: accountType.DEBIT,
    closedAcc: closedAccounts.BALNCE_SHEET,
  },
  FIXED_ASSETS: {
    parentcode: parents.FIXED_ASSETS,
    parent: "FIXED ASSETS",
    parentAr: "الأصول الثابتة",
    accType: accountType.DEBIT,
    closedAcc: closedAccounts.BALNCE_SHEET,
  },
  ACCUMULATED_DEPRECIATION: {
    parentcode: parents.ACCUMULATED_DEPRECIATION,
    parent: "ACCUMULATED DEPRECIATION",
    parentAr: "الاهلاك المجمع",
    accType: accountType.CREDIT,
    closedAcc: closedAccounts.BALNCE_SHEET,
  },
  ACCOUNTS_PAYABLE: {
    parentcode: parents.ACCOUNTS_PAYABLE,
    parent: "ACCOUNTS PAYABLE",
    parentAr: "الدائنون",
    accType: accountType.CREDIT,
    closedAcc: closedAccounts.BALNCE_SHEET,
  },
  OTHER_CURRENT_LIABILITIES: {
    parentcode: parents.OTHER_CURRENT_LIABILITIES,
    parent: "OTHER CURRENT LIABILITIES",
    parentAr: "حسابات دائنة أخرى",
    accType: accountType.CREDIT,
    closedAcc: closedAccounts.BALNCE_SHEET,
  },
  LONG_TERM_LIABILITIES: {
    parentcode: parents.LONG_TERM_LIABILITIES,
    parent: "LONG TERM LIABILITIES",
    parentAr: "قروض طويلة الاجل",
    accType: accountType.CREDIT,
    closedAcc: closedAccounts.BALNCE_SHEET,
  },
  EQUITY_RETAINED_EARNINGS: {
    parentcode: parents.EQUITY_RETAINED_EARNINGS,
    parent: "EQUITY RETAINED EARNINGS",
    parentAr: "حقوق الملكية - الأرباح المحتجزة",
    accType: accountType.CREDIT,
    closedAcc: closedAccounts.BALNCE_SHEET,
  },
  EQUITY_DOESNT_CLOSE: {
    parentcode: parents.EQUITY_DOESNT_CLOSE,
    parent: "EQUITY DOESNT CLOSE",
    parentAr: "حقوق الملكية - غير المغلقة",
    accType: accountType.CREDIT,
    closedAcc: closedAccounts.BALNCE_SHEET,
  },
  EQUITY_GETS_CLOSED: {
    parentcode: parents.EQUITY_GETS_CLOSED,
    parent: "EQUITY GETS CLOSED",
    parentAr: "حقوق الملكية - المغلقة",
    accType: accountType.CREDIT,
    closedAcc: closedAccounts.BALNCE_SHEET,
  },
  INCOME: {
    parentcode: parents.INCOME,
    parent: "INCOME",
    parentAr: "الإيرادات",
    accType: accountType.CREDIT,
    closedAcc: closedAccounts.INCOME_STATEMENT,
  },
  COST_OF_SALES: {
    parentcode: parents.COST_OF_SALES,
    parent: "COST OF SALES",
    parentAr: "تكلفة المبيعات",
    accType: accountType.DEBIT,
    closedAcc: closedAccounts.INCOME_STATEMENT,
  },
  EXPENCES: {
    parentcode: parents.EXPENCES,
    parent: "EXPENCES",
    parentAr: "المصاريف",
    accType: accountType.DEBIT,
    closedAcc: closedAccounts.INCOME_STATEMENT,
  },
};

export const parentsAccountsList = [
  { ...parentsAccounts.CASH },
  { ...parentsAccounts.ACCOUNTS_RECEIVABLE },
  { ...parentsAccounts.INVENTORY },
  { ...parentsAccounts.OTHER_CURRENT_ASSETS },
  { ...parentsAccounts.FIXED_ASSETS },
  { ...parentsAccounts.ACCUMULATED_DEPRECIATION },
  { ...parentsAccounts.ACCOUNTS_PAYABLE },
  { ...parentsAccounts.OTHER_CURRENT_LIABILITIES },
  { ...parentsAccounts.LONG_TERM_LIABILITIES },
  { ...parentsAccounts.EQUITY_RETAINED_EARNINGS },
  { ...parentsAccounts.EQUITY_DOESNT_CLOSE },
  { ...parentsAccounts.EQUITY_GETS_CLOSED },
  { ...parentsAccounts.INCOME },
  { ...parentsAccounts.COST_OF_SALES },
  { ...parentsAccounts.EXPENCES },
];

export const parentsBasicAccountsList = [
  { ...parentsAccounts.CASH },
  { ...parentsAccounts.OTHER_CURRENT_LIABILITIES },
];
export const parentsSalesAccountsList = [
  { ...parentsAccounts.ACCOUNTS_RECEIVABLE },
  { ...parentsAccounts.COST_OF_SALES },
  { ...parentsAccounts.INCOME },
];

export const parentsPurAccountsList = [{ ...parentsAccounts.ACCOUNTS_PAYABLE }];
export const parentsExpAccountsList = [{ ...parentsAccounts.EXPENCES }];
export const parentsInvAccountsList = [{ ...parentsAccounts.INVENTORY }];

export const parentsGeneralAccountsList = [
  { ...parentsAccounts.OTHER_CURRENT_ASSETS },
  { ...parentsAccounts.FIXED_ASSETS },
  { ...parentsAccounts.ACCUMULATED_DEPRECIATION },
  { ...parentsAccounts.LONG_TERM_LIABILITIES },
  { ...parentsAccounts.EQUITY_RETAINED_EARNINGS },
  { ...parentsAccounts.EQUITY_DOESNT_CLOSE },
  { ...parentsAccounts.EQUITY_GETS_CLOSED },
];

export const accountCode = {
  cash_on_hand: 1000,
  card: 1010, //
  bank: 1020, //
  accounts_receivable: 1100,
  inventory: 1200,
  accounts_payable: 2000,

  sales_income: 4000,
  purchase_discount: 4100,
  purchase_returns: 4200,
  sales_income_other: 4500, //

  accrued_expenses: 2100,
  partner_current_acc: 2800,
  cost_of_sales: 5000,
  purchase_nonstock: 5050,
  sales_discount: 5100,
  sales_returns: 5200,
  cost_of_sales_other: 5500, //

  expenses_legal: 6000,
  expenses_salary: 6100,
  expenses_rent: 6200, //
  expenses_other: 6500, //

  other_current_assets: 1300,
  fixed_assets: 1400,
  accumulated_depreciation: 1500,
  long_term_liabilities: 2900,
  retained_earnings: 3000,
  paid_in_capital: 3100,
  dividends_paid: 3200,
};

export const accounts = {
  cash: {
    code: accountCode.cash_on_hand,
    name: "Cash",
    nameAr: "الصندوق",
    ...parentsAccounts.CASH,
  },
  card: {
    code: accountCode.card,
    name: "Card",
    nameAr: "بطاقة",
    ...parentsAccounts.CASH,
  },
  bank: {
    code: accountCode.bank,
    name: "Bank",
    nameAr: "البنك",
    ...parentsAccounts.CASH,
  },
  accounts_receivable: {
    code: accountCode.accounts_receivable,
    name: "Accounts Receivable",
    nameAr: "المدينون",
    ...parentsAccounts.ACCOUNTS_RECEIVABLE,
  },
  inventory: {
    code: accountCode.inventory,
    name: "inventory",
    nameAr: "المخزون",
    ...parentsAccounts.INVENTORY,
  },
  accounts_payable: {
    code: accountCode.accounts_payable,
    name: "Accounts Payable",
    nameAr: "الدائنون",
    ...parentsAccounts.ACCOUNTS_PAYABLE,
  },
  sales_income: {
    code: accountCode.sales_income,
    name: "Sales Income",
    nameAr: "ايراد المبيعات",
    ...parentsAccounts.INCOME,
  },
  purchase_discount: {
    code: accountCode.purchase_discount,
    name: "Purchase Discount",
    nameAr: "خصم المشتريات",
    ...parentsAccounts.INCOME,
  },
  purchase_returns: {
    code: accountCode.purchase_returns,
    name: "Purchase Returns",
    nameAr: "مردودات المشتريات",
    ...parentsAccounts.INCOME,
  },
  sales_income_other: {
    code: accountCode.sales_income_other,
    name: "Other Sales Income",
    nameAr: "إيرادات اخرى",
    ...parentsAccounts.INCOME,
  },
  partner_current_acc: {
    code: accountCode.partner_current_acc,
    name: "Partner Current Account",
    nameAr: "حساب جاري - الشريك",
    ...parentsAccounts.OTHER_CURRENT_LIABILITIES,
  },
  accrued_expenses: {
    code: accountCode.accrued_expenses,
    name: "Accrued Expenses",
    nameAr: "النفقات المستحقة",
    ...parentsAccounts.OTHER_CURRENT_LIABILITIES,
  },
  cost_of_sales: {
    code: accountCode.cost_of_sales,
    name: "Cost Of Sales",
    nameAr: "تكلفة المبيعات",
    ...parentsAccounts.COST_OF_SALES,
  },
  purchase_nonstock: {
    code: accountCode.purchase_nonstock,
    name: "Purchase",
    nameAr: "المشتريات",
    ...parentsAccounts.COST_OF_SALES,
  },
  sales_discount: {
    code: accountCode.sales_discount,
    name: "Sales Discount",
    nameAr: "خصم المبيعات",
    ...parentsAccounts.COST_OF_SALES,
  },
  sales_returns: {
    code: accountCode.sales_returns,
    name: "Sales Returns",
    nameAr: "مردودات المبيعات",
    ...parentsAccounts.COST_OF_SALES,
  },
  cost_of_sales_other: {
    code: accountCode.cost_of_sales_other,
    name: "Other Cost Of sales",
    nameAr: "تكاليف مبيعات اخرى",
    ...parentsAccounts.COST_OF_SALES,
  },
  expenses_legal: {
    code: accountCode.expenses_legal,
    name: "Legal Expenses",
    nameAr: "مصاريف قانونية",
    ...parentsAccounts.EXPENCES,
  },
  expenses_salary: {
    code: accountCode.expenses_salary,
    name: "Salary Expenses",
    nameAr: "مصاريف الرواتب",
    ...parentsAccounts.EXPENCES,
  },
  expenses_rent: {
    code: accountCode.expenses_rent,
    name: "Rent Expenses",
    nameAr: "مصاريف الإيجار",
    ...parentsAccounts.EXPENCES,
  },
  expenses_other: {
    code: accountCode.expenses_other,
    name: "Other Expenses",
    nameAr: "مصاريف اخرى",
    ...parentsAccounts.EXPENCES,
  },
  other_current_assets: {
    code: accountCode.other_current_assets,
    name: "Prepaid Expenses",
    nameAr: "مصاريف مقدمة",
    ...parentsAccounts.OTHER_CURRENT_ASSETS,
  },
  fixed_assets: {
    code: accountCode.fixed_assets,
    name: "Property and Equipment",
    nameAr: "ممتلكات ومعدات",
    ...parentsAccounts.FIXED_ASSETS,
  },
  accumulated_depreciation: {
    code: accountCode.accumulated_depreciation,
    name: "Accum. Depr. - Property and Equipment",
    nameAr: "مجمع اهلاك الممتلكات المعدات",
    ...parentsAccounts.ACCUMULATED_DEPRECIATION,
  },
  long_term_liabilities: {
    code: accountCode.long_term_liabilities,
    name: "Long Term Liabilities",
    nameAr: "قروض طويلة الاجل",
    ...parentsAccounts.LONG_TERM_LIABILITIES,
  },
  retained_earnings: {
    code: accountCode.retained_earnings,
    name: "Retained Earnings",
    nameAr: "الأرباح المحتجزة",
    ...parentsAccounts.EQUITY_RETAINED_EARNINGS,
  },
  paid_in_capital: {
    code: accountCode.paid_in_capital,
    name: "Paid In Capital",
    nameAr: "رأس المال المدفوع",
    ...parentsAccounts.EQUITY_DOESNT_CLOSE,
  },
  dividends_paid: {
    code: accountCode.dividends_paid,
    name: "Dividends Paid",
    nameAr: "الأرباح الموزعة",
    ...parentsAccounts.EQUITY_GETS_CLOSED,
  },
};

export const initAccounts = [
  { ...accounts.cash },
  { ...accounts.card },
  { ...accounts.bank },
  { ...accounts.accounts_receivable },
  { ...accounts.inventory },
  { ...accounts.accounts_payable },
  { ...accounts.sales_income },
  { ...accounts.sales_discount },
  { ...accounts.sales_returns },
  { ...accounts.sales_income_other },
  { ...accounts.accrued_expenses },
  { ...accounts.partner_current_acc },
  { ...accounts.cost_of_sales },
  { ...accounts.purchase_nonstock },
  { ...accounts.purchase_discount },
  { ...accounts.purchase_returns },
  { ...accounts.cost_of_sales_other },
  { ...accounts.expenses_legal },
  { ...accounts.expenses_salary },
  { ...accounts.expenses_rent },
  { ...accounts.expenses_other },
  { ...accounts.other_current_assets },
  { ...accounts.fixed_assets },
  { ...accounts.accumulated_depreciation },
  { ...accounts.long_term_liabilities },
  { ...accounts.retained_earnings },
  { ...accounts.paid_in_capital },
  { ...accounts.dividends_paid },
];

// basic_income
export const initBasicAccounts = [
  { ...accounts.cash },
  { ...accounts.card },
  { ...accounts.bank },
  { ...accounts.partner_current_acc },
];
// sales_income

export const initSalesAccounts = [
  { ...accounts.accounts_receivable },
  { ...accounts.sales_income },
  { ...accounts.sales_discount },
  { ...accounts.sales_returns },
  { ...accounts.sales_income_other },
];

// cost_of_sales
export const initPurAccounts = [
  { ...accounts.accounts_payable },
  { ...accounts.cost_of_sales },
  { ...accounts.purchase_nonstock },
  { ...accounts.purchase_discount },
  { ...accounts.purchase_returns },
  { ...accounts.cost_of_sales_other },
];

// Exprense
export const initExpAccounts = [
  { ...accounts.expenses_legal },
  { ...accounts.expenses_salary },
  { ...accounts.expenses_rent },
  { ...accounts.expenses_other },
];

// inventory
export const initInvAccounts = [{ ...accounts.inventory }];

// General Accounting
export const initGeneralAccounts = [
  { ...accounts.accrued_expenses },
  { ...accounts.other_current_assets },
  { ...accounts.fixed_assets },
  { ...accounts.accumulated_depreciation },
  { ...accounts.long_term_liabilities },
  { ...accounts.retained_earnings },
  { ...accounts.paid_in_capital },
  { ...accounts.dividends_paid },
];
