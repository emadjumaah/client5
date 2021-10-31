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
  calculateAmount,
  covertToDate,
  covertToTimeDateDigit,
  createdAtFormatter,
  currencyFormatter,
  moneyFormat,
} from '../../Shared/colorFormat';
import { Box, fade, IconButton, withStyles } from '@material-ui/core';
import { getMonthlyReport } from '../../graphql';
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
import { PurchaseReportContext } from '../../contexts';
import { groupList } from '../../constants/reports';
import { groupSumCount } from '../../common/reports';
import { useDepartments, useEmployees, useServices } from '../../hooks';

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
export const TableComponent2 = withStyles(
  {},
  { name: 'TableComponent' }
)(TableComponentBase);

export default function PurchaseReport({
  isRTL,
  words,
  menuitem,
  suppliers,
  categories,
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
    col.opTime,
    col.employee,
    col.service,
    col.department,
    col.category,
    col.supplier,
    col.opDocNo,
    col.amount,
  ]);

  const [columns] = useState([
    col.opTime,
    col.employee,
    col.service,
    col.department,
    col.category,
    col.supplier,
    col.opDocNo,
    col.amount,
  ]);

  const [tableColumnVisibilityColumnExtensions] = useState([
    { columnName: col.opTime.name, togglingEnabled: false },
    { columnName: col.amount.name, togglingEnabled: false },
  ]);

  const [getSummary, summaryData]: any = useLazyQuery(getMonthlyReport, {
    fetchPolicy: 'cache-and-network',
  });
  const { departments } = useDepartments();
  const { employees } = useEmployees();
  const { services } = useServices();

  const {
    state: {
      currentDate,
      currentViewName,
      endDate,
      servicevalue,
      departvalue,
      emplvalue,
      suppvalue,
      catvalue,
      group,
      groupby,
      sumcolumn,
      sort,
    },
    dispatch,
  } = useContext(PurchaseReportContext);

  const currentViewNameChange = (e: any) => {
    dispatch({ type: 'setCurrentViewName', payload: e.target.value });
  };
  const currentDateChange = (curDate: any) => {
    dispatch({ type: 'setCurrentDate', payload: curDate });
  };
  const endDateChange = (curDate: any) => {
    dispatch({ type: 'setEndDate', payload: curDate });
  };

  const setServicevalueDispatch = (value: any) => {
    dispatch({ type: 'setServicevalue', payload: value });
  };
  const setDepartvalueDispatch = (value: any) => {
    dispatch({ type: 'setDepartvalue', payload: value });
  };
  const setEmplvalueDispatch = (value: any) => {
    dispatch({ type: 'setEmplvalue', payload: value });
  };
  const setSuppvalueDispatch = (value: any) => {
    dispatch({ type: 'setSuppvalue', payload: value });
  };
  const setCatvalueDispatch = (value: any) => {
    dispatch({ type: 'setCatvalue', payload: value });
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
  const setSortDispatch = (value: any) => {
    dispatch({ type: 'setSort', payload: value });
  };

  useEffect(() => {
    const slsData = summaryData?.data?.['getMonthlyReport']?.data || [];
    const updatedRows =
      slsData?.length > 0
        ? slsData.map((item: any) => {
            return {
              ...item,
              amount: calculateAmount(item),
            };
          })
        : [];
    setRows(updatedRows);
    if (group) {
      const res = groupSumCount({
        list: updatedRows,
        name: sumcolumn,
      });
      setTotalRows(res);
    }

    let sum = 0;
    updatedRows.forEach((a: any) => (sum += a.amount));
    setTotal(sum);
  }, [summaryData]);

  const getIds = (list: any) =>
    list && list?.length > 0 ? list.map((sv: any) => sv._id) : undefined;

  const fetchData = () => {
    const variables = {
      accPCode: 14,
      serviceIds: getIds(servicevalue),
      categoryIds: getIds(catvalue),
      departmentIds: getIds(departvalue),
      employeeIds: getIds(emplvalue),
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
  }, [start, end, group, groupby, sumcolumn]);

  const exporterRef: any = useRef(null);

  const startExport = useCallback(() => {
    exporterRef.current.exportGrid();
  }, [exporterRef]);

  const onSave = (workbook: any) => {
    workbook.xlsx.writeBuffer().then((buffer: any) => {
      const now = new Date();
      const name = `sales-report-${covertToTimeDateDigit(now)}`;
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
          opTime: inActiveColumns('opTime')
            ? row.opDocNo
              ? covertToDate(row.opTime)
              : ' - '
            : undefined,
          opDocNo: inActiveColumns('opDocNo')
            ? row.opDocNo
              ? row.opDocNo
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
          category: inActiveColumns('category')
            ? row[col.category.name]
              ? row[col.category.name]
              : ' - '
            : undefined,
          supplier: inActiveColumns('supplier')
            ? row[col.supplier.name]
              ? row[col.supplier.name]
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
    if (departvalue) {
      filters.push({ name: isRTL ? departvalue?.nameAr : departvalue?.name });
    }
    if (servicevalue) {
      filters.push({ name: isRTL ? servicevalue?.nameAr : servicevalue?.name });
    }
    if (catvalue) {
      filters.push({ name: isRTL ? catvalue?.nameAr : catvalue?.name });
    }

    const rest = {
      isRTL,
      totl: words.total,
      totalamount: total ? moneyFormat(total) : '',
      reportname: isRTL ? 'تقرير المبيعات' : 'Sales Report',
      logo: company.logo,
      phone: company.tel1,
      mobile: company.mob,
      address: company.address,
      company: isRTL ? company.nameAr : company.name,
      start: start ? covertToDate(start) : '',
      end: end ? covertToDate(end) : '',
      filters,
      color: '#b2e2be',
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

  const totalSummaryItems = [
    { columnName: col.opDocNo.name, type: 'count' },
    { columnName: 'amount', type: 'sum' },
  ];

  const grouping = [{ columnName: sumcolumn }];
  const groupSummaryItems = [
    {
      columnName: col.opDocNo.name,
      type: 'count',
      alignByColumn: true,
    },
    {
      columnName: 'amount',
      type: 'sum',
      alignByColumn: true,
    },
  ];
  const groupOptions = groupList(isRTL).filter((item: any) => item.id !== 7);

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
            top: 65,
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
            position: 'absolute',
            left: isRTL ? 200 : undefined,
            right: isRTL ? undefined : 200,
            top: 65,
            height: 38,
            zIndex: 111,
            alignItems: 'center',
            justifyContent: 'flex-start',
            paddingLeft: 20,
            paddingRight: 20,
            marginTop: 2,
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
            services={services}
            customers={suppliers}
            custvalue={suppvalue}
            setCustvalue={setSuppvalueDispatch}
            catvalue={catvalue}
            setCatvalue={setCatvalueDispatch}
            categories={categories}
            words={words}
            isRTL={isRTL}
          ></ReportsFilter>
          <ReportGroupBySwitcher
            options={groupOptions}
            value={groupby}
            onChange={onSwitcherChange}
            isRTL={isRTL}
          ></ReportGroupBySwitcher>
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
              for={['opTime']}
              formatterComponent={createdAtFormatter}
            ></DataTypeProvider>
            <DataTypeProvider
              for={['amount']}
              formatterComponent={currencyFormatter}
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
