/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useEffect, useState } from 'react';
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
import { getRowId } from '../common';
import { useLazyQuery, useMutation } from '@apollo/client';
import {
  createExpenses,
  deleteExpenses,
  getCustomers,
  getDepartments,
  getEmployees,
  getExpenses,
  getLandingChartData,
  getLastNos,
  getProjects,
  getResourses,
  updateExpenses,
} from '../graphql';
import {
  accountFormatter,
  currencyFormatter,
  samllFormatter,
  taskIdFormatter,
  timeFormatter,
} from './colorFormat';
import useAccounts from '../hooks/useAccounts';
import PopupExpenses from '../pubups/PopupExpenses';
import useTasks from '../hooks/useTasks';
import getTasks from '../graphql/query/getTasks';
import useCompany from '../hooks/useCompany';

export default function ExpensesTask({ isRTL, words, theme, taskId }) {
  const [columns] = useState([
    { name: 'time', title: words.time },
    { name: 'debitAcc', title: isRTL ? 'حساب المصروف' : 'Expenses Acc' },
    { name: 'creditAcc', title: isRTL ? 'حساب الدفع' : 'Payment Acc' },
    {
      name: isRTL ? 'departmentNameAr' : 'departmentName',
      title: words.department,
    },
    {
      name: isRTL ? 'employeeNameAr' : 'employeeName',
      title: `${words.employee} / ${words.resourses}`,
    },
    {
      name: 'taskId',
      title: isRTL ? 'المهمة' : 'Task',
    },
    { name: 'desc', title: words.description },

    { name: 'amount', title: words.amount },
  ]);

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const { tasks } = useTasks();
  const { company } = useCompany();

  const [loadExpenses, expensesData]: any = useLazyQuery(getExpenses, {
    fetchPolicy: 'cache-and-network',
  });
  const { accounts } = useAccounts();
  const refresQuery = {
    refetchQueries: [
      {
        query: getExpenses,
        variables: {
          taskId,
        },
      },
      {
        query: getLandingChartData,
      },
      {
        query: getLastNos,
      },
      {
        query: getTasks,
      },
      {
        query: getCustomers,
      },
      {
        query: getEmployees,
        variables: { isRTL, resType: 1 },
      },
      {
        query: getDepartments,
        variables: { isRTL, depType: 1 },
      },
      {
        query: getResourses,
        variables: { isRTL, resType: 1 },
      },
      {
        query: getProjects,
      },
    ],
  };

  useEffect(() => {
    const variables = {
      taskId,
    };
    loadExpenses({
      variables,
    });
  }, [taskId]);

  const [addExpenses] = useMutation(createExpenses, refresQuery);
  const [editExpenses] = useMutation(updateExpenses, refresQuery);
  const [removeExpenses] = useMutation(deleteExpenses, refresQuery);

  const commitChanges = async ({ deleted }) => {
    if (deleted) {
      const _id = deleted[0];
      removeExpenses({ variables: { _id } });
      setRows(rows.filter((row: any) => row._id !== _id));
    }
  };

  useEffect(() => {
    if (expensesData?.loading) {
      setLoading(true);
    }
    if (expensesData?.data?.getExpenses?.data) {
      const { data } = expensesData.data.getExpenses;
      setRows(data);
      setLoading(false);
    }
  }, [expensesData]);

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
          height={550}
          messages={{
            noData: isRTL ? 'لا يوجد بيانات' : 'no data',
          }}
          estimatedRowHeight={40}
        />
        <TableHeaderRow showSortingControls />
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
          for={['taskId']}
          formatterComponent={(props: any) =>
            taskIdFormatter({ ...props, tasks })
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
          addAction={addExpenses}
          editAction={editExpenses}
        >
          <PopupExpenses company={company} tasks={tasks}></PopupExpenses>
        </PopupEditing>
      </Grid>
      {loading && <Loading isRTL={isRTL} />}
    </Paper>
  );
}
