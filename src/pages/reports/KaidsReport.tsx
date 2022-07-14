/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  SortingState,
  IntegratedSorting,
  DataTypeProvider,
  SummaryState,
  IntegratedSummary,
  SearchState,
  IntegratedFiltering,
} from '@devexpress/dx-react-grid';
import {
  Grid,
  TableHeaderRow,
  Toolbar,
  VirtualTable,
  ExportPanel,
  TableColumnVisibility,
  ColumnChooser,
  TableSummaryRow,
  SearchPanel,
} from '@devexpress/dx-react-grid-material-ui';
import { getRowId, updateOpDocRefNumbers } from '../../common';
import {
  calculateAmount,
  covertToTimeDateDigit,
  createdAtFormatter,
  currencyFormatter,
  moneyFormat,
  opTypeFormatter,
} from '../../Shared/colorFormat';
import {
  Box,
  Checkbox,
  fade,
  FormControlLabel,
  IconButton,
  Typography,
  withStyles,
  Grid as MGrid,
  Paper,
} from '@material-ui/core';
import { useLazyQuery } from '@apollo/client';
import { GridExporter } from '@devexpress/dx-react-grid-export';
import saveAs from 'file-saver';
import { getColumns } from '../../common/columns';
import PageLayout from '../main/PageLayout';
import DateNavigatorReports from '../../components/filters/DateNavigatorReports';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { FinanceReportPrint } from '../../print/FinanceReportPrint';
import { useReactToPrint } from 'react-to-print';
import PrintIcon from '@material-ui/icons/Print';
import {
  useCustomers,
  useExpenseItems,
  useProducts,
  useServices,
  useSuppliers,
  useTemplate,
} from '../../hooks';
import { SearchTable } from '../../components';
import { KaidContext } from '../../contexts/managment';
import getKaidsReport from '../../graphql/query/getKaidsReport';
import KaidReportFilter from '../../Shared/KaidReportFilter';
import useDepartments from '../../hooks/useDepartments';
import useEmployees from '../../hooks/useEmployees';
import useResourses from '../../hooks/useResourses';
import useProjects from '../../hooks/useProjects';
import useTasks from '../../hooks/useTasks';

const styles = (theme: any) => ({
  tableStriped: {
    '& tbody tr:nth-of-type(odd)': {
      backgroundColor: fade(theme.palette.primary.main, 0.05),
    },
  },
});

const TableComponentBase = ({ classes, ...restProps }) => (
  <VirtualTable.Table {...restProps} className={classes.tableStriped} />
);
export const TableComponent = withStyles(styles, { name: 'TableComponent' })(
  TableComponentBase
);

