/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useEffect, useState } from 'react';
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
import {
  createExpenses,
  deleteExpenses,
  getCustomers,
  getDepartments,
  getEmployees,
  getExpenses,
  getLastNos,
  getResourses,
  updateExpenses,
} from '../graphql';
import {
  accountFormatter,
  currencyFormatter,
  samllFormatter,
  timeFormatter,
} from './colorFormat';
import useAccounts from '../hooks/useAccounts';
import useTasks from '../hooks/useTasks';
import { Box, Typography } from '@material-ui/core';
import { useExpenseItems, useTemplate } from '../hooks';
import useDepartmentsUp from '../hooks/useDepartmentsUp';
import useEmployeesUp from '../hooks/useEmployeesUp';
import useResoursesUp from '../hooks/useResoursesUp';
import PopupExpensesDoc from '../pubups/PopupExpensesDoc';
import getTasks from '../graphql/query/getTasks';
import { getColumns } from '../common/columns';

export default function ExpensesCustomer({
  isRTL,
  words,
  theme,
  name,
  id,
  company,
  value,
  width,
  height,
  start,
  end,
}: any) {
  const { tempoptions, tempwords } = useTemplate();
  const col = getColumns({ isRTL, words });

  const [columns] = useState(
    tempoptions?.noTsk
      ? [
          { name: 'time', title: words.time },
          { name: 'debitAcc', title: isRTL ? 'حساب المصروف' : 'Expenses Acc' },
          { name: 'creditAcc', title: isRTL ? 'حساب الدفع' : 'Payment Acc' },
          {
            name: isRTL ? 'departmentNameAr' : 'departmentName',
            title: words.department,
          },
          {
            name: isRTL ? 'employeeNameAr' : 'employeeName',
            title: `${words.employee}`,
          },
          { name: 'desc', title: words.description },
          { name: 'amount', title: words.amount },
        ]
      : [
          { name: 'time', title: words.time },
          { name: 'debitAcc', title: isRTL ? 'حساب المصروف' : 'Expenses Acc' },
          { name: 'creditAcc', title: isRTL ? 'حساب الدفع' : 'Payment Acc' },
          {
            name: isRTL ? 'departmentNameAr' : 'departmentName',
            title: words.department,
          },
          {
            name: isRTL ? 'employeeNameAr' : 'employeeName',
            title: `${words.employee}`,
          },
          {
            name: isRTL ? 'contractNameAr' : 'contractName',
            title: tempwords.task,
          },
          col.customer,
          col.resourse,
          { name: 'desc', title: words.description },
          { name: 'amount', title: words.amount },
        ]
  );

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const { tasks } = useTasks();
  const { accounts } = useAccounts();

  const { expenseItems } = useExpenseItems();
  const { departments } = useDepartmentsUp();
  const { employees } = useEmployeesUp();
  const { resourses } = useResoursesUp();

  const [loadExpenses, expensesData]: any = useLazyQuery(getExpenses, {
    fetchPolicy: 'cache-and-network',
  });
  const refresQuery = {
    refetchQueries: [
      {
        query: getExpenses,
        variables: {
          [name]: id,
          start: start ? start.setHours(0, 0, 0, 0) : undefined,
          end: end ? end.setHours(23, 59, 59, 999) : undefined,
          opType: 60,
        },
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
    ],
  };

  useEffect(() => {
    const variables = {
      [name]: id,
      start: start ? start.setHours(0, 0, 0, 0) : undefined,
      end: end ? end.setHours(23, 59, 59, 999) : undefined,
      opType: 60,
    };
    loadExpenses({
      variables,
    });
  }, [id, start, end]);

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
      const rdata = updateDocNumbers(data);
      setRows(rdata);
      setLoading(false);
    }
  }, [expensesData]);

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
              accountFormatter(props, accounts, isRTL)
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
            <PopupExpensesDoc
              resourses={resourses}
              employees={employees}
              departments={departments}
              company={company}
              servicesproducts={expenseItems}
              tasks={tasks}
              value={value}
              name={name}
            ></PopupExpensesDoc>
          </PopupEditing>
        </Grid>
        {loading && <Loading isRTL={isRTL} />}
      </Paper>
    </Box>
  );
}
