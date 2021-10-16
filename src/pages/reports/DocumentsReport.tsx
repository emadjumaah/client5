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
import PrintIcon from '@material-ui/icons/Print';
import { getRowId } from '../../common';
import {
  covertToDate,
  covertToTimeDateDigit,
  covertToTimeOnly,
  createdAtFormatter,
  currencyFormatter,
  documentTimeFormatter,
  eventStatusFormatter,
  eventStatusPrintDataFormatter,
  moneyFormat,
  opTypeFormatter,
  taskIdFormatter,
} from '../../Shared/colorFormat';
import { Box, fade, IconButton, withStyles } from '@material-ui/core';
import { useLazyQuery } from '@apollo/client';
import ReportsFilter from '../../Shared/ReportsFilter';
import { GridExporter } from '@devexpress/dx-react-grid-export';
import saveAs from 'file-saver';
import { getColumns } from '../../common/columns';
import { reportprint } from '../../common/ipc';
import _ from 'lodash';
import PageLayout from '../main/PageLayout';
import { ReportGroupBySwitcher } from '../calendar/common/ReportGroupBySwitcher';
import DateNavigatorReports from '../../components/filters/DateNavigatorReports';
import { documentTypes, groupList } from '../../constants/reports';
import FilterSelectCkeckBox from '../../Shared/FilterSelectCkeckBox';
import { eventStatus } from '../../constants';
import { groupSumCount } from '../../common/reports';
import { useCustomers, useDepartments, useEmployees } from '../../hooks';
import useTasks from '../../hooks/useTasks';
import getReportDocuments from '../../graphql/query/getReportDocuments';
import DocumentsReportContext from '../../contexts/documentsReport';

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
export const TableComponent2 = withStyles(
  {},
  { name: 'TableComponent' }
)(TableComponentBase);

