/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useEffect, useState } from 'react';
import Paper from '@material-ui/core/Paper';
import {
  SortingState,
  IntegratedSorting,
  DataTypeProvider,
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
import { useLazyQuery, useMutation } from '@apollo/client';
import { createFinance, deleteFinance, updateFinance } from '../graphql';
import {
  accountFormatter,
  currencyFormatter,
  customerAccountFormatter,
  samllFormatter,
  timeFormatter,
} from './colorFormat';
import useAccounts from '../hooks/useAccounts';
import getReceipts from '../graphql/query/getReceipts';
import { Box, Typography } from '@material-ui/core';
import useTasks from '../hooks/useTasks';
import PopupReceipt from '../pubups/PopupReceipt';
import { getColumns } from '../common/columns';
import getGereralCalculation from '../graphql/query/getGereralCalculation';
import { getTasks } from '../graphql/query';

export default function ReceiptCustomer({
  isRTL,
  words,
  theme,
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
}: any) {
  const col = getColumns({ isRTL, words });

  const [columns] = useState([
    { name: 'time', title: words.time },
    { name: 'creditAcc', title: words.customer },
    { name: 'debitAcc', title: isRTL ? 'حساب القبض' : 'Receipt Acc' },
    col.customer,
    col.resourse,
    { name: 'desc', title: words.description },
    { name: 'docNo', title: words.no },
    { name: 'amount', title: words.amount },
  ]);

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const { tasks } = useTasks();
  const [loadFinances, financeData]: any = useLazyQuery(getReceipts, {
    nextFetchPolicy: 'cache-and-network',
  });
  const { accounts } = useAccounts();
  const refresQuery = {
    refetchQueries: [
      {
        query: getReceipts,
        variables: {
          [name]: id,
          start: start ? start.setHours(0, 0, 0, 0) : undefined,
          end: end ? end.setHours(23, 59, 59, 999) : undefined,
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
    ],
  };

  useEffect(() => {
    const variables = {
      [name]: id,
      start: start ? start.setHours(0, 0, 0, 0) : undefined,
      end: end ? end.setHours(23, 59, 59, 999) : undefined,
    };
    loadFinances({
      variables,
    });
  }, [id, start, end]);

  const [addFinance] = useMutation(createFinance, refresQuery);
  const [editFinance] = useMutation(updateFinance, refresQuery);
  const [removeFinance] = useMutation(deleteFinance, refresQuery);

  const commitChanges = async ({ deleted }) => {
    if (deleted) {
      const _id = deleted[0];
      removeFinance({ variables: { _id } });
      setRows(rows.filter((row: any) => row._id !== _id));
    }
  };
  useEffect(() => {
    if (financeData?.loading) {
      setLoading(true);
    }
    if (financeData?.data?.getReceipts?.data) {
      const { data } = financeData.data.getReceipts;
      const rdata = updateDocNumbers(data);
      setRows(rdata);
      setLoading(false);
    }
  }, [financeData]);
  const isEditable =
    name !== 'resourseId' && name !== 'departmentId' && name !== 'employeeId';
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
              customerAccountFormatter(props, accounts, isRTL)
            }
          ></DataTypeProvider>
          <DataTypeProvider
            for={['debitAcc']}
            formatterComponent={(props) =>
              accountFormatter(props, accounts, isRTL)
            }
          ></DataTypeProvider>
          <TableEditColumn
            showEditCommand={isEditable}
            showDeleteCommand={isEditable}
            showAddCommand={isEditable}
            commandComponent={Command}
          ></TableEditColumn>
          <PopupEditing
            theme={theme}
            addAction={addFinance}
            editAction={editFinance}
          >
            <PopupReceipt
              company={company}
              name={name}
              value={value}
              tasks={tasks}
            ></PopupReceipt>
          </PopupEditing>
        </Grid>
        {loading && <Loading isRTL={isRTL} />}
      </Paper>
    </Box>
  );
}
