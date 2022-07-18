/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useEffect, useState } from 'react';
import {
  SortingState,
  IntegratedSorting,
  DataTypeProvider,
  SearchState,
  IntegratedFiltering,
  PagingState,
  IntegratedPaging,
} from '@devexpress/dx-react-grid';
import {
  Grid,
  TableHeaderRow,
  SearchPanel,
  Toolbar,
  DragDropProvider,
  Table,
  TableColumnReordering,
  TableColumnResizing,
  TableColumnVisibility,
  ColumnChooser,
  PagingPanel,
} from '@devexpress/dx-react-grid-material-ui';
import { getRowId, updateDocNumbers } from '../../common';
import { useLazyQuery } from '@apollo/client';
import {
  accountFormatter,
  currencyFormatter,
  opTypeFormatter,
  samllFormatter,
  timeFormatter,
} from '../../Shared/colorFormat';
import useAccounts from '../../hooks/useAccounts';
import { SearchTable } from '../../components';
import { Box, Paper, Typography } from '@material-ui/core';
import { TableComponent } from '../../Shared/TableComponent';
import { getColumns } from '../../common/columns';
import getEmployeeAdvance from '../../graphql/query/getEmployeeAdvance';
import RefetchBox from '../../Shared/RefetchBox';

export default function EmployeeAdvance({
  isRTL,
  words,
  start,
  end,
  name,
  id,
  width,
  height,
  theme,
}: any) {
  const col = getColumns({ isRTL, words });

  const [columns] = useState([
    { name: 'time', title: words.time },
    col.opType,
    { name: 'docNo', title: words.no },
    { name: 'creditAcc', title: isRTL ? 'حساب الدفع' : 'Credit Acc' },
    { name: 'debitAcc', title: isRTL ? 'حساب القبض' : 'Receipt Acc' },
    col.employee,
    { name: 'desc', title: words.description },
    { name: 'amount', title: words.amount },
  ]);

  const [tableColumnExtensions]: any = useState([
    { columnName: 'time', width: 120 },
    { columnName: col.opType.name, width: 200 },
    { columnName: 'docNo', width: 120 },
    { columnName: 'creditAcc', width: 200 },
    { columnName: 'debitAcc', width: 200 },
    { columnName: col.employee.name, width: 200 },
    { columnName: 'desc', width: 200 },
    { columnName: 'amount', width: 120 },
  ]);

  const [tableColumnVisibilityColumnExtensions] = useState([
    { columnName: 'time', togglingEnabled: false },
    { columnName: 'creditAcc', togglingEnabled: false },
    { columnName: 'debitAcc', togglingEnabled: false },
  ]);
  const [pageSizes] = useState([5, 10, 20, 50, 0]);

  const [rows, setRows] = useState([]);

  const [loadFinances, financeData]: any = useLazyQuery(getEmployeeAdvance, {
    fetchPolicy: 'cache-and-network',
  });
  const { accounts } = useAccounts();
  useEffect(() => {
    const variables = {
      [name]: id,
      start: start ? start.setHours(0, 0, 0, 0) : undefined,
      end: end ? end.setHours(23, 59, 59, 999) : undefined,
    };
    loadFinances({
      variables,
    });
  }, [start, end]);

  useEffect(() => {
    if (financeData?.data?.getEmployeeAdvance?.data) {
      const { data } = financeData.data.getEmployeeAdvance;
      const rdata = updateDocNumbers(data);
      setRows(rdata);
    }
  }, [financeData]);

  const refresh = () => financeData?.refetch();
  const loading = financeData.loading;
  return (
    <Box
      style={{
        height: height - 280,
        width: width - 300,
        margin: 10,
      }}
    >
      <Box
        style={{
          position: 'absolute',
          width: 50,
          height: 50,
          left: isRTL ? 220 : undefined,
          right: isRTL ? undefined : 220,
          zIndex: 111,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          top: 55,
        }}
      >
        <RefetchBox
          isRTL={isRTL}
          theme={theme}
          refresh={refresh}
          loading={loading}
        ></RefetchBox>
      </Box>
      <Paper
        style={{
          height: height - 290,
          width: width - 320,
        }}
      >
        <Grid rows={rows} columns={columns} getRowId={getRowId}>
          <SortingState />
          <SearchState />
          <PagingState defaultCurrentPage={0} defaultPageSize={10} />
          <IntegratedSorting />
          <IntegratedFiltering />
          <IntegratedPaging />
          <DragDropProvider />
          <Table
            messages={{
              noData: isRTL ? 'لا يوجد بيانات' : 'no data',
            }}
            tableComponent={TableComponent}
            rowComponent={(props: any) => (
              <Table.Row {...props} style={{ height: 60 }}></Table.Row>
            )}
            columnExtensions={tableColumnExtensions}
          />

          <TableColumnReordering
            defaultOrder={[
              'time',
              col.opType.name,
              'docNo',
              'creditAcc',
              'debitAcc',
              col.supplier.name,
              col.employee.name,
              'desc',
              'amount',
            ]}
          />
          <TableColumnResizing defaultColumnWidths={tableColumnExtensions} />

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
            defaultHiddenColumnNames={[]}
          />
          <DataTypeProvider
            for={['time']}
            formatterComponent={timeFormatter}
          ></DataTypeProvider>
          <DataTypeProvider
            for={['amount']}
            formatterComponent={currencyFormatter}
          ></DataTypeProvider>
          <DataTypeProvider
            for={['docNo', 'refNo']}
            formatterComponent={samllFormatter}
          ></DataTypeProvider>
          <DataTypeProvider
            for={['creditAcc']}
            formatterComponent={(props) =>
              accountFormatter(props, accounts, isRTL)
            }
          ></DataTypeProvider>
          <DataTypeProvider
            for={['debitAcc']}
            formatterComponent={(props) =>
              accountFormatter(props, accounts, isRTL)
            }
          ></DataTypeProvider>
          <DataTypeProvider
            for={['opType']}
            formatterComponent={opTypeFormatter}
          ></DataTypeProvider>
          <Toolbar />
          <ColumnChooser />
          <PagingPanel pageSizes={pageSizes} />
          <SearchPanel
            inputComponent={(props: any) => {
              return <SearchTable isRTL={isRTL} {...props}></SearchTable>;
            }}
          />
        </Grid>
      </Paper>
    </Box>
  );
}
