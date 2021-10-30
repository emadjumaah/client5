/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import Paper from '@material-ui/core/Paper';
import {
  SortingState,
  IntegratedSorting,
  DataTypeProvider,
  GroupingState,
  SummaryState,
  IntegratedGrouping,
  IntegratedSummary,
} from '@devexpress/dx-react-grid';
import {
  Grid,
  TableHeaderRow,
  Toolbar,
  VirtualTable,
  ExportPanel,
  TableColumnVisibility,
  ColumnChooser,
  TableGroupRow,
  TableSummaryRow,
} from '@devexpress/dx-react-grid-material-ui';
import { getRowId } from '../../common';
import {
  calculateAmount,
  covertToTimeDateDigit,
  createdAtFormatter,
  currencyFormatter,
  currencyFormatterEmpty,
  opTypeFormatter,
  taskIdFormatter,
} from '../../Shared/colorFormat';
import { Box, fade, Typography, withStyles } from '@material-ui/core';
import { getMonthlyReport } from '../../graphql';
import { useLazyQuery } from '@apollo/client';
import { GridExporter } from '@devexpress/dx-react-grid-export';
import saveAs from 'file-saver';
import { getColumns } from '../../common/columns';
import PageLayout from '../main/PageLayout';
import DateNavigatorReports from '../../components/filters/DateNavigatorReports';
import { CustomerReportContext } from '../../contexts';
import FilterSelectCkeckBox from '../../Shared/FilterSelectCkeckBox';
import { useCustomers } from '../../hooks';
import useTasks from '../../hooks/useTasks';

