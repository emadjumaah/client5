/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useEffect, useState } from 'react';
import Paper from '@material-ui/core/Paper';
import {
  EditingState,
  SortingState,
  IntegratedSorting,
  DataTypeProvider,
} from '@devexpress/dx-react-grid';
import {
  Grid,
  TableHeaderRow,
  TableEditColumn,
  VirtualTable,
} from '@devexpress/dx-react-grid-material-ui';
import { Command, Loading, PopupEditing } from '.';
import { getRowId, updateDocNumbers } from '../common';
import { useLazyQuery, useMutation } from '@apollo/client';
import {
  createFinance,
  deleteFinance,
  getRefresQuery,
  updateFinance,
} from '../graphql';
import {
  accountFormatter,
  currencyFormatter,
  customerAccountFormatter,
  samllFormatter,
  timeFormatter,
} from './colorFormat';
import useAccounts from '../hooks/useAccounts';

import getReceipts from '../graphql/query/getReceipts';
import PopupReceipt from '../pubups/PopupReceipt';
import useTasks from '../hooks/useTasks';
import React from 'react';
import useCompany from '../hooks/useCompany';
import { Typography } from '@material-ui/core';

export default function ReceiptTask({ isRTL, words, theme, contractId }) {
  const [columns] = useState([
    { name: 'time', title: words.time },
    { name: 'creditAcc', title: words.customer },
    { name: 'debitAcc', title: isRTL ? 'حساب القبض' : 'Receipt Acc' },

    { name: 'desc', title: words.description },
    { name: 'docNo', title: words.no },
    { name: 'amount', title: words.amount },
  ]);

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [vars, setVars] = useState<any>({});

  const { tasks } = useTasks();
  const { company } = useCompany();

  const [loadFinances, financeData]: any = useLazyQuery(getReceipts);
  const { accounts } = useAccounts();
  const refresQuery = {
    refetchQueries: [
      {
        query: getReceipts,
        variables: {
          contractId,
        },
      },
      ...getRefresQuery({ ...vars, isRTL }),
    ],
  };

  useEffect(() => {
    const variables = {
      contractId,
    };
    loadFinances({
      variables,
    });
  }, [contractId]);

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
          showEditCommand
          showDeleteCommand
          showAddCommand
          commandComponent={Command}
        ></TableEditColumn>
        <PopupEditing
          theme={theme}
          addAction={addFinance}
          editAction={editFinance}
        >
          <PopupReceipt
            setVars={setVars}
            company={company}
            tasks={tasks}
          ></PopupReceipt>
        </PopupEditing>
      </Grid>
      {loading && <Loading isRTL={isRTL} />}
    </Paper>
  );
}
