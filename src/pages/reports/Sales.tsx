/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Paper from '@material-ui/core/Paper';
import {
  SortingState,
  IntegratedSorting,
  DataTypeProvider,
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
import PrintIcon from '@material-ui/icons/Print';
import { getRowId } from '../../common';
import {
  covertToDate,
  covertToTimeDateDigit,
  createdAtFormatter,
  currencyFormatter,
  moneyFormat,
} from '../../Shared/colorFormat';
import { Box, fade, IconButton, withStyles } from '@material-ui/core';
import { getSalesReport } from '../../graphql';
import { useLazyQuery } from '@apollo/client';
import SalesFilter from '../../Shared/SalesFilter';
import { GridExporter } from '@devexpress/dx-react-grid-export';
import saveAs from 'file-saver';
import { getPeriods } from '../../common/time';
import { getColumns } from '../../common/columns';
import { reportprint } from '../../common/ipc';
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

export default function Sales({
  isRTL,
  words,
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

  const [rows, setRows] = useState([]);
  const [printRows, setPrintRows]: any = useState([]);
  const [total, setTotal]: any = useState(null);

  const col = getColumns({ isRTL, words });
  const [sort, setSort] = useState<any>([
    { columnName: col.startDate.name, direction: 'asc' },
  ]);
  const [activecolumns, setActivecolumns] = useState([
    col.opTime,
    col.opDocNo,
    col.employee,
    col.service,
    col.department,
    col.category,
    col.customer,
    col.amount,
  ]);

  const [columns] = useState([
    col.opTime,
    col.opDocNo,
    col.employee,
    col.service,
    col.department,
    col.category,
    col.customer,
    col.amount,
  ]);

  const [tableColumnVisibilityColumnExtensions] = useState([
    { columnName: col.opTime.name, togglingEnabled: false },
    { columnName: col.amount.name, togglingEnabled: false },
  ]);
  const { height } = useWindowDimensions();

  const [getSales, salesData]: any = useLazyQuery(getSalesReport);

  useEffect(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    setStart(d);
  }, []);

  useEffect(() => {
    getSales();
  }, [getSales]);

  useEffect(() => {
    const slsData = salesData?.data?.['getSalesReport']?.data || [];
    const slsTotal = salesData?.data?.['getSalesReport']?.message || null;

    setRows(slsData);
    setTotal(slsTotal ? JSON.parse(slsTotal) : null);
  }, [salesData]);

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
    };
    getSales({
      variables,
    });
  }, [
    servicevalue,
    departvalue,
    emplvalue,
    getSales,
    start,
    end,
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
    const sortRows = _.orderBy(rows, [sort[0].columnName], [sort[0].direction]);

    const printrows = sortRows.map((row: any) => {
      return {
        opTime: inActiveColumns('opTime')
          ? covertToDate(row.opTime)
          : undefined,
        opDocNo: inActiveColumns('opDocNo') ? row.opDocNo : undefined,
        employee: inActiveColumns('employee')
          ? row[col.employee.name]
          : undefined,
        service: inActiveColumns('service') ? row[col.service.name] : undefined,
        department: inActiveColumns('department')
          ? row[col.department.name]
          : undefined,
        category: inActiveColumns('category')
          ? row[col.category.name]
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
      totalamount:
        total && total.length > 0 ? moneyFormat(total?.[0]?.total) : '',
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

  const refresh = () => {
    salesData?.refetch();
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
            <PrintIcon />
          </IconButton>
        </Box>
        <Box>
          <SalesFilter
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
            total={total}
            words={words}
            isRTL={isRTL}
            periodvalue={periodvalue}
            setPeriodvalue={setPeriodvalue}
          ></SalesFilter>
        </Box>
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
            </Grid>
          </Box>
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
