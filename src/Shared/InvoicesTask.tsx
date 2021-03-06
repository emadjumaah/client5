/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useEffect, useState } from 'react';
import Paper from '@material-ui/core/Paper';
import {
  EditingState,
  SortingState,
  IntegratedSorting,
  DataTypeProvider,
  IntegratedFiltering,
} from '@devexpress/dx-react-grid';
import {
  Grid,
  TableHeaderRow,
  TableEditColumn,
  VirtualTable,
} from '@devexpress/dx-react-grid-material-ui';
import { Command, Loading, PopupEditing } from '.';
import { getRowId, updateDocNumbers } from '../common';
import { PopupInvoice } from '../pubups';
import {
  createInvoice,
  deleteInvoice,
  getInvoices,
  updateInvoice,
} from '../graphql';
import { useLazyQuery, useMutation } from '@apollo/client';
import {
  amountFormatter,
  currencyFormatter,
  timeFormatter,
} from './colorFormat';

import { getColumns } from '../common/columns';
import { TableComponent } from '../pages/reports/SalesReport';
import { Typography } from '@material-ui/core';

export default function InvoicesTask({
  isRTL,
  words,
  employees,
  departments,
  company,
  servicesproducts,
  contractId,
  tasks,
  task,
}) {
  const col = getColumns({ isRTL, words });

  const [columns] = useState([
    { name: 'time', title: words.time },
    { name: 'docNo', title: words.no },
    col.eventNo,
    col.contract,
    { name: isRTL ? 'customerNameAr' : 'customerName', title: words.customer },
    { name: 'customerPhone', title: words.phoneNumber },
    { name: 'total', title: words.total },
    { name: 'discount', title: words.discount },
    { name: 'amount', title: words.amount },
  ]);

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const [loadInvoices, opData]: any = useLazyQuery(getInvoices);

  const refresQuery = {
    refetchQueries: [
      {
        query: getInvoices,
        variables: {
          contractId,
        },
      },
    ],
  };

  useEffect(() => {
    const variables = {
      contractId,
    };

    loadInvoices({
      variables,
    });
  }, [contractId]);

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
    <Paper
      style={{
        maxHeight: 600,
        overflow: 'auto',
        margin: 10,
        minHeight: 600,
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
            noData: isRTL ? '???? ???????? ????????????' : 'no data',
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
            employees={employees}
            departments={departments}
            company={company}
            servicesproducts={servicesproducts}
            task={task}
          ></PopupInvoice>
        </PopupEditing>
      </Grid>
      {loading && <Loading isRTL={isRTL} />}
    </Paper>
  );
}
