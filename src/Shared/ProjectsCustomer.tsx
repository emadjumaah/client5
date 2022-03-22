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
  getLandingChartData,
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
  // taskStatusFormatter,
} from './colorFormat';
import { AlertLocal } from '../components';
import { getColumns } from '../common/columns';
import PopupTask from '../pubups/PopupTask';
import createTask from '../graphql/mutation/createTask';
import updateTask from '../graphql/mutation/updateTask';
import deleteTaskById from '../graphql/mutation/deleteTaskById';
import { useCustomers, useDepartments } from '../hooks';
import { errorAlert, errorDeleteAlert } from './helpers';
import { TableComponent } from './TableComponent';
import useTasks from '../hooks/useTasks';
import useEmployeesUp from '../hooks/useEmployeesUp';
import useResoursesUp from '../hooks/useResoursesUp';
import useProjects from '../hooks/useProjects';
import PopupProjectView from '../pubups/PopupProjectView';
import getObjectProjects from '../graphql/query/getObjectProjects';

export const getRowId = (row: { _id: any }) => row._id;

export default function ProjectsCustomer({
  isRTL,
  words,
  theme,
  company,
  servicesproducts,
  value,
  name,
  id,
}) {
  const [alrt, setAlrt] = useState({ show: false, msg: '', type: undefined });
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

  const { customers, addCustomer, editCustomer } = useCustomers();
  const { departments } = useDepartments();
  const { employees } = useEmployeesUp();
  const { resourses } = useResoursesUp();
  const { projects } = useProjects();
  const { tasks } = useTasks();

  const onCloseItem = () => {
    setOpenItem(false);
    setItem(null);
  };

  const [loadTasks, tasksData]: any = useLazyQuery(getObjectProjects, {
    fetchPolicy: 'cache-and-network',
  });

  const refresQuery = {
    refetchQueries: [
      {
        query: getObjectProjects,
        variables: { [name]: id },
      },
      {
        query: getObjectProjects,
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
        query: getLandingChartData,
      },
    ],
  };

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
    if (tasksData?.data?.getObjectProjects?.data) {
      const { data } = tasksData.data.getObjectProjects;
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
      <Grid rows={rows} columns={columns} getRowId={getRowId}>
        <SortingState />
        <EditingState onCommitChanges={commitChanges} />
        <IntegratedSorting />
        <VirtualTable
          height={600}
          messages={{
            noData: isRTL ? 'لا يوجد بيانات' : 'no data',
          }}
          estimatedRowHeight={40}
          tableComponent={TableComponent}
        />
        <TableHeaderRow showSortingControls />
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
            servicesproducts={servicesproducts}
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
        <PopupProjectView
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
          refresh={refresh}
          addAction={addTask}
          editAction={editTask}
        ></PopupProjectView>
      )}
    </Paper>
  );
}
