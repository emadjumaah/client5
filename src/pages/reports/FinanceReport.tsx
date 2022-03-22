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
import { FinanceContext } from '../../contexts';
import FilterSelectCkeckBox from '../../Shared/FilterSelectCkeckBox';
import useTasks from '../../hooks/useTasks';
import _ from 'lodash';
import useProjects from '../../hooks/useProjects';
import { useTemplate } from '../../hooks';
import useWindowDimensions from '../../hooks/useWindowDimensions';

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

export default function FinanceReport({
  isRTL,
  words,
  menuitem,
  mainaccounts,
  theme,
}: any) {
  const [start, setStart] = useState<any>(null);
  const [end, setEnd] = useState<any>(null);

  const [rows, setRows] = useState([]);
  const [total, setTotal]: any = useState(null);

  const col = getColumns({ isRTL, words });

  const [columns] = useState([
    col.opTime,
    col.acc,
    col.taskId,
    col.refNo,
    // col.kaidType,
    col.opAcc,
    // col.accType,
    col.project,
    col.opType,
    col.employee,
    col.opDocNo,
    col.amount,
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
  } = useContext(FinanceContext);
  const { projects } = useProjects();
  const { tasks } = useTasks();
  const { tempwords } = useTemplate();
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

  const setAccvalueDispatch = (value: any) => {
    dispatch({ type: 'setAccvalue', payload: value ? [value] : [] });
  };
  const setTaskvalueDispatch = (value: any) => {
    dispatch({ type: 'setTaskvalue', payload: value ? [value] : [] });
  };
  const setProjvalueDispatch = (value: any) => {
    dispatch({ type: 'setProjvalue', payload: value ? [value] : [] });
  };

  useEffect(() => {}, [rows]);

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
      const isCredit = accvalue?.[0]?.accType === 2;
      let credit: any;
      let debit: any;
      if (amount < 0) {
        credit = isCredit ? 0 : -amount;
        debit = isCredit ? -amount : 0;
      } else {
        credit = isCredit ? amount : 0;
        debit = isCredit ? 0 : amount;
      }

      updatedRows.unshift({
        _id: Date.now(),
        accNameAr: 'رصيد افتتاحي',
        accName: 'Opening Balancee',
        amount,
        credit,
        debit,
      });
    }

    setRows(updatedRows);
    const sum = _.sumBy(updatedRows, 'amount');

    setTotal(sum);
  }, [summaryData]);

  const getIds = (list: any) =>
    list && list?.length > 0 ? list.map((sv: any) => sv._id) : undefined;
  const getTaskIds = (list: any) =>
    list && list?.length > 0 ? list.map((sv: any) => sv.id) : undefined;

  const fetchData = () => {
    const variables = {
      accountIds: getIds(accvalue),
      serviceIds: getIds(servicevalue),
      categoryIds: getIds(catvalue),
      departmentIds: getIds(departvalue),
      projectIds: getIds(projvalue),
      employeeIds: getIds(emplvalue),
      customerIds: getIds(custvalue),
      taskIds: getTaskIds(taskvalue),
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
          >
            {projects && projects.length > 0 && (
              <Box style={{ marginLeft: 10, marginRight: 10 }}>
                <FilterSelectCkeckBox
                  options={projects}
                  value={projvalue?.[0]}
                  setValue={setProjvalueDispatch}
                  words={tempwords}
                  isRTL={isRTL}
                  name="project"
                  nomulti
                  width={220}
                ></FilterSelectCkeckBox>
              </Box>
            )}
            <Box style={{ marginLeft: 10, marginRight: 10 }}>
              <FilterSelectCkeckBox
                options={tasks}
                value={taskvalue?.[0]}
                setValue={setTaskvalueDispatch}
                words={tempwords}
                isRTL={isRTL}
                name="task"
                nomulti
                width={220}
              ></FilterSelectCkeckBox>
            </Box>
            <FilterSelectCkeckBox
              options={mainaccounts}
              value={accvalue?.[0]}
              setValue={setAccvalueDispatch}
              words={words}
              isRTL={isRTL}
              name="account"
              nomulti
              width={220}
            ></FilterSelectCkeckBox>
          </Box>
          {accvalue && accvalue.length > 0 && (
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
          )}
        </Box>
        <Grid rows={rows} columns={columns} getRowId={getRowId}>
          <SortingState
            defaultSorting={sort}
            onSortingChange={(srt: any) => setSortDispatch(srt)}
          />
          <SummaryState totalItems={totalSummaryItems} />
          <IntegratedSummary />
          <IntegratedSorting />

          <VirtualTable
            height={height - 100}
            tableComponent={TableComponent}
            messages={{
              noData: isRTL ? 'لا يوجد بيانات' : 'no data',
            }}
            estimatedRowHeight={30}
          />
          <TableHeaderRow showSortingControls />
          <TableColumnVisibility
            columnExtensions={tableColumnVisibilityColumnExtensions}
            defaultHiddenColumnNames={[col.amount.name]}
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

          <TableSummaryRow
            messages={{
              sum: isRTL ? 'المجموع' : 'Total',
              count: isRTL ? 'العدد' : 'Count',
            }}
          ></TableSummaryRow>
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