export default function KaidsReport({
  isRTL,
  words,
  menuitem,
  mainaccounts,
  accounts,
  company,
  theme,
}: any) {
  const [start, setStart] = useState<any>(null);
  const [end, setEnd] = useState<any>(null);
  const [rows, setRows] = useState([]);
  const [isRaseed, setIsRaseed] = useState(true);

  const col = getColumns({ isRTL, words });

  const { tempoptions } = useTemplate();
  const [columns] = useState(
    tempoptions?.noTsk
      ? [
          col.opTime,
          col.opType,
          col.opDocNo,
          col.refNo,
          col.acc,
          col.opAcc,
          col.employee,
          col.department,
          col.customer,
          col.supplier,
          col.amount,
          col.amountdebit,
          col.amountcredit,
          col.rased,
        ]
      : [
          col.opTime,
          col.opType,
          col.opDocNo,
          col.refNo,
          col.acc,
          col.opAcc,
          col.employee,
          col.resourse,
          col.department,
          col.contract,
          col.customer,
          col.supplier,
          col.amount,
          col.amountdebit,
          col.amountcredit,
          col.rased,
        ]
  );

  const [tableColumnVisibilityColumnExtensions] = useState([
    { columnName: col.opTime.name, togglingEnabled: false },
  ]);

  const [getSummary, summaryData]: any = useLazyQuery(getKaidsReport, {
    fetchPolicy: 'cache-and-network',
  });

  const { customers } = useCustomers();
  const { departments } = useDepartments();
  const { employees } = useEmployees();
  const { resourses } = useResourses();
  const { projects } = useProjects();
  const { tasks } = useTasks();
  const { services } = useServices();
  const { products } = useProducts();
  const { expenseItems } = useExpenseItems();
  const { suppliers } = useSuppliers();

  const {
    state: {
      currentDate,
      currentViewName,
      endDate,
      optypevalue,
      itemtypevalue,
      itemvalue,
      projvalue,
      departvalue,
      emplvalue,
      resovalue,
      custvalue,
      suppvalue,
      taskvalue,
      accvalue,
      pcodevalue,
      sort,
    },
    dispatch,
  } = useContext(KaidContext);
  const { height } = useWindowDimensions();
  const currentViewNameChange = (e: any) => {
    dispatch({ type: 'setCurrentViewName', payload: e.target.value });
  };
  const currentDateChange = (curDate: any) => {
    dispatch({ type: 'setCurrentDate', payload: curDate });
  };
  const endDateChange = (curDate: any) => {
    dispatch({ type: 'setEndDate', payload: curDate });
  };
  const setDepartvalueDispatch = (value: any) => {
    dispatch({ type: 'setDepartvalue', payload: value });
  };
  const setProjvalueDispatch = (value: any) => {
    dispatch({ type: 'setProjvalue', payload: value });
  };
  const setEmplvalueDispatch = (value: any) => {
    dispatch({ type: 'setEmplvalue', payload: value });
  };
  const setResovalueDispatch = (value: any) => {
    dispatch({ type: 'setResovalue', payload: value });
  };
  const setCustvalueDispatch = (value: any) => {
    dispatch({ type: 'setCustvalue', payload: value });
  };
  const setSuppvalueDispatch = (value: any) => {
    dispatch({ type: 'setSuppvalue', payload: value });
  };
  const setTaskvalueDispatch = (value: any) => {
    dispatch({ type: 'setTaskvalue', payload: value });
  };
  const setOptypevalueDispatch = (value: any) => {
    dispatch({ type: 'setOptypevalue', payload: value });
  };
  const setItemtypevalueDispatch = (value: any) => {
    dispatch({ type: 'setItemtypevalue', payload: value });
  };
  const setItemvalueDispatch = (value: any) => {
    dispatch({ type: 'setItemvalue', payload: value });
  };
  const setAccountvalueDispatch = (value: any) => {
    dispatch({ type: 'setAccvalue', payload: value });
  };
  const setPcodevalueDispatch = (value: any) => {
    dispatch({ type: 'setPcodevalue', payload: value });
  };

  useEffect(() => {
    const slsData = summaryData?.data?.['getKaidsReport']?.data || [];
    const balance = summaryData?.data?.['getKaidsReport']?.message || null;
    const updatedRows = slsData.map((x: any) => x);
    const amount = isRaseed && balance ? JSON.parse(balance) : null;

    if (amount !== null) {
      const { credit, debit } = amount;

      if (credit || debit) {
        const am = debit - credit;
        updatedRows.unshift({
          _id: Date.now(),
          opTime: start,
          opType: 94,
          debit: am > 0 ? am : 0,
          credit: am < 0 ? am : 0,
          amount: am,
        });
      }
    }

    let rased = 0;
    const updatedRows2 =
      updatedRows?.length > 0
        ? updatedRows.map((item: any) => {
            const rowRased = item.debit ? item.debit : -item.credit;
            rased = rased + rowRased;
            return {
              ...item,
              amount: calculateAmount(item),
              rased,
            };
          })
        : [];

    const rdata = updateOpDocRefNumbers(updatedRows2);

    setRows(rdata);
  }, [summaryData, isRaseed]);

  const getIds = (list: any) =>
    list && list?.length > 0 ? list.map((sv: any) => sv._id) : undefined;

  const getValues = (list: any) =>
    list && list?.length > 0 ? list.map((sv: any) => sv.value) : undefined;

  const fetchData = () => {
    const variables = {
      opTypes: getValues(optypevalue),
      itemTypes: getValues(itemtypevalue),
      itemIds: getIds(itemvalue),
      accountIds: getIds(accvalue),
      parentCodes: getValues(pcodevalue),
      projectIds: getIds(projvalue),
      contractIds: getIds(taskvalue),
      departmentIds: getIds(departvalue),
      employeeIds: getIds(emplvalue),
      resourseIds: getIds(resovalue),
      customerIds: getIds(custvalue),
      supplierIds: getIds(suppvalue),
      start: start ? start.setHours(0, 0, 0, 0) : undefined,
      end: end
        ? end.setHours(23, 59, 59, 999)
        : new Date().setHours(23, 59, 59, 999),
    };

    getSummary({
      variables,
    });
  };

  useEffect(() => {
    fetchData();
  }, [
    start,
    end,
    optypevalue,
    itemtypevalue,
    itemvalue,
    projvalue,
    taskvalue,
    departvalue,
    emplvalue,
    resovalue,
    custvalue,
    suppvalue,
    accvalue,
    pcodevalue,
  ]);

  const exporterRef: any = useRef(null);

  const startExport = useCallback(() => {
    exporterRef.current.exportGrid();
  }, [exporterRef]);

  const onSave = (workbook: any) => {
    workbook.xlsx.writeBuffer().then((buffer: any) => {
      const now = new Date();
      const name = `finance-report-${covertToTimeDateDigit(now)}`;
      saveAs(
        new Blob([buffer], { type: 'application/octet-stream' }),
        `${name}.xlsx`
      );
    });
  };

  const refresh = () => {
    summaryData?.refetch();
  };

  const setSortDispatch = (value: any) => {
    dispatch({ type: 'setSort', payload: value });
  };

  const totalSummaryItems = [
    { columnName: 'credit', type: 'sum' },
    { columnName: 'debit', type: 'sum' },
  ];
  const componentRef: any = useRef();

  const print = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Finance Report`,
    removeAfterPrint: true,
  });

  return (
    <PageLayout
      menuitem={menuitem}
      isRTL={isRTL}
      words={words}
      theme={theme}
      refresh={refresh}
    >
      <Box
        style={{
          height: height - 50,
          overflow: 'auto',
          backgroundColor: '#fff',
        }}
      >
        {(accvalue?.length > 0 || pcodevalue?.length > 0) && (
          <Box
            style={{
              position: 'absolute',
              left: isRTL ? 360 : undefined,
              right: isRTL ? undefined : 360,
              top: 51,
              zIndex: 112,
            }}
          >
            <IconButton onClick={print} title="Print Report" size="medium">
              <PrintIcon />
            </IconButton>
          </Box>
        )}
        <Box
          display="flex"
          style={{
            position: 'absolute',
            zIndex: 111,
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 8,
            marginLeft: 10,
            marginRight: 10,
          }}
        >
          <DateNavigatorReports
            setStart={setStart}
            setEnd={setEnd}
            currentDate={currentDate}
            currentDateChange={currentDateChange}
            currentViewName={currentViewName}
            currentViewNameChange={currentViewNameChange}
            endDate={endDate}
            endDateChange={endDateChange}
            views={[1, 7, 30, 365, 1000]}
            isRTL={isRTL}
            words={words}
            theme={theme}
          ></DateNavigatorReports>
          <Box style={{ marginLeft: 10, marginRight: 10 }}>
            <FormControlLabel
              control={
                <Checkbox
                  style={{ padding: 7 }}
                  checked={isRaseed}
                  onChange={() => setIsRaseed(!isRaseed)}
                  color="primary"
                />
              }
              label={
                <Typography
                  style={{ color: theme.palette.primary.main }}
                  variant="subtitle2"
                >
                  {isRTL ? 'رصيد افتتاحي' : 'Opening Balance'}
                </Typography>
              }
              style={{ fontSize: 14 }}
            />
          </Box>
        </Box>
        <Box
          style={{
            position: 'absolute',
            zIndex: 111,
            right: isRTL ? undefined : 100,
            left: isRTL ? 100 : undefined,
            top: 15,
          }}
        >
          <Typography style={{ fontWeight: 'bold', color: '#403795' }}>
            {isRTL ? 'الرصيد' : 'Balance'}:{' '}
            {moneyFormat(rows?.[rows?.length - 1]?.rased)}
          </Typography>
        </Box>
        <MGrid container spacing={0}>
          <MGrid item xs={10}>
            <Paper elevation={3} style={{ margin: 10 }}>
              <Grid rows={rows} columns={columns} getRowId={getRowId}>
                <SortingState
                  defaultSorting={sort}
                  onSortingChange={(srt: any) => setSortDispatch(srt)}
                />
                <SummaryState totalItems={totalSummaryItems} />
                <IntegratedSummary />
                <IntegratedSorting />
                <SearchState />
                <IntegratedFiltering />
                <VirtualTable
                  height={height - 120}
                  tableComponent={TableComponent}
                  messages={{
                    noData: isRTL ? 'لا يوجد بيانات' : 'no data',
                  }}
                  estimatedRowHeight={30}
                />
                <TableHeaderRow
                  showSortingControls
                  titleComponent={({ children }) => {
                    return (
                      <Typography style={{ fontSize: 14, fontWeight: 'bold' }}>
                        {children}
                      </Typography>
                    );
                  }}
                />
                <TableColumnVisibility
                  columnExtensions={tableColumnVisibilityColumnExtensions}
                  defaultHiddenColumnNames={[
                    col.amount.name,
                    col.rased.name,
                    col.contract.name,
                    col.customer.name,
                    col.supplier.name,
                    col.employee.name,
                    col.resourse.name,
                    col.department.name,
                    col.refNo.name,
                  ]}
                />

                <DataTypeProvider
                  for={['opTime']}
                  formatterComponent={createdAtFormatter}
                ></DataTypeProvider>
                <DataTypeProvider
                  for={['credit', 'debit', 'rased']}
                  formatterComponent={currencyFormatter}
                ></DataTypeProvider>
                <DataTypeProvider
                  for={['opType']}
                  formatterComponent={opTypeFormatter}
                ></DataTypeProvider>
                <Toolbar />
                <ColumnChooser />
                <SearchPanel
                  inputComponent={(props: any) => {
                    return <SearchTable isRTL={isRTL} {...props}></SearchTable>;
                  }}
                />
                <ExportPanel startExport={startExport} />
                <TableSummaryRow
                  messages={{
                    sum: isRTL ? 'المجموع' : 'Total',
                    count: isRTL ? 'العدد' : 'Count',
                  }}
                ></TableSummaryRow>
              </Grid>
            </Paper>
          </MGrid>
          <MGrid item xs={2}>
            <KaidReportFilter
              accounts={accounts}
              mainaccounts={mainaccounts}
              services={services}
              products={products}
              expenseItems={expenseItems}
              departments={departments}
              setDepartvalue={setDepartvalueDispatch}
              employees={employees}
              setEmplvalue={setEmplvalueDispatch}
              resourses={resourses}
              setResovalue={setResovalueDispatch}
              projects={projects}
              setProjvalue={setProjvalueDispatch}
              customers={customers}
              setCustvalue={setCustvalueDispatch}
              suppliers={suppliers}
              setSuppvalue={setSuppvalueDispatch}
              tasks={tasks}
              setTaskvalue={setTaskvalueDispatch}
              setOptypevalue={setOptypevalueDispatch}
              setItemtypevalue={setItemtypevalueDispatch}
              setItemvalue={setItemvalueDispatch}
              setAccountvalue={setAccountvalueDispatch}
              setPcodevalue={setPcodevalueDispatch}
              pcodevalue={pcodevalue}
              accvalue={accvalue}
              optypevalue={optypevalue}
              itemtypevalue={itemtypevalue}
              itemvalue={itemvalue}
              emplvalue={emplvalue}
              resovalue={resovalue}
              departvalue={departvalue}
              projvalue={projvalue}
              taskvalue={taskvalue}
              custvalue={custvalue}
              suppvalue={suppvalue}
              words={words}
              isRTL={isRTL}
            ></KaidReportFilter>
          </MGrid>
        </MGrid>

        <GridExporter
          ref={exporterRef}
          rows={rows}
          columns={columns}
          onSave={onSave}
        />
        <Box>
          <div style={{ display: 'none' }}>
            <FinanceReportPrint
              company={company}
              items={rows}
              columns={columns}
              ref={componentRef}
              isRTL={isRTL}
              account={accvalue?.[0]}
              start={start}
              end={end}
            />
          </div>
        </Box>
      </Box>
    </PageLayout>
  );
}
