/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useEffect, useState } from 'react';
import Paper from '@material-ui/core/Paper';
import {
  SortingState,
  IntegratedSorting,
  DataTypeProvider,
} from '@devexpress/dx-react-grid';
import {
  Grid,
  TableHeaderRow,
  VirtualTable,
  TableColumnVisibility,
} from '@devexpress/dx-react-grid-material-ui';

import { useLazyQuery } from '@apollo/client';
import {
  createdAtFormatter,
  currencyFormatterEmpty,
  dueAmountFormatter,
  incomeAmountFormatter,
  invoiceReceiptFormatter,
  nameLinkFormat,
  progressFormatter,
  taskNameFormatter,
} from './colorFormat';
import { getColumns } from '../common/columns';

import { TableComponent } from './TableComponent';

import getObjectProjects from '../graphql/query/getObjectProjects';
import { updateDocNumbers } from '../common';
import { Box, Typography } from '@material-ui/core';

export const getRowId = (row: { _id: any }) => row._id;

export default function ProjectsCustomer({
  isRTL,
  words,
  name,
  id,
  width,
  height,
  start,
  end,
}) {
  const col = getColumns({ isRTL, words });
  const [columns] = useState([
    { name: isRTL ? 'nameAr' : 'name', title: words.name },
    // col.docNo,
    col.start,
    col.end,
    col.customer,
    col.department,
    col.employee,
    col.evQty,
    col.progress,
    { name: 'amount', title: isRTL ? 'الاجمالي' : 'Total' },
    col.totalinvoiced,
    col.totalpaid,
    {
      id: 40,
      ref: 'due',
      name: 'due',
      title: isRTL ? 'المتبقي' : 'Due Payment',
    },
    col.toatlExpenses,
    {
      id: 38,
      ref: 'income',
      name: 'income',
      title: isRTL ? 'صافي الايراد' : 'Total Income',
    },
  ]);

  const [rows, setRows] = useState([]);

  const [item, setItem] = useState(null);
  const [openItem, setOpenItem] = useState(false);

  const [loadTasks, tasksData]: any = useLazyQuery(getObjectProjects, {
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    if (openItem) {
      const tsks = tasksData?.data?.['getObjectProjects']?.data || [];
      if (tsks && tsks.length > 0) {
        const opened = tsks.filter((ts: any) => ts._id === item._id)?.[0];
        setItem(opened);
      }
    }
  }, [tasksData]);

  useEffect(() => {
    const variables = {
      [name]: id,
    };
    loadTasks({
      variables,
    });
  }, [id]);

  const [tableColumnVisibilityColumnExtensions] = useState([
    { columnName: col.title.name, togglingEnabled: false },
  ]);

  useEffect(() => {
    if (tasksData?.data?.getObjectProjects?.data) {
      const { data } = tasksData.data.getObjectProjects;
      const rdata = updateDocNumbers(data);
      setRows(rdata);
    }
  }, [tasksData]);

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
          <IntegratedSorting />
          <VirtualTable
            height={680}
            messages={{
              noData: isRTL ? 'لا يوجد بيانات' : 'no data',
            }}
            estimatedRowHeight={40}
            tableComponent={TableComponent}
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
            defaultHiddenColumnNames={[
              col.department.name,
              col.evQty.name,
              col.toatlExpenses.name,
              col.start.name,
              col.end.name,
            ]}
          />
          <DataTypeProvider
            for={['title']}
            formatterComponent={(props: any) =>
              nameLinkFormat({ ...props, setItem, setOpenItem })
            }
          ></DataTypeProvider>
          <DataTypeProvider
            for={['start', 'end']}
            formatterComponent={createdAtFormatter}
          ></DataTypeProvider>
          <DataTypeProvider
            for={['due']}
            formatterComponent={dueAmountFormatter}
          ></DataTypeProvider>
          <DataTypeProvider
            for={['amount', 'toatlExpenses', 'totalpaid']}
            formatterComponent={currencyFormatterEmpty}
          ></DataTypeProvider>
          <DataTypeProvider
            for={['totalinvoiced']}
            formatterComponent={invoiceReceiptFormatter}
          ></DataTypeProvider>
          <DataTypeProvider
            for={['income']}
            formatterComponent={incomeAmountFormatter}
          ></DataTypeProvider>
          <DataTypeProvider
            for={['tasktype']}
            formatterComponent={taskNameFormatter}
          ></DataTypeProvider>
          <DataTypeProvider
            for={['progress']}
            formatterComponent={progressFormatter}
          ></DataTypeProvider>
        </Grid>
      </Paper>
    </Box>
  );
}
