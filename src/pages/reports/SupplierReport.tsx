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
  TableSummaryRow,
  SearchPanel,
} from '@devexpress/dx-react-grid-material-ui';
import { getRowId } from '../../common';
import {
  calculateAmount,
  covertToTimeDateDigit,
  createdAtFormatter,
  currencyFormatterEmpty,
  moneyFormat,
  opTypeFormatter,
} from '../../Shared/colorFormat';
import {
  Box,
  Checkbox,
  fade,
  FormControlLabel,
  IconButton,
  Typography,
  withStyles,
} from '@material-ui/core';
import { useLazyQuery } from '@apollo/client';
import { GridExporter } from '@devexpress/dx-react-grid-export';
import saveAs from 'file-saver';
import { getColumns } from '../../common/columns';
import PageLayout from '../main/PageLayout';
import DateNavigatorReports from '../../components/filters/DateNavigatorReports';
import FilterSelectCkeckBox from '../../Shared/FilterSelectCkeckBox';
import { useSuppliers, useTemplate } from '../../hooks';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { CustomerReportPrint } from '../../print/CustomerReportPrint';
import { useReactToPrint } from 'react-to-print';
import PrintIcon from '@material-ui/icons/Print';
import getSuppMonthlyReport from '../../graphql/query/getSuppMonthlyReport';
import SupplierReportContext from '../../contexts/supplierReport';
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

export default function SupplierReport({
  isRTL,
  words,
  menuitem,
  company,
  theme,
}: any) {
  const [start, setStart] = useState<any>(null);
  const [end, setEnd] = useState<any>(null);

  const [rows, setRows] = useState([]);
  const [isRaseed, setIsRaseed] = useState(true);

  const col = getColumns({ isRTL, words });

  const { tempoptions } = useTemplate();
  const [columns] = useState(
    tempoptions?.noTsk
      ? [
          col.opTime,
          col.supplier,
          col.opType,
          col.opDocNo,
          col.opAcc,
          col.amountdebit,
          col.amountcredit,
          col.rased,
        ]
      : [
          col.opTime,
          col.supplier,
          col.opType,
          col.project,
          col.contract,
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

  const [getSummary, summaryData]: any = useLazyQuery(getSuppMonthlyReport, {
    fetchPolicy: 'cache-and-network',
  });
  const componentRef: any = useRef();

  const { suppliers } = useSuppliers();
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
      suppvalue,
      catvalue,
      accvalue,
      group,
      groupby,
      sumcolumn,
      sort,
    },
    dispatch,
  } = useContext(SupplierReportContext);

  const currentViewNameChange = (e: any) => {
    dispatch({ type: 'setCurrentViewName', payload: e.target.value });
  };
  const currentDateChange = (curDate: any) => {
    dispatch({ type: 'setCurrentDate', payload: curDate });
  };
  const endDateChange = (curDate: any) => {
    dispatch({ type: 'setEndDate', payload: curDate });
  };

  const setSuppvalueDispatch = (value: any) => {
    dispatch({ type: 'setSuppvalue', payload: value ? [value] : [] });
  };

  useEffect(() => {
    const slsData = summaryData?.data?.['getSuppMonthlyReport']?.data || [];
    const balance =
      summaryData?.data?.['getSuppMonthlyReport']?.message || null;
    const updatedRows = slsData.map((x: any) => x);

    const amount = isRaseed && balance ? JSON.parse(balance) : null;

    if (amount !== null) {
      const { credit, debit } = amount;

      if (credit || debit) {
        // const am = debit - credit;
        const am = credit - debit;
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
            const rowRased = item.credit ? item.credit : -item.debit;
            rased = rased + rowRased;
            return {
              ...item,
              amount: calculateAmount(item),
              rased,
            };
          })
        : [];

    setRows(updatedRows2);
  }, [summaryData, isRaseed]);

  const getIds = (list: any) =>
    list && list?.length > 0 ? list.map((sv: any) => sv._id) : undefined;

  const fetchData = () => {
    const variables = {
      accPCode: 7,
      accountIds: getIds(accvalue),
      serviceIds: getIds(servicevalue),
      categoryIds: getIds(catvalue),
      departmentIds: getIds(departvalue),
      projectIds: getIds(projvalue),
      resourseIds: getIds(resovalue),
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
  }, [start, end, group, groupby, sumcolumn, suppvalue]);

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
        {suppvalue?.length > 0 && (
          <Box
            style={{
              position: 'absolute',
              left: isRTL ? 360 : undefined,
              right: isRTL ? undefined : 360,
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
              options={suppliers}
              value={suppvalue?.[0]}
              setValue={setSuppvalueDispatch}
              words={words}
              isRTL={isRTL}
              name="supplier"
              nomulti
              width={250}
            ></FilterSelectCkeckBox>
          </Box>
          <Box style={{ marginLeft: 10, marginRight: 10 }}>
            <FormControlLabel
              control={
                <Checkbox
                  style={{ padding: 7 }}
                  checked={isRaseed}
                  onChange={() => setIsRaseed(!isRaseed)}
                  color="primary"
                />
              }
              label={
                <Typography
                  style={{ color: theme.palette.primary.main }}
                  variant="subtitle2"
                >
                  {isRTL ? '???????? ??????????????' : 'Opening Balance'}
                </Typography>
              }
              style={{ fontSize: 14 }}
            />
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
          <Typography style={{ fontWeight: 'bold', color: '#403795' }}>
            {isRTL ? '????????????' : 'Balance'}:{' '}
            {moneyFormat(rows?.[rows?.length - 1]?.rased)}
          </Typography>
        </Box>
        <Grid rows={rows} columns={columns} getRowId={getRowId}>
          <SortingState
            defaultSorting={sort}
            onSortingChange={(srt: any) => setSortDispatch(srt)}
          />
          <SummaryState totalItems={totalSummaryItems} />
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
            for={['credit', 'debit', 'rased']}
            formatterComponent={currencyFormatterEmpty}
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
          <TableSummaryRow
            messages={{
              sum: isRTL ? '??????????????' : 'Total',
            }}
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
              customer={suppvalue?.[0]}
              start={start}
              end={end}
            />
          </div>
        </Box>
      </Box>
    </PageLayout>
  );
}
