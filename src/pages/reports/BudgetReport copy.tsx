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
  GroupingState,
  IntegratedGrouping,
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
  TableGroupRow,
} from '@devexpress/dx-react-grid-material-ui';
import { getRowId } from '../../common';
import {
  covertToTimeDateDigit,
  createdAtFormatter,
  currencyFormatterEmpty,
  opTypeFormatter,
  taskIdFormatter,
} from '../../Shared/colorFormat';
import {
  Box,
  Checkbox,
  colors,
  fade,
  FormControlLabel,
  Typography,
  withStyles,
} from '@material-ui/core';
import { getMonthlyReport } from '../../graphql';
import { useLazyQuery } from '@apollo/client';
import { GridExporter } from '@devexpress/dx-react-grid-export';
import saveAs from 'file-saver';
import { getColumns } from '../../common/columns';
import PageLayout from '../main/PageLayout';
import DateNavigatorReports from '../../components/filters/DateNavigatorReports';
import { FinanceContext } from '../../contexts';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import useTasks from '../../hooks/useTasks';
// import getTrialBalance from '../../graphql/query/getTrialBalance';

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

export default function BudgetReport({ isRTL, words, menuitem, theme }: any) {
  const [start, setStart] = useState<any>(null);
  const [end, setEnd] = useState<any>(null);

  const [rows, setRows] = useState([]);
  const [group, setGroup]: any = useState(false);

  const col = getColumns({ isRTL, words });

  const [columns] = useState([
    col.opTime,
    col.acc,
    col.taskId,
    col.refNo,
    col.opType,
    col.employee,
    col.opDocNo,
    col.amount,
    col.amountdebit,
    col.amountcredit,
    col.rased,
  ]);

  const [tableColumnVisibilityColumnExtensions] = useState([
    { columnName: col.opTime.name, togglingEnabled: false },
    { columnName: col.amount.name, togglingEnabled: false },
  ]);

  const [getSummary, summaryData]: any = useLazyQuery(getMonthlyReport, {
    fetchPolicy: 'cache-and-network',
  });
  // const [getTB, tbData]: any = useLazyQuery(getTrialBalance, {
  //   fetchPolicy: 'cache-and-network',
  // });

  // console.log('tbData', tbData);
  // const dd = tbData?.data?.['getTrialBalance']?.data || '';
  // console.log('JSON.parse(dd', JSON.parse(dd));

  const {
    state: { currentDate, currentViewName, endDate, sort },
    dispatch,
  } = useContext(FinanceContext);
  const { tasks } = useTasks();
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
  useEffect(() => {
    const slsData = summaryData?.data?.['getMonthlyReport']?.data || [];
    let rased = 0;
    const updatedRows =
      slsData?.length > 0
        ? slsData.map((item: any) => {
            const rowRased = item.debit ? item.debit : -item.credit;
            rased = rased + rowRased;
            return {
              ...item,
              rased,
            };
          })
        : [];

    setRows(updatedRows);
  }, [summaryData]);

  const mizania = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  const fetchData = () => {
    const variables = {
      parentcodes: mizania,
      start: start ? start.setHours(0, 0, 0, 0) : undefined,
      end: end
        ? end.setHours(23, 59, 59, 999)
        : new Date().setHours(23, 59, 59, 999),
    };
    getSummary({
      variables,
    });
    // getTB();
  };

  useEffect(() => {
    fetchData();
  }, [start, end]);

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

  const grouping = [{ columnName: col.acc.name }];
  const groupSummaryItems = [
    {
      columnName: col.taskId.name,
      type: 'count',
      alignByColumn: true,
    },
    {
      columnName: 'credit',
      type: 'sum',
      alignByColumn: true,
    },
    {
      columnName: 'debit',
      type: 'sum',
      alignByColumn: true,
    },
  ];

  const totalSummaryItems = [
    { columnName: 'credit', type: 'sum' },
    { columnName: 'debit', type: 'sum' },
  ];

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
              justifyContent: 'flex-start',
              paddingLeft: 20,
              paddingRight: 20,
            }}
          ></Box>
        </Box>
        <Box
          display={'flex'}
          style={{
            position: 'absolute',
            left: 180,
            top: 60,
            zIndex: 111,
            flexDirection: 'row',
          }}
        >
          <FormControlLabel
            control={
              <Checkbox
                style={{ padding: 7 }}
                checked={group}
                onChange={() => setGroup(!group)}
                color="primary"
              />
            }
            label={
              <Typography
                style={{ color: colors.blue[700] }}
                variant="subtitle2"
              >
                {isRTL ? 'تجميع بحسب الحساب' : 'Group by Account'}
              </Typography>
            }
            style={{ fontSize: 14 }}
          />
        </Box>
        <Grid rows={rows} columns={columns} getRowId={getRowId}>
          <SortingState
            defaultSorting={sort}
            onSortingChange={(srt: any) => setSortDispatch(srt)}
          />
          {group && <GroupingState grouping={grouping} />}
          {group && (
            <SummaryState
              totalItems={totalSummaryItems}
              groupItems={groupSummaryItems}
            />
          )}
          {group && <IntegratedGrouping />}
          {group && <IntegratedSummary />}
          <IntegratedSorting />
          <VirtualTable
            height={height - 98}
            tableComponent={TableComponent}
            messages={{
              noData: isRTL ? 'لا يوجد بيانات' : 'no data',
            }}
            estimatedRowHeight={30}
          />
          <TableHeaderRow showSortingControls />
          <TableColumnVisibility
            columnExtensions={tableColumnVisibilityColumnExtensions}
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
          {group && (
            <TableGroupRow
              messages={{
                sum: isRTL ? 'المجموع' : 'Total',
                count: isRTL ? 'العدد' : 'Count',
                sumOf: isRTL ? 'المجموع' : 'Total',
                countOf: isRTL ? 'العدد' : 'Count',
              }}
              showColumnsWhenGrouped
            />
          )}
          {group && (
            <TableSummaryRow
              messages={{
                sum: isRTL ? 'المجموع' : 'Total',
                count: isRTL ? 'العدد' : 'Count',
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
