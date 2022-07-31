/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Paper from '@material-ui/core/Paper';
import {
  DataTypeProvider,
  IntegratedSorting,
  SortingState,
} from '@devexpress/dx-react-grid';
import {
  Grid,
  TableHeaderRow,
  Toolbar,
  VirtualTable,
  ExportPanel,
  TableColumnVisibility,
  ColumnChooser,
} from '@devexpress/dx-react-grid-material-ui';
import { GridExporter } from '@devexpress/dx-react-grid-export';

import { getRowId } from '../../common';
import {
  covertToDate,
  covertToTimeDateDigit,
  covertToTimeOnly,
  createdAtFormatter,
  currencyFormatter,
  dateTimeFormatter,
  eventStatusFormatter,
  eventStatusPrintDataFormatter,
  moneyFormat,
} from '../../Shared/colorFormat';
import {
  Box,
  fade,
  IconButton,
  Typography,
  withStyles,
} from '@material-ui/core';
import { getReportEvents } from '../../graphql';
import { useLazyQuery } from '@apollo/client';
import EventsFilter from '../../Shared/EventsFilter';
import saveAs from 'file-saver';
import { getPeriods } from '../../common/time';
import PrintIcon from '@material-ui/icons/Print';
import { reportprint } from '../../common/ipc';
import { getColumns } from '../../common/columns';
import _ from 'lodash';
import PageLayout from '../main/PageLayout';
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

