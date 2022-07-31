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
import { getRowId, updateOpDocRefNumbers } from '../../common';
import {
  calculateAmount,
  covertToTimeDateDigit,
  createdAtFormatter,
  currencyFormatter,
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
import { getMonthlyReport } from '../../graphql';
import { useLazyQuery } from '@apollo/client';
import { GridExporter } from '@devexpress/dx-react-grid-export';
import saveAs from 'file-saver';
import { getColumns } from '../../common/columns';
import PageLayout from '../main/PageLayout';
import DateNavigatorReports from '../../components/filters/DateNavigatorReports';
import { FinanceContext } from '../../contexts';
import FilterSelectCkeckBox from '../../Shared/FilterSelectCkeckBox';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { FinanceReportPrint } from '../../print/FinanceReportPrint';
import { useReactToPrint } from 'react-to-print';
import PrintIcon from '@material-ui/icons/Print';
import { useTemplate } from '../../hooks';
import { SearchTable } from '../../components';

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

export default function FinanceReport({
  isRTL,
  words,
  menuitem,
  accounts,
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
          col.opDocNo,
          col.refNo,
          col.opType,
          col.acc,
          col.opAcc,
          col.employee,
          col.amount,
          col.amountdebit,
          col.amountcredit,
          col.rased,
        ]
      : [
          col.opTime,
          col.acc,
          col.opDocNo,
          col.refNo,
          col.opType,
          col.contract,
          col.customer,
          col.opAcc,
          col.employee,
          col.amount,
          col.amountdebit,
          col.amountcredit,
          col.rased,
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
      accvalue,
      paccvalue,
      group,
      groupby,
      sumcolumn,
      sort,
    },
    dispatch,
  } = useContext(FinanceContext);
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

  useEffect(() => {
    const slsData = summaryData?.data?.['getMonthlyReport']?.data || [];
    const balance = summaryData?.data?.['getMonthlyReport']?.message || null;
    const updatedRows = slsData.map((x: any) => x);
    const amount = isRaseed && balance ? Number(balance) : null;
    if (amount !== null) {
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
      if (credit || debit) {
        updatedRows.unshift({
          _id: Date.now(),
          opTime: start,
          opType: 94,
          amount,
          credit,
          debit,
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

    const rdata = updateOpDocRefNumbers(updatedRows2);

    setRows(rdata);
  }, [summaryData, isRaseed]);

  const getIds = (list: any) =>
    list && list?.length > 0 ? list.map((sv: any) => sv._id) : undefined;
  const getPcode = (list: any) =>
    list && list?.length > 0 ? list.map((sv: any) => sv.code) : undefined;

  const fetchData = () => {
    const variables = {
      parentcodes: getPcode(paccvalue),
      accountIds: getIds(accvalue),
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
  }, [start, end, group, groupby, accvalue, paccvalue, sumcolumn]);

  const faccounts =
    paccvalue?.length > 0
      ? accounts.filter((ac: any) => ac?.parentcode === paccvalue?.[0]?.code)
      : accounts;

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
  const componentRef: any = useRef();

  const print = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Finance Report`,
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
        {(accvalue?.length > 0 || paccvalue?.length > 0) && (
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
              justifyContent: 'flex-start',
              paddingLeft: 20,
              paddingRight: 20,
            }}
          >
            <FilterSelectCkeckBox
              options={faccounts}
              value={accvalue?.[0]}
              setValue={setAccvalueDispatch}
              words={words}
              isRTL={isRTL}
              name="account"
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
                  {isRTL ? 'رصيد افتتاحي' : 'Opening Balance'}
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
            {isRTL ? 'الرصيد' : 'Balance'}:{' '}
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
            height={height - 98}
            tableComponent={TableComponent}
            messages={{
              noData: isRTL ? 'لا يوجد بيانات' : 'no data',
            }}
            estimatedRowHeight={30}
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
            defaultHiddenColumnNames={[col.amount.name, col.rased.name]}
          />
          <DataTypeProvider
            for={['opTime']}
            formatterComponent={createdAtFormatter}
          ></DataTypeProvider>
          <DataTypeProvider
            for={['credit', 'debit', 'rased']}
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
        <Box>
          <div style={{ display: 'none' }}>
            <FinanceReportPrint
              company={company}
              items={rows}
              columns={columns}
              ref={componentRef}
              isRTL={isRTL}
              account={accvalue?.[0]}
              start={start}
              end={end}
            />
          </div>
        </Box>
      </Box>
    </PageLayout>
  );
}
