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
  TableColumnVisibility,
} from '@devexpress/dx-react-grid-material-ui';
import { Command, PopupEditing } from '.';
import {
  getCustomers,
  getDepartments,
  getEmployees,
  getProjects,
  getResourses,
} from '../graphql';
import { useLazyQuery, useMutation } from '@apollo/client';
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
import { AlertLocal } from '../components';
import { getColumns } from '../common/columns';
import getTasks from '../graphql/query/getTasks';
import PopupTask from '../pubups/PopupTask';
import createTask from '../graphql/mutation/createTask';
import updateTask from '../graphql/mutation/updateTask';
import deleteTaskById from '../graphql/mutation/deleteTaskById';
import { useCustomers, useDepartments } from '../hooks';
import { errorAlert, errorDeleteAlert } from './helpers';
import { TableComponent } from './TableComponent';
import PopupTaskView from '../pubups/PopupTaskView';
import useTasks from '../hooks/useTasks';
import useEmployeesUp from '../hooks/useEmployeesUp';
import useResoursesUp from '../hooks/useResoursesUp';
import useProjects from '../hooks/useProjects';
import { Box, Typography } from '@material-ui/core';
import DateNavigatorReports from '../components/filters/DateNavigatorReports';

export const getRowId = (row: { _id: any }) => row._id;

export default function TasksCustomer({
  isRTL,
  words,
  theme,
  company,
  servicesproducts,
  products,
  value,
  name,
  id,
}) {
  const [alrt, setAlrt] = useState({ show: false, msg: '', type: undefined });
  const col = getColumns({ isRTL, words });
  const [columns] = useState([
    col.title,
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

  const { customers, addCustomer, editCustomer } = useCustomers();
  const { departments } = useDepartments();
  const { employees } = useEmployeesUp();
  const { resourses } = useResoursesUp();
  const { projects } = useProjects();
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

  const onCloseItem = () => {
    setOpenItem(false);
    setItem(null);
  };

  const [loadTasks, tasksData]: any = useLazyQuery(getTasks);

  const refresQuery = {
    refetchQueries: [
      {
        query: getTasks,
        variables: {
          [name]: id,
          start: start ? start.setHours(0, 0, 0, 0) : undefined,
          end: end ? end.setHours(23, 59, 59, 999) : undefined,
        },
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
    if (openItem) {
      const tsks = tasksData?.data?.['getTasks']?.data || [];
      if (tsks && tsks.length > 0) {
        const opened = tsks.filter((ts: any) => ts._id === item._id)?.[0];
        setItem(opened);
      }
    }
  }, [tasksData]);

  useEffect(() => {
    const variables = {
      [name]: id,
      start: start ? start.setHours(0, 0, 0, 0) : undefined,
      end: end ? end.setHours(23, 59, 59, 999) : undefined,
    };
    loadTasks({
      variables,
    });
  }, [id, start, end]);

  const [tableColumnVisibilityColumnExtensions] = useState([
    { columnName: col.title.name, togglingEnabled: false },
  ]);

  const [addTask] = useMutation(createTask, refresQuery);
  const [editTask] = useMutation(updateTask, refresQuery);
  const [removeTaskById] = useMutation(deleteTaskById, refresQuery);

  const commitChanges = async ({ deleted }) => {
    if (deleted) {
      const _id = deleted[0];
      const res = await removeTaskById({ variables: { _id } });
      if (res?.data?.deleteTaskById?.ok === false) {
        if (res?.data?.deleteTaskById?.error.includes('related')) {
          await errorDeleteAlert(setAlrt, isRTL);
        } else {
          await errorAlert(setAlrt, isRTL);
        }
      }
    }
  };

  useEffect(() => {
    if (tasksData?.data?.getTasks?.data) {
      const { data } = tasksData.data.getTasks;
      setRows(data);
    }
  }, [tasksData]);

  const refresh = () => {
    tasksData?.refetch();
  };

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

        <TableEditColumn
          showEditCommand
          showDeleteCommand
          showAddCommand
          commandComponent={Command}
        ></TableEditColumn>
        <PopupEditing addAction={addTask} editAction={editTask}>
          <PopupTask
            value={value}
            name={name}
            employees={employees}
            resourses={resourses}
            departments={departments}
            customers={customers}
            addCustomer={addCustomer}
            editCustomer={editCustomer}
            company={company}
            projects={projects}
            theme={theme}
            refresh={refresh}
          ></PopupTask>
        </PopupEditing>
      </Grid>
      {alrt.show && (
        <AlertLocal
          isRTL={isRTL}
          type={alrt?.type}
          msg={alrt?.msg}
          top
        ></AlertLocal>
      )}
      {item && (
        <PopupTaskView
          open={openItem}
          onClose={onCloseItem}
          item={item}
          tasks={tasks}
          isNew={false}
          theme={theme}
          resourses={resourses}
          employees={employees}
          departments={departments}
          customers={customers}
          addCustomer={addCustomer}
          editCustomer={editCustomer}
          company={company}
          servicesproducts={servicesproducts}
          products={products}
          refresh={refresh}
          addAction={addTask}
          editAction={editTask}
        ></PopupTaskView>
      )}
    </Paper>
  );
}