export default function Events({
  words,
  isRTL,
  menuitem,
  departments,
  employees,
  services,
  customers,
  categories,
  company,
  theme,
}: any) {
  const [servicevalue, setServicevalue] = useState<any>(null);
  const [departvalue, setDepartvalue] = useState<any>(null);
  const [emplvalue, setEmplvalue] = useState<any>(null);
  const [custvalue, setCustvalue] = useState<any>(null);
  const [catvalue, setCatvalue] = useState<any>(null);
  const [periodvalue, setPeriodvalue] = useState<any>(null);

  const [start, setStart] = useState<any>(new Date());
  const [end, setEnd] = useState<any>(null);
  const [status, setStatus] = useState<any>(null);

  const [rows, setRows] = useState([]);
  const [printRows, setPrintRows]: any = useState([]);
  const [total, setTotal]: any = useState(null);
  const { height } = useWindowDimensions();

  const col = getColumns({ isRTL, words });

  const [sort, setSort] = useState<any>([
    { columnName: col.startDate.name, direction: 'asc' },
  ]);
  const [activecolumns, setActivecolumns] = useState([
    col.startDate,
    col.time,
    col.docNo,
    col.employee,
    col.service,
    col.department,
    col.customer,
    col.status,
    col.amount,
  ]);
  const [columns] = useState([
    col.startDate,
    col.time,
    col.docNo,
    col.employee,
    col.service,
    col.department,
    col.customer,
    col.status,
    col.amount,
  ]);

  const [tableColumnVisibilityColumnExtensions] = useState([
    { columnName: col.startDate.name, togglingEnabled: false },
    { columnName: col.amount.name, togglingEnabled: false },
  ]);

  const [getEvents, evnData]: any = useLazyQuery(getReportEvents);
  useEffect(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    setStart(d);
  }, []);

  useEffect(() => {
    getEvents();
  }, [getEvents]);

  useEffect(() => {
    const eventsData = evnData?.data?.['getReportEvents']?.data || [];
    const eventsTotal = evnData?.data?.['getReportEvents']?.message || null;
    setRows(eventsData);
    setTotal(eventsTotal ? JSON.parse(eventsTotal) : null);
  }, [evnData]);

  useEffect(() => {
    if (periodvalue) {
      const prd = getPeriods(periodvalue.period);
      setStart(prd.start);
      setEnd(prd.end);
    } else {
      const prd = getPeriods('cm');
      setStart(prd.start);
      setEnd(prd.end);
    }
  }, [periodvalue]);

  useEffect(() => {
    const variables = {
      itemId: servicevalue ? servicevalue._id : undefined,
      departmentId: departvalue ? departvalue._id : undefined,
      employeeId: emplvalue ? emplvalue._id : undefined,
      customerId: custvalue ? custvalue._id : undefined,
      categoryId: catvalue ? catvalue._id : undefined,
      start: start ? start.setHours(0, 0, 0, 0) : undefined,
      end: end ? end.setHours(23, 59, 59, 999) : undefined,
      status: status ? status.id : undefined,
    };
    getEvents({
      variables,
    });
  }, [
    servicevalue,
    departvalue,
    emplvalue,
    getEvents,
    start,
    end,
    status,
    custvalue,
    catvalue,
  ]);
  const exporterRef: any = useRef(null);

  const startExport = useCallback(() => {
    exporterRef.current.exportGrid();
  }, [exporterRef]);

  const onSave = (workbook) => {
    workbook.xlsx.writeBuffer().then((buffer) => {
      const now = new Date();
      const name = `appoint-report-${covertToTimeDateDigit(now)}`;
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
    const sortRows = _.orderBy(rows, [sort[0].columnName], [sort[0].direction]);
    const printrows = sortRows.map((row: any) => {
      return {
        date: inActiveColumns('date') ? covertToDate(row.startDate) : undefined,
        time: inActiveColumns('time')
          ? covertToTimeOnly(row.startDate)
          : undefined,
        docNo: inActiveColumns('docNo') ? row.docNo : undefined,
        status: inActiveColumns('status')
          ? eventStatusPrintDataFormatter(row.status)
          : undefined,
        employee: inActiveColumns('employee')
          ? row[col.employee.name]
          : undefined,
        service: inActiveColumns('service') ? row[col.service.name] : undefined,
        department: inActiveColumns('department')
          ? row[col.department.name]
          : undefined,
        customer: inActiveColumns('customer')
          ? row[col.customer.name]
          : undefined,
        amount: inActiveColumns('amount') ? moneyFormat(row.amount) : undefined,
      };
    });

    setPrintRows(printrows);
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
    if (servicevalue) {
      filters.push({ name: isRTL ? servicevalue?.nameAr : servicevalue?.name });
    }

    const rest = {
      isRTL,
      totl: words.total,
      totalamount:
        total && total.length > 0 ? moneyFormat(total?.[0]?.total) : '',
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

  const refresh = () => {
    evnData?.refetch();
  };

  return (
    <PageLayout
      menuitem={menuitem}
      isRTL={isRTL}
      words={words}
      theme={theme}
      refresh={refresh}
      periodvalue={periodvalue}
      setPeriodvalue={setPeriodvalue}
      loading={evnData?.loading}
    >
      <Paper>
        <Box
          style={{
            position: 'absolute',
            left: isRTL ? 340 : undefined,
            right: isRTL ? undefined : 340,
            top: 146,
            zIndex: 100,
          }}
        >
          <IconButton onClick={arrangeParing} title="Print Report" size="small">
            <PrintIcon style={{ fontSize: 24 }} />
          </IconButton>
        </Box>
        <Box>
          <EventsFilter
            servicevalue={servicevalue}
            setServicevalue={setServicevalue}
            departvalue={departvalue}
            setDepartvalue={setDepartvalue}
            emplvalue={emplvalue}
            setEmplvalue={setEmplvalue}
            departments={departments}
            employees={employees}
            services={services}
            customers={customers}
            custvalue={custvalue}
            setCustvalue={setCustvalue}
            catvalue={catvalue}
            setCatvalue={setCatvalue}
            categories={categories}
            start={start}
            setStart={setStart}
            end={end}
            setEnd={setEnd}
            status={status}
            setStatus={setStatus}
            total={total}
            isRTL={isRTL}
            words={words}
            periodvalue={periodvalue}
            setPeriodvalue={setPeriodvalue}
          ></EventsFilter>
        </Box>
        <Box>
          <Paper style={{ height: height - 85, overflow: 'auto' }}>
            <Box style={{ marginTop: 40 }}>
              <Grid rows={rows} columns={columns} getRowId={getRowId}>
                <SortingState
                  defaultSorting={sort}
                  onSortingChange={(srt: any) => setSort(srt)}
                />
                <IntegratedSorting />
                <VirtualTable
                  height={800}
                  tableComponent={TableComponent}
                  messages={{
                    noData: isRTL ? 'لا يوجد بيانات' : 'no data',
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
                  onHiddenColumnNamesChange={(hcs: string[]) => {
                    const all = [...columns];
                    const newcol = all.filter(
                      (a: any) => !hcs.includes(a.name)
                    );
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
                  formatterComponent={dateTimeFormatter}
                ></DataTypeProvider>
                <DataTypeProvider
                  for={['status']}
                  formatterComponent={eventStatusFormatter}
                ></DataTypeProvider>
                <DataTypeProvider
                  for={['amount']}
                  formatterComponent={currencyFormatter}
                ></DataTypeProvider>
                <Toolbar />
                <ColumnChooser />
                <ExportPanel startExport={startExport} />
              </Grid>
            </Box>
          </Paper>
          <GridExporter
            ref={exporterRef}
            rows={rows}
            columns={columns}
            onSave={onSave}
          />
        </Box>
      </Paper>
    </PageLayout>
  );
}
