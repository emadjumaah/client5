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
import { Loading } from '.';
import { getRowId, updateDocNumbers } from '../common';
import { useLazyQuery } from '@apollo/client';
import {
  createdAtFormatter,
  currencyFormatterEmpty,
  opTypeFormatter,
  taskIdFormatter,
} from './colorFormat';
import useTasks from '../hooks/useTasks';
import getGereralKaids from '../graphql/query/getGereralKaids';
import { getColumns } from '../common/columns';
import { Box, Typography } from '@material-ui/core';
import { useTemplate } from '../hooks';

export default function KaidsCustomer({
  isRTL,
  words,
  theme,
  name,
  id,
  width,
  height,
  start,
  end,
}) {
  const col = getColumns({ isRTL, words });

  const { tempoptions } = useTemplate();
  const [columns] = useState(
    tempoptions?.noTsk
      ? [
          col.opTime,
          col.opDocNo,
          col.acc,
          col.employee,
          col.department,
          col.amountdebit,
          col.amountcredit,
        ]
      : [
          col.opTime,
          col.opDocNo,
          col.acc,
          col.taskId,
          col.customer,
          col.resourse,
          col.employee,
          col.department,
          col.amountdebit,
          col.amountcredit,
        ]
  );

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const { tasks } = useTasks();

  const [loadKaids, kaidsData]: any = useLazyQuery(getGereralKaids, {
    // fetchPolicy: 'cache-and-network',
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
    if (kaidsData?.loading) {
      setLoading(true);
    }
    if (kaidsData?.data?.getGereralKaids?.data) {
      const { data } = kaidsData.data.getGereralKaids;
      const rdata = updateDocNumbers(data);
      setRows(rdata);
      setLoading(false);
    }
  }, [kaidsData]);

  const totalSummaryItems = [
    { columnName: 'credit', type: 'sum' },
    { columnName: 'debit', type: 'sum' },
  ];

  return (
    <Box
      style={{
        height: height - 280,
        width: width - 300,
        margin: 10,
      }}
    >
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
          <DataTypeProvider
            for={['taskId']}
            formatterComponent={(props: any) =>
              taskIdFormatter({ ...props, tasks })
            }
          ></DataTypeProvider>
          <TableSummaryRow
            messages={{
              sum: isRTL ? 'المجموع' : 'Total',
              count: isRTL ? 'العدد' : 'Count',
            }}
          ></TableSummaryRow>
        </Grid>
        {loading && <Loading isRTL={isRTL} />}
      </Paper>
    </Box>
  );
}