export default function DocumentsReport({
  isRTL,
  words,
  menuitem,
  services,
  company,
  theme,
  isEditor,
}: any) {
  const [start, setStart] = useState<any>(null);
  const [end, setEnd] = useState<any>(null);

  const [rows, setRows] = useState([]);
  const [printRows, setPrintRows]: any = useState([]);
  const [total, setTotal]: any = useState(null);
  const [totalRows, setTotalRows]: any = useState(null);

  const col = getColumns({ isRTL, words });

  const [activecolumns, setActivecolumns] = useState([
    { name: 'time', title: words.time },
    col.opType,
    col.docNo,
    col.refNo,
    col.customer,
    col.taskId,
    col.employee,
    col.department,
    col.amount,
  ]);

  const [columns] = useState([
    { name: 'time', title: words.time },
    col.opType,
    col.docNo,
    col.refNo,
    col.customer,
    col.taskId,
    col.employee,
    col.department,
    col.amount,
  ]);

  const [tableColumnVisibilityColumnExtensions] = useState([
    { columnName: col.opTime.name, togglingEnabled: false },
    // { columnName: col.amount.name, togglingEnabled: false },
  ]);

  const [getSummary, summaryData]: any = useLazyQuery(getReportDocuments, {
    fetchPolicy: 'cache-and-network',
  });
  const { customers } = useCustomers();
  const { departments } = useDepartments();
  const { employees } = useEmployees();
  const {
    state: {
      currentDate,
      currentViewName,
      endDate,
      departvalue,
      emplvalue,
      custvalue,
      taskvalue,
      group,
      groupby,
      sumcolumn,
      status,
      sort,
      types,
    },
    dispatch,
  } = useContext(DocumentsReportContext);
  const { tasks } = useTasks();
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
  const setEmplvalueDispatch = (value: any) => {
    dispatch({ type: 'setEmplvalue', payload: value });
  };
  const setCustvalueDispatch = (value: any) => {
    dispatch({ type: 'setCustvalue', payload: value });
  };
  const setTaskvalueDispatch = (value: any) => {
    dispatch({ type: 'setTaskvalue', payload: value });
  };
  const setTypesDispatch = (value: any) => {
    dispatch({ type: 'setTypes', payload: value });
  };

  const setGroupbyDispatch = (value: any) => {
    dispatch({ type: 'setGroupby', payload: value });
  };
  const setGroupDispatch = (value: any) => {
    dispatch({ type: 'setGroup', payload: value });
  };
  const setSumcolumnDispatch = (value: any) => {
    dispatch({ type: 'setSumcolumn', payload: value });
  };
  const setStatusDispatch = (value: any) => {
    dispatch({ type: 'setStatus', payload: value });
  };

  useEffect(() => {
    const slsData = summaryData?.data?.['getReportDocuments']?.data || [];

    setRows(slsData);
    if (group) {
      const res = groupSumCount({
        list: slsData,
        name: sumcolumn,
      });
      setTotalRows(res);
    }
    let sum = 0;
    slsData.forEach((a: any) => (sum += a.amount));
    setTotal(sum);
  }, [summaryData]);

  const getIds = (list: any) =>
    list && list?.length > 0 ? list.map((sv: any) => sv._id) : undefined;
  const getTaskIds = (list: any) =>
    list && list?.length > 0 ? list.map((sv: any) => sv.id) : undefined;
  const getTypesValue = (list: any) =>
    list && list?.length > 0 ? list.map((sv: any) => sv.value) : undefined;
  const fetchData = () => {
    const variables = {
      departmentIds: getIds(departvalue),
      employeeIds: getIds(emplvalue),
      customerIds: getIds(custvalue),
      taskIds: getTaskIds(taskvalue),
      types: getTypesValue(types),
      start: start ? start.setHours(0, 0, 0, 0) : undefined,
      end: end
        ? end.setHours(23, 59, 59, 999)
        : new Date().setHours(23, 59, 59, 999),
      status: status ? status.id : undefined,
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
      const name = `events-report-${covertToTimeDateDigit(now)}`;
      saveAs(
        new Blob([buffer], { type: 'application/octet-stream' }),
        `${name}.xlsx`
      );
    });
  };

  const inActiveColumns = (name: any) => {
    const fc = activecolumns.filter((ac: any) => ac.ref === name);
    if (fc && fc.length > 0) {
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    if (group) {
    } else {
      const sortRows = _.orderBy(
        rows,
        [sort[0].columnName],
        [sort[0].direction]
      );
      const printrows = sortRows.map((row: any) => {
        return {
          date: inActiveColumns('date')
            ? row.startDate
              ? covertToDate(row.startDate)
              : ' - '
            : undefined,
          time: inActiveColumns('time')
            ? row.startDate
              ? covertToTimeOnly(row.startDate)
              : ' - '
            : undefined,
          docNo: inActiveColumns('docNo')
            ? row.docNo
              ? row.docNo
              : ' - '
            : undefined,
          status: inActiveColumns('status')
            ? row.status
              ? eventStatusPrintDataFormatter(row.status)
              : ' - '
            : undefined,
          employee: inActiveColumns('employee')
            ? row[col.employee.name]
              ? row[col.employee.name]
              : ' - '
            : undefined,
          service: inActiveColumns('service')
            ? row[col.service.name]
              ? row[col.service.name]
              : ' - '
            : undefined,
          department: inActiveColumns('department')
            ? row[col.department.name]
              ? row[col.department.name]
              : ' - '
            : undefined,
          customer: inActiveColumns('customer')
            ? row[col.customer.name]
              ? row[col.customer.name]
              : ' - '
            : undefined,
          taskId: inActiveColumns('taskId')
            ? row[col.taskId.name]
              ? row[col.taskId.name]
              : ' - '
            : undefined,
          types: inActiveColumns('types')
            ? row[col.taskId.name]
              ? row[col.taskId.name]
              : ' - '
            : undefined,
          opType: inActiveColumns('opType')
            ? row[col.opType.name]
              ? row[col.opType.name]
              : ' - '
            : undefined,
          amount: inActiveColumns('amount')
            ? row.amount
              ? moneyFormat(row.amount)
              : ' - '
            : undefined,
        };
      });

      setPrintRows(printrows);
    }
  }, [activecolumns, rows, sort]);

  const arrangeParing = () => {
    const cols = activecolumns.map((co: any) => {
      return { name: co.title };
    });

    const filters: any = [];
    if (emplvalue) {
      filters.push({ name: isRTL ? emplvalue?.nameAr : emplvalue?.name });
    }
    if (status) {
      filters.push({ name: isRTL ? status?.nameAr : status?.name });
    }
    if (departvalue) {
      filters.push({ name: isRTL ? departvalue?.nameAr : departvalue?.name });
    }

    if (taskvalue) {
      filters.push({ name: isRTL ? taskvalue?.nameAr : taskvalue?.name });
    }

    const rest = {
      isRTL,
      totl: words.total,
      totalamount: total ? moneyFormat(total) : '',
      reportname: isRTL ? 'تقرير المواعيد' : 'Appointment Report',
      logo: company.logo,
      phone: company.tel1,
      mobile: company.mob,
      address: company.address,
      company: isRTL ? company.nameAr : company.name,
      start: start ? covertToDate(start) : '',
      end: end ? covertToDate(end) : '',
      filters,
      color: '#afbddf',
      now: covertToTimeDateDigit(new Date()),
    };

    reportprint({ rows: printRows, cols, ...rest });
  };

  const arrangeGroupParing = () => {
    const cols = [
      { name: isRTL ? 'الاسم' : 'Name' },
      { name: isRTL ? 'العدد' : 'Count' },
      { name: isRTL ? 'المجموع' : 'Total' },
    ];
    const readyItems = totalRows.items.map((it: any) => {
      return {
        ...it,
        total: moneyFormat(it.total),
      };
    });
    const rest = {
      isRTL,
      totl: words.total,
      totalamount: total ? moneyFormat(totalRows.total) : '',
      count: totalRows?.count,
      reportname: isRTL ? 'تقرير المبيعات' : 'Sales Report',
      logo: company.logo,
      phone: company.tel1,
      mobile: company.mob,
      address: company.address,
      company: isRTL ? company.nameAr : company.name,
      start: start ? covertToDate(start) : '',
      end: end ? covertToDate(end) : '',
      color: '#b2e2be',
      now: covertToTimeDateDigit(new Date()),
    };

    reportprint({ rows: readyItems, cols, ...rest });
  };

  const refresh = () => {
    summaryData?.refetch();
  };

  const onSwitcherChange = (e: any) => {
    if (e.target.value === 'none') {
      setGroupDispatch(false);
      setGroupbyDispatch('none');
    } else {
      setGroupDispatch(true);
      setGroupbyDispatch(e.target.value);
      setSumcolumnDispatch(col[e.target.value].name);
    }
  };

  const setSortDispatch = (value: any) => {
    dispatch({ type: 'setSort', payload: value });
  };

  const totalSummaryItems = [
    { columnName: col.docNo.name, type: 'count' },
    { columnName: 'amount', type: 'sum' },
  ];

  const grouping = [{ columnName: sumcolumn }];
  const groupSummaryItems = [
    {
      columnName: col.docNo.name,
      type: 'count',
      alignByColumn: true,
    },
    {
      columnName: 'amount',
      type: 'sum',
      alignByColumn: true,
    },
  ];
  const groupOptions = groupList(isRTL).filter(
    (item: any) => item.id !== 6 && item.id !== 4 && item.id !== 7
  );

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
        <Box
          style={{
            position: 'absolute',
            left: isRTL ? 145 : undefined,
            right: isRTL ? undefined : 145,
            top: 68,
            zIndex: 100,
          }}
        >
          <IconButton
            onClick={group ? arrangeGroupParing : arrangeParing}
            title="Print Report"
            size="small"
          >
            <PrintIcon />
          </IconButton>
        </Box>
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
              alignItems: 'center',
              justifyContent: 'center',
              paddingLeft: 20,
              paddingRight: 20,
              marginTop: -4,
            }}
          >
            <ReportsFilter
              servicevalue={[]}
              setServicevalue={() => null}
              departvalue={departvalue}
              setDepartvalue={setDepartvalueDispatch}
              emplvalue={emplvalue}
              setEmplvalue={setEmplvalueDispatch}
              departments={departments}
              employees={employees}
              services={services}
              customers={customers}
              custvalue={custvalue}
              setCustvalue={setCustvalueDispatch}
              tasks={tasks}
              taskvalue={taskvalue}
              setTaskvalue={setTaskvalueDispatch}
              words={words}
              isRTL={isRTL}
              documentTypes={documentTypes}
              types={types}
              setTypes={setTypesDispatch}
            ></ReportsFilter>
            <ReportGroupBySwitcher
              options={groupOptions}
              value={groupby}
              onChange={onSwitcherChange}
              isRTL={isRTL}
            ></ReportGroupBySwitcher>
          </Box>
          <Box
            style={{
              marginTop: -2,
              zIndex: 115,
            }}
          >
            <FilterSelectCkeckBox
              options={eventStatus}
              value={status}
              setValue={setStatusDispatch}
              words={words}
              isRTL={isRTL}
              name="status"
              nomulti
              width={180}
            ></FilterSelectCkeckBox>
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
              tableComponent={!group ? TableComponent : TableComponent2}
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
                setActivecolumns(newcol);
              }}
            />
            <DataTypeProvider
              for={['startDate']}
              formatterComponent={createdAtFormatter}
            ></DataTypeProvider>
            <DataTypeProvider
              for={['time']}
              formatterComponent={documentTimeFormatter}
            ></DataTypeProvider>
            <DataTypeProvider
              for={['status']}
              formatterComponent={eventStatusFormatter}
            ></DataTypeProvider>
            <DataTypeProvider
              for={['amount']}
              formatterComponent={currencyFormatter}
            ></DataTypeProvider>{' '}
            <DataTypeProvider
              for={['taskId']}
              formatterComponent={(props: any) =>
                taskIdFormatter({ ...props, tasks })
              }
            ></DataTypeProvider>{' '}
            <DataTypeProvider
              for={['opType']}
              formatterComponent={opTypeFormatter}
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
            <TableSummaryRow
              messages={{
                sum: isRTL ? 'المجموع' : 'Total',
                count: isRTL ? 'العدد' : 'Count',
              }}
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
