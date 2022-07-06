/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useEffect, useState } from 'react';
import Paper from '@material-ui/core/Paper';
import {
  SortingState,
  IntegratedSorting,
  DataTypeProvider,
  IntegratedFiltering,
  EditingState,
} from '@devexpress/dx-react-grid';
import {
  Grid,
  TableEditColumn,
  TableHeaderRow,
  VirtualTable,
} from '@devexpress/dx-react-grid-material-ui';
import { Command, Loading, PopupEditing } from '.';
import { getRowId, updateDocNumbers } from '../common';
import {
  createInvoice,
  deleteInvoice,
  getInvoices,
  getRefresQuery,
  updateInvoice,
} from '../graphql';
import { useLazyQuery, useMutation } from '@apollo/client';
import {
  amountFormatter,
  currencyFormatter,
  timeFormatter,
} from './colorFormat';

import { getColumns } from '../common/columns';
import useTasks from '../hooks/useTasks';
import { TableComponent } from '../pages/reports/SalesReport';
import { Box, Typography } from '@material-ui/core';
import { useServices } from '../hooks';
import { PopupInvoice } from '../pubups';
import useResoursesUp from '../hooks/useResoursesUp';
import useEmployeesUp from '../hooks/useEmployeesUp';
import useDepartmentsUp from '../hooks/useDepartmentsUp';

export default function InvoicesCustomer({
  isRTL,
  words,
  name,
  value,
  company,
  id,
  theme,
  width,
  height,
  start,
  end,
  tempoptions,
}: any) {
  const col = getColumns({ isRTL, words });

  const [columns] = useState(
    tempoptions?.noTsk
      ? [
          { name: 'time', title: words.time },
          { name: 'docNo', title: words.no },
          col.eventNo,
          {
            name: isRTL ? 'customerNameAr' : 'customerName',
            title: words.customer,
          },
          { name: 'customerPhone', title: words.phoneNumber },
          { name: 'total', title: words.total },
          { name: 'discount', title: words.discount },
          { name: 'amount', title: words.amount },
        ]
      : [
          { name: 'time', title: words.time },
          { name: 'docNo', title: words.no },
          col.eventNo,
          col.contract,
          {
            name: isRTL ? 'customerNameAr' : 'customerName',
            title: words.customer,
          },
          { name: 'customerPhone', title: words.phoneNumber },
          col.resourse,
          { name: 'total', title: words.total },
          { name: 'discount', title: words.discount },
          { name: 'amount', title: words.amount },
        ]
  );

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [vars, setVars] = useState<any>({});

  const { tasks } = useTasks();

  const { departments } = useDepartmentsUp();
  const { employees } = useEmployeesUp();
  const { resourses } = useResoursesUp();
  const { services } = useServices();

  const [loadInvoices, opData]: any = useLazyQuery(getInvoices);

  const refresQuery = {
    refetchQueries: [
      {
        query: getInvoices,
        variables: {
          [name]: id,
          start: start ? start.setHours(0, 0, 0, 0) : undefined,
          end: end ? end.setHours(23, 59, 59, 999) : undefined,
        },
      },
      ...getRefresQuery({ ...vars, isRTL }),
    ],
  };

  useEffect(() => {
    const variables = {
      [name]: id,
      start: start ? start.setHours(0, 0, 0, 0) : undefined,
      end: end ? end.setHours(23, 59, 59, 999) : undefined,
    };

    loadInvoices({
      variables,
    });
  }, [id, start, end]);

  const [addInvoice] = useMutation(createInvoice, refresQuery);
  const [editInvoice] = useMutation(updateInvoice, refresQuery);
  const [removeInvoice] = useMutation(deleteInvoice, refresQuery);

  const commitChanges = async ({ deleted }) => {
    if (deleted) {
      const _id = deleted[0];
      removeInvoice({ variables: { _id } });
      setRows(rows.filter((row: any) => row._id !== _id));
    }
  };

  useEffect(() => {
    if (opData?.loading) {
      setLoading(true);
    }
    if (opData?.data?.getInvoices?.data) {
      const { data } = opData.data.getInvoices;
      const rdata = updateDocNumbers(data);
      setRows(rdata);
      setLoading(false);
    }
  }, [opData]);

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
          <EditingState onCommitChanges={commitChanges} />

          <IntegratedSorting />
          <IntegratedFiltering />

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

          <DataTypeProvider
            for={['time']}
            formatterComponent={timeFormatter}
          ></DataTypeProvider>
          <DataTypeProvider
            for={['amount']}
            formatterComponent={amountFormatter}
          ></DataTypeProvider>
          <DataTypeProvider
            for={['total', 'discount']}
            formatterComponent={currencyFormatter}
          ></DataTypeProvider>
          <TableEditColumn
            showEditCommand
            showDeleteCommand
            showAddCommand
            commandComponent={Command}
          ></TableEditColumn>
          <PopupEditing addAction={addInvoice} editAction={editInvoice}>
            <PopupInvoice
              value={value}
              name={name}
              employees={employees}
              resourses={resourses}
              departments={departments}
              company={company}
              servicesproducts={services}
              tasks={tasks}
              setVars={setVars}
            ></PopupInvoice>
          </PopupEditing>
        </Grid>
        {loading && <Loading isRTL={isRTL} />}
      </Paper>
    </Box>
  );
}
