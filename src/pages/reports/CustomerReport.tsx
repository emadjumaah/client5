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
  currencyFormatterEmpty,
  opTypeFormatter,
  taskIdFormatter,
} from '../../Shared/colorFormat';
import { Box, fade, IconButton, withStyles } from '@material-ui/core';
import { getCustMonthlyReport } from '../../graphql';
import { useLazyQuery } from '@apollo/client';
import { GridExporter } from '@devexpress/dx-react-grid-export';
import saveAs from 'file-saver';
import { getColumns } from '../../common/columns';
import PageLayout from '../main/PageLayout';
import DateNavigatorReports from '../../components/filters/DateNavigatorReports';
import { CustomerReportContext } from '../../contexts';
import FilterSelectCkeckBox from '../../Shared/FilterSelectCkeckBox';
import { useCustomers, useTemplate } from '../../hooks';
import useTasks from '../../hooks/useTasks';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { CustomerReportPrint } from '../../print/CustomerReportPrint';
import { useReactToPrint } from 'react-to-print';
import PrintIcon from '@material-ui/icons/Print';

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
  company,
  theme,
}: any) {
  const [start, setStart] = useState<any>(null);
  const [end, setEnd] = useState<any>(null);

  const [rows, setRows] = useState([]);

  const col = getColumns({ isRTL, words });

  const { tempoptions } = useTemplate();
  const [columns] = useState(
    tempoptions?.noTsk
      ? [
          col.opTime,
          col.customer,
          col.opType,
          col.opDocNo,
          col.opAcc,
          col.amountdebit,
          col.amountcredit,
          col.rased,
        ]
      : [
          col.opTime,
          col.customer,
          col.opType,
          col.project,
          col.taskId,
          col.opDocNo,
          col.opAcc,
          col.amountdebit,
          col.amountcredit,
          col.rased,
        ]
  );

  const [tableColumnVisibilityColumnExtensions] = useState([
    { columnName: col.opTime.name, togglingEnabled: false },
    { columnName: col.amount.name, togglingEnabled: false },
  ]);

  const [getSummary, summaryData]: any = useLazyQuery(getCustMonthlyReport, {
    fetchPolicy: 'cache-and-network',
  });
  const componentRef: any = useRef();

  const { customers } = useCustomers();
  const { tasks } = useTasks();
  const { height } = useWindowDimensions();

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
    const slsData = summaryData?.data?.['getCustMonthlyReport']?.data || [];
    const balance =
      summaryData?.data?.['getCustMonthlyReport']?.message || null;
    const updatedRows = slsData.map((x: any) => x);

    const amount = balance ? JSON.parse(balance) : null;
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

    setRows(updatedRows2);
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
  }, [start, end, group, groupby, sumcolumn, custvalue]);

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

  const print = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Documents Report`,
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
          marginLeft: 5,
          marginRight: 5,
        }}
      >
        {custvalue?.length > 0 && (
          <Box
            style={{
              position: 'absolute',
              left: isRTL ? 145 : undefined,
              right: isRTL ? undefined : 145,
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
              width={350}
            ></FilterSelectCkeckBox>
          </Box>
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

          <VirtualTable
            height={height - 100}
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
            for={['credit', 'debit', 'rased']}
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
        <GridExporter
          ref={exporterRef}
          rows={rows}
          columns={columns}
          onSave={onSave}
        />
        <Box>
          <div style={{ display: 'none' }}>
            <CustomerReportPrint
              company={company}
              items={rows}
              columns={columns}
              ref={componentRef}
              customer={custvalue?.[0]}
              start={start}
              end={end}
            />
          </div>
        </Box>
      </Box>
    </PageLayout>
  );
}
