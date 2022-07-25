/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useEffect, useState } from 'react';
import Paper from '@material-ui/core/Paper';
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
  TableSummaryRow,
  VirtualTable,
} from '@devexpress/dx-react-grid-material-ui';
import { getRowId, updateOpDocRefNumbers } from '../common';
import { useLazyQuery } from '@apollo/client';
import {
  createdAtFormatter,
  currencyFormatterEmpty,
  opTypeFormatter,
} from './colorFormat';
import getEmployeeCustody from '../graphql/query/getEmployeeCustody';
import { getColumns } from '../common/columns';
import { Box, Typography } from '@material-ui/core';
import RefetchBox from './RefetchBox';

export default function EmployeeCustody({
  isRTL,
  words,
  name,
  id,
  width,
  height,
  start,
  end,
  theme,
}: any) {
  const col = getColumns({ isRTL, words });

  const [columns] = useState([
    col.opTime,
    col.opType,
    col.opDocNo,
    col.acc,
    col.amountdebit,
    col.amountcredit,
    { name: 'desc', title: words.description },
  ]);

  const [rows, setRows] = useState([]);

  const [loadKaids, kaidsData]: any = useLazyQuery(getEmployeeCustody, {
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    const variables = {
      [name]: id,
      start: start ? start.setHours(0, 0, 0, 0) : undefined,
      end: end ? end.setHours(23, 59, 59, 999) : undefined,
    };
    loadKaids({
      variables,
    });
  }, [id, start, end]);

  useEffect(() => {
    if (kaidsData?.data?.getEmployeeCustody?.data) {
      const { data } = kaidsData.data.getEmployeeCustody;
      const rdata = updateOpDocRefNumbers(data);
      setRows(rdata);
    }
  }, [kaidsData]);

  const totalSummaryItems = [
    { columnName: 'credit', type: 'sum' },
    { columnName: 'debit', type: 'sum' },
  ];
  const refresh = () => kaidsData?.refetch();
  const loading = kaidsData.loading;
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
          <SummaryState totalItems={totalSummaryItems} />
          <IntegratedSorting />
          <IntegratedSummary />
          <VirtualTable
            height={680}
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
          <TableSummaryRow
            messages={{
              sum: isRTL ? 'المجموع' : 'Total',
              count: isRTL ? 'العدد' : 'Count',
            }}
          ></TableSummaryRow>
        </Grid>
      </Paper>
    </Box>
  );
}
