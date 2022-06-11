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
import PrintIcon from '@material-ui/icons/Print';
import { getRowId } from '../../common';
import {
  covertToDate,
  covertToTimeDateDigit,
  covertToTimeOnly,
  createdAtFormatter,
  currencyFormatter,
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
import { groupList } from '../../constants/reports';
import { groupSumCount } from '../../common/reports';
import { useServices, useTemplate } from '../../hooks';
import useTasks from '../../hooks/useTasks';
import getReportServices from '../../graphql/query/getReportServices';
import ServicesReportContext from '../../contexts/servicesReport';
import useDepartmentsUp from '../../hooks/useDepartmentsUp';
import useEmployeesUp from '../../hooks/useEmployeesUp';
import useResoursesUp from '../../hooks/useResoursesUp';
import useProjects from '../../hooks/useProjects';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { SearchTable } from '../../components';
import { itemTypes } from '../../constants/datatypes';

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

export default function ServicesReport({
  isRTL,
  words,
  menuitem,
  company,
  theme,
}: any) {
  const [start, setStart] = useState<any>(null);
  const [end, setEnd] = useState<any>(null);

  const [rows, setRows] = useState([]);
  const [printRows, setPrintRows]: any = useState([]);
  const [total, setTotal]: any = useState(null);
  const [totalRows, setTotalRows]: any = useState(null);

  const col = getColumns({ isRTL, words });

  const [activecolumns, setActivecolumns] = useState([
    col.opTime,
    col.item,
    col.opType,
    col.opDocNo,
    col.customer,
    col.project,
    col.taskId,
    col.employee,
    col.resourse,
    col.department,
    { name: 'qty', title: words.qty },
    { name: 'total', title: words.amount },
  ]);

  const { tempoptions } = useTemplate();
  const [columns] = useState(
    tempoptions?.noTsk
      ? [
          col.opTime,
          col.item,
          col.opType,
          col.opDocNo,
          col.customer,
          col.employee,
          col.department,
          { name: 'qty', title: words.qty },
          { name: 'total', title: words.amount },
        ]
      : [
          col.opTime,
          col.item,
          col.opType,
          col.opDocNo,
          col.customer,
          col.taskId,
          col.project,
          col.employee,
          col.resourse,
          col.department,
          { name: 'qty', title: words.qty },
          { name: 'total', title: words.amount },
        ]
  );

  const [tableColumnVisibilityColumnExtensions] = useState([
    { columnName: col.opTime.name, togglingEnabled: false },
    // { columnName: col.amount.name, togglingEnabled: false },
  ]);

  const [getSummary, summaryData]: any = useLazyQuery(getReportServices, {
    fetchPolicy: 'cache-and-network',
  });
  const { departments } = useDepartmentsUp();
  const { employees } = useEmployeesUp();
  const { resourses } = useResoursesUp();
  const { services } = useServices();

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
      taskvalue,
      itemtypes,
      group,
      groupby,
      sumcolumn,
      status,
      sort,
      types,
    },
    dispatch,
  } = useContext(ServicesReportContext);
  const { tasks } = useTasks();
  const { projects } = useProjects();
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
  const setResovalueDispatch = (value: any) => {
    dispatch({ type: 'setResovalue', payload: value });
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
  const setItemtypesDispatch = (value: any) => {
    dispatch({ type: 'setItemtypes', payload: value });
  };
  const setServicevalueDispatch = (value: any) => {
    dispatch({ type: 'setServicevalue', payload: value });
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

  useEffect(() => {
    const slsData = summaryData?.data?.['getReportServices']?.data || [];

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
      serviceIds: getIds(servicevalue),
      departmentIds: getIds(departvalue),
      projectIds: getIds(projvalue),
      resourseIds: getIds(resovalue),
      employeeIds: getIds(emplvalue),
      customerIds: getIds(custvalue),
      taskIds: getTaskIds(taskvalue),
      itemtypes: getTaskIds(itemtypes),
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
  }, [
    start,
    end,
    group,
    groupby,
    sumcolumn,
    status,
    departvalue,
    projvalue,
    resovalue,
    emplvalue,
    custvalue,
    taskvalue,
    types,
    itemtypes,
  ]);

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
      reportname: isRTL ? 'تقرير البنود' : 'Items Report',
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
    { columnName: 'total', type: 'sum' },
  ];

  const grouping = [{ columnName: sumcolumn }];
  const groupSummaryItems = [
    {
      columnName: col.docNo.name,
      type: 'count',
      alignByColumn: true,
    },
    {
      columnName: 'total',
      type: 'sum',
      alignByColumn: true,
    },
  ];

  const projres = groupList(isRTL).filter((item: any) =>
    tempoptions.noPro && tempoptions.noTsk
      ? item.id !== 10 && item.id !== 11 && item.id !== 8
      : tempoptions.noPro && !tempoptions.noRes
      ? item.id !== 10
      : !tempoptions.noPro && tempoptions.noRes
      ? item.id !== 11
      : true
  );
  const groupOptions = projres.filter(
    (item: any) => item.id !== 6 && item.id !== 7
  );

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
          style={{
            position: 'absolute',
            left: isRTL ? 340 : undefined,
            right: isRTL ? undefined : 340,
            top: 68,
            zIndex: 100,
          }}
          display="none"
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
              servicevalue={servicevalue}
              setServicevalue={setServicevalueDispatch}
              departvalue={departvalue}
              setDepartvalue={setDepartvalueDispatch}
              emplvalue={emplvalue}
              setEmplvalue={setEmplvalueDispatch}
              departments={departments}
              employees={employees}
              projects={projects}
              projvalue={projvalue}
              setProjvalue={setProjvalueDispatch}
              resourses={resourses}
              resovalue={resovalue}
              setResovalue={setResovalueDispatch}
              services={services}
              // customers={customers}
              custvalue={custvalue}
              setCustvalue={setCustvalueDispatch}
              suppliers={[]}
              suppvalue={[]}
              setSuppvalue={() => null}
              tasks={tasks}
              taskvalue={taskvalue}
              setTaskvalue={setTaskvalueDispatch}
              words={words}
              isRTL={isRTL}
              documentTypes={itemTypes}
              types={itemtypes}
              setTypes={setItemtypesDispatch}
            ></ReportsFilter>
            <ReportGroupBySwitcher
              options={groupOptions}
              value={groupby}
              onChange={onSwitcherChange}
              isRTL={isRTL}
            ></ReportGroupBySwitcher>
          </Box>
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
          <SearchState />
          <IntegratedFiltering />
          <VirtualTable
            height={height - 100}
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
            for={['opTime']}
            formatterComponent={createdAtFormatter}
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
          <SearchPanel
            inputComponent={(props: any) => {
              return <SearchTable isRTL={isRTL} {...props}></SearchTable>;
            }}
          />
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