const styles = (theme) => ({
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

export default function CustomerReport({
  isRTL,
  words,
  menuitem,
  theme,
  isEditor,
}: any) {
  const [start, setStart] = useState<any>(null);
  const [end, setEnd] = useState<any>(null);

  const [rows, setRows] = useState([]);
  const [total, setTotal]: any = useState(null);

  const col = getColumns({ isRTL, words });

  const [columns] = useState([
    col.opTime,
    col.customer,
    // col.acc,
    // col.kaidType,
    col.opType,
    col.project,
    col.taskId,
    col.opDocNo,
    col.opAcc,
    // col.accType,
    col.amountdebit,
    col.amountcredit,
  ]);

  const [tableColumnVisibilityColumnExtensions] = useState([
    { columnName: col.opTime.name, togglingEnabled: false },
    { columnName: col.amount.name, togglingEnabled: false },
  ]);

  const [getSummary, summaryData]: any = useLazyQuery(getMonthlyReport, {
    fetchPolicy: 'cache-and-network',
  });
  const { customers } = useCustomers();
  const { tasks } = useTasks();

  const {
    state: {
      currentDate,
      currentViewName,
      endDate,
      servicevalue,
      departvalue,
      projvalue,
      resovalue,
      emplvalue,
      custvalue,
      catvalue,
      accvalue,
      group,
      groupby,
      sumcolumn,
      sort,
    },
    dispatch,
  } = useContext(CustomerReportContext);

  const currentViewNameChange = (e: any) => {
    dispatch({ type: 'setCurrentViewName', payload: e.target.value });
  };
  const currentDateChange = (curDate: any) => {
    dispatch({ type: 'setCurrentDate', payload: curDate });
  };
  const endDateChange = (curDate: any) => {
    dispatch({ type: 'setEndDate', payload: curDate });
  };

  const setCustvalueDispatch = (value: any) => {
    dispatch({ type: 'setCustvalue', payload: value ? [value] : [] });
  };

  useEffect(() => {
    const slsData = summaryData?.data?.['getMonthlyReport']?.data || [];
    const balance = summaryData?.data?.['getMonthlyReport']?.message || null;

    const amount = balance ? Number(balance) : null;

    const updatedRows =
      slsData?.length > 0
        ? slsData.map((item: any) => {
            return {
              ...item,
              amount: calculateAmount(item),
            };
          })
        : [];

    if (amount) {
      updatedRows.unshift({
        _id: Date.now(),
        accNameAr: 'رصيد افتتاحي',
        accName: 'Opening Balancee',
        amount,
      });
    }

    setRows(updatedRows);
    let sum = 0;
    updatedRows.forEach((a: any) => (sum += a.amount));
    setTotal(sum);
  }, [summaryData]);

  const getIds = (list: any) =>
    list && list?.length > 0 ? list.map((sv: any) => sv._id) : undefined;

  const fetchData = () => {
    const variables = {
      accPCode: 2,
      accountIds: getIds(accvalue),
      serviceIds: getIds(servicevalue),
      categoryIds: getIds(catvalue),
      departmentIds: getIds(departvalue),
      projectIds: getIds(projvalue),
      resourseIds: getIds(resovalue),
      employeeIds: getIds(emplvalue),
      customerIds: getIds(custvalue),
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
  }, [start, end, group, groupby, sumcolumn]);

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
  // const [totalSummaryItems] = useState([
  //   { columnName: columnName, type: "count" },
  //   { columnName: "qty", type: "count" },
  //   { columnName: "amount", type: "sum" },
  // ]);
  const grouping = [{ columnName: sumcolumn }];
  // const [grouping] = useState([{ columnName: sumcolumn }]);
  const groupSummaryItems = [
    {
      columnName: col.category.name,
      type: 'count',
      alignByColumn: true,
      // showInGroupFooter: true,
    },
    {
      columnName: 'amount',
      type: 'sum',
      // showInGroupFooter: true,
      alignByColumn: true,
    },
    {
      columnName: col.category.name,
      type: 'count',
      // alignByColumn: true,
      showInGroupFooter: true,
    },
    {
      columnName: 'amount',
      type: 'sum',
      showInGroupFooter: true,
      // alignByColumn: true,
    },
  ];

  return (
    <PageLayout
      menuitem={menuitem}
      isRTL={isRTL}
      words={words}
      isEditor={isEditor}
      theme={theme}
      refresh={refresh}
    >
      <Paper>
        {/* <Box
          style={{
            position: "absolute",
            left: isRTL ? 145 : undefined,
            right: isRTL ? undefined : 145,
            top: 65,
            zIndex: 100,
          }}
        >
          <IconButton onClick={arrangeParing} title="Print Report" size="small">
            <PrintIcon />
          </IconButton>
        </Box> */}
        <Box
          display="flex"
          style={{
            position: 'absolute',
            zIndex: 111,
            flexDirection: 'row',
            alignItems: 'center',
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
          <Box
            display="flex"
            style={{
              height: 38,
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingLeft: 100,
              paddingRight: 100,
            }}
          >
            <FilterSelectCkeckBox
              options={customers}
              value={custvalue?.[0]}
              setValue={setCustvalueDispatch}
              words={words}
              isRTL={isRTL}
              name="customer"
              nomulti
              width={300}
            ></FilterSelectCkeckBox>
          </Box>
          <Box
            display="flex"
            style={{
              alignItems: 'center',
              justifyContent: 'flex-end',
              minWidth: 120,
              marginRight: 90,
            }}
          >
            <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>
              {currencyFormatter({ value: total })}
            </Typography>
          </Box>
        </Box>
        <Paper style={{ height: window.innerHeight - 85, overflow: 'auto' }}>
          <Grid rows={rows} columns={columns} getRowId={getRowId}>
            <SortingState
              defaultSorting={sort}
              onSortingChange={(srt: any) => setSortDispatch(srt)}
            />
            {group && <GroupingState grouping={grouping} />}
            <SummaryState
              totalItems={totalSummaryItems}
              groupItems={groupSummaryItems}
            />
            {group && <IntegratedGrouping />}
            <IntegratedSummary />
            <IntegratedSorting />

            <VirtualTable
              height={window.innerHeight - 133}
              tableComponent={TableComponent}
              messages={{
                noData: isRTL ? 'لا يوجد بيانات' : 'no data',
              }}
              estimatedRowHeight={40}
            />
            <TableHeaderRow showSortingControls />
            <TableColumnVisibility
              columnExtensions={tableColumnVisibilityColumnExtensions}
              onHiddenColumnNamesChange={(hcs: string[]) => {
                const all = [...columns];
                const newcol = all.filter((a: any) => !hcs.includes(a.name));
                newcol.sort((a: any, b: any) =>
                  a.id > b.id ? 1 : b.id > a.id ? -1 : 0
                );
              }}
            />
            <DataTypeProvider
              for={['opTime']}
              formatterComponent={createdAtFormatter}
            ></DataTypeProvider>
            <DataTypeProvider
              for={['credit', 'debit']}
              formatterComponent={currencyFormatterEmpty}
            ></DataTypeProvider>
            <DataTypeProvider
              for={['opType']}
              formatterComponent={opTypeFormatter}
            ></DataTypeProvider>
            <DataTypeProvider
              for={['taskId']}
              formatterComponent={(props: any) =>
                taskIdFormatter({ ...props, tasks })
              }
            ></DataTypeProvider>
            <Toolbar />
            <ColumnChooser />
            <ExportPanel startExport={startExport} />
            {group && <TableGroupRow showColumnsWhenGrouped />}
            <TableSummaryRow
              messages={{
                sum: '',
              }}
              // messages={{
              //   sum: isRTL ? "المجموع" : "Total",
              //   count: isRTL ? "العدد" : "Count",
              // }}
            ></TableSummaryRow>
          </Grid>
        </Paper>
        <GridExporter
          ref={exporterRef}
          rows={rows}
          columns={columns}
          onSave={onSave}
        />
      </Paper>
    </PageLayout>
  );
}
