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
import { Command, PopupEditing } from '.';
import { getRowId, updateDocNumbers } from '../common';
import {
  createPurchaseInvoice,
  deletePurchaseInvoice,
  getPurchaseInvoices,
  updatePurchaseInvoice,
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
import { useProducts } from '../hooks';
import PopupPurchaseInvoice from '../pubups/PopupPurchaseInvoice';
import useResourses from '../hooks/useResourses';
import useEmployees from '../hooks/useEmployees';
import useDepartments from '../hooks/useDepartments';
import getGereralCalculation from '../graphql/query/getGereralCalculation';
import { getProducts, getProjects, getTasks } from '../graphql/query';
import RefetchBox from './RefetchBox';

export default function InvoicesSupplier({
  isRTL,
  words,
  name,
  value,
  company,
  id,
  width,
  height,
  start,
  end,
  mstart,
  mend,
  tempoptions,
  theme,
}: any) {
  const col = getColumns({ isRTL, words });

  const [columns] = useState(
    tempoptions?.noTsk
      ? [
          { name: 'time', title: words.time },
          { name: 'docNo', title: words.no },
          col.eventNo,
          {
            name: isRTL ? 'supplierNameAr' : 'supplierName',
            title: words.supplier,
          },
          { name: 'supplierPhone', title: words.phoneNumber },
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
            name: isRTL ? 'supplierNameAr' : 'supplierName',
            title: words.supplier,
          },
          { name: 'supplierPhone', title: words.phoneNumber },
          { name: 'total', title: words.total },
          { name: 'discount', title: words.discount },
          { name: 'amount', title: words.amount },
        ]
  );

  const [rows, setRows] = useState([]);

  const { tasks } = useTasks();
  const { departments } = useDepartments();
  const { employees } = useEmployees();
  const { resourses } = useResourses();
  const { products } = useProducts();

  const [loadInvoices, opData]: any = useLazyQuery(getPurchaseInvoices, {
    nextFetchPolicy: 'cache-and-network',
  });

  const refresQuery = {
    refetchQueries: [
      {
        query: getPurchaseInvoices,
        variables: {
          [name]: id,
          start: start ? new Date(start).setHours(0, 0, 0, 0) : undefined,
          end: end ? new Date(end).setHours(23, 59, 59, 999) : undefined,
        },
      },
      {
        query: getGereralCalculation,
        variables: {
          [name]: id,
          start: start ? new Date(start).setHours(0, 0, 0, 0) : undefined,
          end: end ? new Date(end).setHours(23, 59, 59, 999) : undefined,
        },
      },
      name === 'contractId'
        ? {
            query: getTasks,
            variables: {
              contractId: id,
              start: mstart ? new Date(mstart).setHours(0, 0, 0, 0) : undefined,
              end: mend ? new Date(mend).setHours(23, 59, 59, 999) : undefined,
            },
          }
        : undefined,
      name === 'contractId' ? { query: getTasks } : undefined,
      name === 'projectId' ? { query: getProjects } : undefined,
      { query: getProducts },
    ].filter((x: any) => x),
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

  const [addPurchaseInvoice] = useMutation(createPurchaseInvoice, refresQuery);
  const [editPurchaseInvoice] = useMutation(updatePurchaseInvoice, refresQuery);
  const [removePurchaseInvoice] = useMutation(
    deletePurchaseInvoice,
    refresQuery
  );

  const commitChanges = async ({ deleted }) => {
    if (deleted) {
      const _id = deleted[0];
      removePurchaseInvoice({ variables: { _id } });
      setRows(rows.filter((row: any) => row._id !== _id));
    }
  };
  useEffect(() => {
    if (opData?.data?.getPurchaseInvoices?.data) {
      const { data } = opData.data.getPurchaseInvoices;
      const rdata = updateDocNumbers(data);
      setRows(rdata);
    }
  }, [opData]);
  const refresh = () => opData?.refetch();
  const loading = opData.loading;
  return (
    <Box
      style={{
        height: height - 280,
        width: width - 300,
        margin: 10,
      }}
    >
      {' '}
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
          <PopupEditing
            addAction={addPurchaseInvoice}
            editAction={editPurchaseInvoice}
          >
            <PopupPurchaseInvoice
              value={value}
              name={name}
              resourses={resourses}
              employees={employees}
              departments={departments}
              company={company}
              servicesproducts={products}
              tasks={tasks}
            ></PopupPurchaseInvoice>
          </PopupEditing>
        </Grid>
      </Paper>
    </Box>
  );
}
