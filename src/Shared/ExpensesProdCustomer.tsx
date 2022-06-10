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
import { getRowId, updateDocNumbers } from '../common';
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
import useTasks from '../hooks/useTasks';
import getTasks from '../graphql/query/getTasks';
import useCompany from '../hooks/useCompany';
import { Box } from '@material-ui/core';
import DateNavigatorReports from '../components/filters/DateNavigatorReports';
import { useProducts, useTemplate } from '../hooks';
import useDepartmentsUp from '../hooks/useDepartmentsUp';
import useEmployeesUp from '../hooks/useEmployeesUp';
import useResoursesUp from '../hooks/useResoursesUp';
import PopupExpProducts from '../pubups/PopupExpProducts';

export default function ExpensesProdCustomer({
  isRTL,
  words,
  theme,
  name,
  id,
  value,
}) {
  const { tempoptions, tempwords } = useTemplate();
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
            name: 'taskId',
            title: tempwords.task,
          },
          { name: 'desc', title: words.description },
          { name: 'amount', title: words.amount },
        ]
  );

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const { tasks } = useTasks();
  const { company } = useCompany();
  const { accounts } = useAccounts();
  const { products } = useProducts();
  const { departments } = useDepartmentsUp();
  const { employees } = useEmployeesUp();
  const { resourses } = useResoursesUp();

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
          opType: 61,
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
      [name]: id,
      start: start ? start.setHours(0, 0, 0, 0) : undefined,
      end: end ? end.setHours(23, 59, 59, 999) : undefined,
      opType: 61,
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
          <PopupExpProducts
            resourses={resourses}
            employees={employees}
            departments={departments}
            company={company}
            servicesproducts={products}
            tasks={tasks}
            value={value}
            name={name}
          ></PopupExpProducts>
        </PopupEditing>
      </Grid>
      {loading && <Loading isRTL={isRTL} />}
    </Paper>
  );
}
