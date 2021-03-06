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
  GroupingState,
  SummaryState,
  IntegratedGrouping,
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
  TableGroupRow,
  TableSummaryRow,
  SearchPanel,
} from '@devexpress/dx-react-grid-material-ui';
import { getRowId } from '../../common';
import {
  calculateAmount,
  covertToTimeDateDigit,
  createdAtFormatter,
  currencyFormatter,
  moneyFormat,
  opTypeFormatter,
} from '../../Shared/colorFormat';
import { Box, fade, Typography, withStyles } from '@material-ui/core';
import { getMonthlyReport } from '../../graphql';
import { useLazyQuery } from '@apollo/client';
import { GridExporter } from '@devexpress/dx-react-grid-export';
import saveAs from 'file-saver';
import { getColumns } from '../../common/columns';
import PageLayout from '../main/PageLayout';
import DateNavigatorReports from '../../components/filters/DateNavigatorReports';
import { ExpensesReportContext } from '../../contexts';
import FilterSelectCkeckBox from '../../Shared/FilterSelectCkeckBox';
import useTasks from '../../hooks/useTasks';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import useProjects from '../../hooks/useProjects';
import { useTemplate } from '../../hooks';
import { SearchTable } from '../../components';

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

export default function ExpensesReport({
  isRTL,
  words,
  menuitem,
  accounts,
  theme,
}: any) {
  const expensesAccounts = accounts?.filter(
    (acc: any) => acc.parentcode === 15
  );
  const [start, setStart] = useState<any>(null);
  const [end, setEnd] = useState<any>(null);

  const [rows, setRows] = useState([]);
  const [total, setTotal]: any = useState(null);

  const col = getColumns({ isRTL, words });

  const { tempoptions, tempwords } = useTemplate();
  const [columns] = useState(
    tempoptions?.noTsk
      ? [
          col.opTime,
          col.opDocNo,
          col.acc,
          col.opAcc,
          col.desc,
          col.opType,
          col.amount,
        ]
      : [
          col.opTime,
          col.opDocNo,
          col.acc,
          col.opAcc,
          col.contract,
          col.customer,
          col.desc,
          col.opType,
          col.amount,
        ]
  );

  const [tableColumnVisibilityColumnExtensions] = useState([
    { columnName: col.opTime.name, togglingEnabled: false },
    { columnName: col.amount.name, togglingEnabled: false },
  ]);

  const [getSummary, summaryData]: any = useLazyQuery(getMonthlyReport, {
    fetchPolicy: 'cache-and-network',
  });

  const {
    state: {
      currentDate,
      currentViewName,
      endDate,
      servicevalue,
      departvalue,
      emplvalue,
      custvalue,
      catvalue,
      accvalue,
      projvalue,
      taskvalue,
      group,
      groupby,
      sumcolumn,
      sort,
    },
    dispatch,
  } = useContext(ExpensesReportContext);
  const { tasks } = useTasks();
  const { height } = useWindowDimensions();
  const { projects } = useProjects();

  const currentViewNameChange = (e: any) => {
    dispatch({ type: 'setCurrentViewName', payload: e.target.value });
  };
  const currentDateChange = (curDate: any) => {
    dispatch({ type: 'setCurrentDate', payload: curDate });
  };
  const endDateChange = (curDate: any) => {
    dispatch({ type: 'setEndDate', payload: curDate });
  };

  const setAccvalueDispatch = (value: any) => {
    dispatch({ type: 'setAccvalue', payload: value ? [value] : [] });
  };
  const setTaskvalueDispatch = (value: any) => {
    dispatch({ type: 'setTaskvalue', payload: value ? [value] : [] });
  };
  const setProjvalueDispatch = (value: any) => {
    dispatch({ type: 'setProjvalue', payload: value ? [value] : [] });
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
        accNameAr: '???????? ??????????????',
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
      accPCode: 15,
      accountIds: getIds(accvalue),
      serviceIds: getIds(servicevalue),
      categoryIds: getIds(catvalue),
      departmentIds: getIds(departvalue),
      employeeIds: getIds(emplvalue),
      customerIds: getIds(custvalue),
      contractIds: getIds(taskvalue),
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
  }, [start, end, group, groupby, sumcolumn, accvalue, taskvalue]);

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

  //  const arrangeParing = () => {
  //   const cols = activecolumns.map((co: any) => {
  //     return { name: co.title };
  //   });

  //   const filters: any = [];
  //   if (emplvalue) {
  //     filters.push({ name: isRTL ? emplvalue?.nameAr : emplvalue?.name });
  //   }
  //   if (departvalue) {
  //     filters.push({ name: isRTL ? departvalue?.nameAr : departvalue?.name });
  //   }
  //   if (servicevalue) {
  //     filters.push({ name: isRTL ? servicevalue?.nameAr : servicevalue?.name });
  //   }
  //   if (catvalue) {
  //     filters.push({ name: isRTL ? catvalue?.nameAr : catvalue?.name });
  //   }

  //   const rest = {
  //     isRTL,
  //     totl: words.total,
  //     totalamount: total ? total : '',
  //     reportname: isRTL ? '?????????? ??????????????' : 'Finance Report',
  //     logo: company.logo,
  //     phone: company.tel1,
  //     mobile: company.mob,
  //     address: company.address,
  //     company: isRTL ? company.nameAr : company.name,
  //     start: start ? covertToDate(start) : '',
  //     end: end ? covertToDate(end) : '',
  //     filters,
  //     color: '#b2e2be',
  //     now: covertToTimeDateDigit(new Date()),
  //   };

  //   reportprint({ rows: printRows, cols, ...rest });
  // };

  const refresh = () => {
    summaryData?.refetch();
  };

  const setSortDispatch = (value: any) => {
    dispatch({ type: 'setSort', payload: value });
  };

  const totalSummaryItems = [
    { columnName: sumcolumn, type: 'count' },
    { columnName: col.category.name, type: 'count' },
    { columnName: 'amount', type: 'sum' },
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
      theme={theme}
      refresh={refresh}
      loading={summaryData?.loading}
    >
      <Box
        style={{
          height: height - 50,
          overflow: 'auto',
          backgroundColor: '#fff',
          marginLeft: 5,
          marginRight: 5,
        }}
      >
        <Box
          display="flex"
          style={{
            position: 'absolute',
            zIndex: 111,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '60%',
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
              justifyContent: 'flex-start',
              paddingLeft: 20,
              paddingRight: 20,
            }}
          >
            {!tempoptions?.noPro && projects && projects.length > 0 && (
              <Box style={{ marginLeft: 10, marginRight: 10 }}>
                <FilterSelectCkeckBox
                  options={projects}
                  value={projvalue?.[0]}
                  setValue={setProjvalueDispatch}
                  words={tempwords}
                  isRTL={isRTL}
                  name="project"
                  nomulti
                  width={250}
                ></FilterSelectCkeckBox>
              </Box>
            )}
            {!tempoptions?.noTsk && (
              <Box style={{ marginLeft: 10, marginRight: 10 }}>
                <FilterSelectCkeckBox
                  options={tasks}
                  value={taskvalue?.[0]}
                  setValue={setTaskvalueDispatch}
                  words={words}
                  isRTL={isRTL}
                  name="task"
                  nomulti
                  width={250}
                ></FilterSelectCkeckBox>
              </Box>
            )}
            <FilterSelectCkeckBox
              options={expensesAccounts}
              value={accvalue?.[0]}
              setValue={setAccvalueDispatch}
              words={words}
              isRTL={isRTL}
              name="account"
              nomulti
              width={250}
            ></FilterSelectCkeckBox>
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
          <Typography style={{ fontWeight: 'bold' }}>
            {isRTL ? '??????????????' : 'Total'}: {moneyFormat(total)}
          </Typography>
        </Box>
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
          <SearchState />
          <IntegratedFiltering />
          <VirtualTable
            height={height - 100}
            tableComponent={TableComponent}
            messages={{
              noData: isRTL ? '???? ???????? ????????????' : 'no data',
            }}
            estimatedRowHeight={40}
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
            defaultHiddenColumnNames={[col.rased.name]}
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
            for={['amount']}
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
          {group && <TableGroupRow showColumnsWhenGrouped />}
          {group && (
            <TableSummaryRow
              messages={{
                sum: isRTL ? '??????????????' : 'Total',
                count: isRTL ? '??????????' : 'Count',
              }}
            ></TableSummaryRow>
          )}
        </Grid>
        <GridExporter
          ref={exporterRef}
          rows={rows}
          columns={columns}
          onSave={onSave}
        />
      </Box>
    </PageLayout>
  );
}
