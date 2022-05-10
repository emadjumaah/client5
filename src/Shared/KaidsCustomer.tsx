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
import { getRowId } from '../common';
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
import { Box } from '@material-ui/core';
import DateNavigatorReports from '../components/filters/DateNavigatorReports';

export default function KaidsCustomer({
  isRTL,
  words,
  theme,
  name,
  id,
  value,
}) {
  const col = getColumns({ isRTL, words });

  const [columns] = useState([
    col.opTime,
    col.opDocNo,
    col.acc,
    col.taskId,
    col.employee,
    col.department,
    col.amountdebit,
    col.amountcredit,
  ]);

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const { tasks } = useTasks();

  const [start, setStart] = useState<any>(null);
  const [end, setEnd] = useState<any>(null);
  const [currentViewName, setCurrentViewName] = useState('Month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const currentViewNameChange = (e: any) => {
    setCurrentViewName(e.target.value);
  };
  const currentDateChange = (curDate: any) => {
    setCurrentDate(curDate);
  };

  const endDateChange = (curDate: any) => {
    setEndDate(curDate);
  };

  const [loadKaids, kaidsData]: any = useLazyQuery(getGereralKaids, {
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
    if (kaidsData?.loading) {
      setLoading(true);
    }
    if (kaidsData?.data?.getGereralKaids?.data) {
      const { data } = kaidsData.data.getGereralKaids;
      setRows(data);
      setLoading(false);
    }
  }, [kaidsData]);

  const totalSummaryItems = [
    { columnName: 'credit', type: 'sum' },
    { columnName: 'debit', type: 'sum' },
  ];

  return (
    <Paper
      style={{
        maxHeight: 600,
        overflow: 'auto',
        margin: 10,
        minHeight: 600,
      }}
    >
      <Box display="flex">
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
      </Box>
      <Grid rows={rows} columns={columns} getRowId={getRowId}>
        <SortingState />
        <SummaryState totalItems={totalSummaryItems} />
        <IntegratedSorting />
        <IntegratedSummary />
        <VirtualTable
          height={550}
          messages={{
            noData: isRTL ? 'لا يوجد بيانات' : 'no data',
          }}
          estimatedRowHeight={40}
        />
        <TableHeaderRow showSortingControls />
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
  );
}
