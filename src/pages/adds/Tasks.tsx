/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useContext, useEffect, useState } from 'react';
import Paper from '@material-ui/core/Paper';
import {
  EditingState,
  SortingState,
  IntegratedSorting,
  DataTypeProvider,
  SearchState,
  IntegratedFiltering,
} from '@devexpress/dx-react-grid';
import {
  Grid,
  TableHeaderRow,
  TableEditColumn,
  VirtualTable,
  Toolbar,
  SearchPanel,
  TableColumnVisibility,
  ColumnChooser,
} from '@devexpress/dx-react-grid-material-ui';
import { Command, Loading, PopupEditing } from '../../Shared';
import {
  getCustomers,
  getDepartments,
  getEmployees,
  getLandingChartData,
  getProjects,
  getResourses,
} from '../../graphql';
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
} from '../../Shared/colorFormat';
import PageLayout from '../main/PageLayout';
import { AlertLocal, SearchTable } from '../../components';
import { getColumns } from '../../common/columns';
import { Box, Button } from '@material-ui/core';
import TasksContext from '../../contexts/tasks';
import getTasks from '../../graphql/query/getTasks';
import PopupTask from '../../pubups/PopupTask';
import createTask from '../../graphql/mutation/createTask';
import updateTask from '../../graphql/mutation/updateTask';
import deleteTaskById from '../../graphql/mutation/deleteTaskById';
import { useCustomers, useServices } from '../../hooks';
import PopupGantt from '../../pubups/PopupGantt';
import { errorAlert, errorDeleteAlert } from '../../Shared/helpers';
import { TableComponent } from '../../Shared/TableComponent';
import DateNavigatorReports from '../../components/filters/DateNavigatorReports';
import PopupTaskView from '../../pubups/PopupTaskView';
import useDepartmentsUp from '../../hooks/useDepartmentsUp';
import useEmployeesUp from '../../hooks/useEmployeesUp';
import useResoursesUp from '../../hooks/useResoursesUp';
import useProjects from '../../hooks/useProjects';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { roles } from '../../common';

export const getRowId = (row: { _id: any }) => row._id;

export default function Tasks({ isRTL, words, menuitem, theme, company }) {
  const [alrt, setAlrt] = useState({ show: false, msg: '', type: undefined });

  const col = getColumns({ isRTL, words });

  const [columns] = useState([
    col.title,
    col.createdAt,
    col.start,
    col.end,
    col.project,
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
  const [columnsViewer] = useState([
    col.title,
    col.start,
    col.project,
    col.customer,
    col.department,
    col.employee,
    col.progress,
    { name: 'amount', title: isRTL ? 'الاجمالي' : 'Total' },
  ]);

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openGantt, setOpenGantt] = useState(false);
  const [start, setStart] = useState<any>(null);
  const [end, setEnd] = useState<any>(null);
  const [periodvalue, setPeriodvalue] = useState<any>(null);

  const [item, setItem] = useState(null);
  const [openItem, setOpenItem] = useState(false);
  const { departments } = useDepartmentsUp();
  const { employees } = useEmployeesUp();
  const { resourses } = useResoursesUp();
  const { projects } = useProjects();
  const { services } = useServices();
  const { height } = useWindowDimensions();
  const onCloseItem = () => {
    setOpenItem(false);
    setItem(null);
  };
  const {
    state: { currentDate, currentViewName, endDate },
    dispatch,
  } = useContext(TasksContext);

  const currentViewNameChange = (e: any) => {
    dispatch({ type: 'setCurrentViewName', payload: e.target.value });
  };
  const currentDateChange = (curDate: any) => {
    dispatch({ type: 'setCurrentDate', payload: curDate });
  };
  const endDateChange = (curDate: any) => {
    dispatch({ type: 'setEndDate', payload: curDate });
  };

  const [loadTasks, tasksData]: any = useLazyQuery(getTasks, {
    fetchPolicy: 'cache-and-network',
  });

  const refresQuery = {
    refetchQueries: [
      {
        query: getTasks,
        variables: {
          start: start ? start.setHours(0, 0, 0, 0) : undefined,
          end: end ? end.setHours(23, 59, 59, 999) : undefined,
        },
      },
      {
        query: getLandingChartData,
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
    loadTasks({});
  }, []);
  useEffect(() => {
    const variables = {
      start: start ? start.setHours(0, 0, 0, 0) : undefined,
      end: end ? end.setHours(23, 59, 59, 999) : undefined,
    };
    loadTasks({
      variables,
    });
  }, [start, end]);

  const [tableColumnVisibilityColumnExtensions] = useState([
    { columnName: col.title.name, togglingEnabled: false },
  ]);

  const [addTask] = useMutation(createTask, refresQuery);
  const [editTask] = useMutation(updateTask, refresQuery);
  const [removeTaskById] = useMutation(deleteTaskById, refresQuery);
  const { customers, addCustomer, editCustomer } = useCustomers();

  const commitChanges = async ({ deleted }) => {
    if (deleted) {
      const _id = deleted[0];
      setLoading(true);
      const res = await removeTaskById({ variables: { _id } });
      if (res?.data?.deleteTaskById?.ok === false) {
        if (res?.data?.deleteTaskById?.error.includes('related')) {
          await errorDeleteAlert(setAlrt, isRTL);
        } else {
          await errorAlert(setAlrt, isRTL);
        }
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tasksData?.loading) {
      setLoading(true);
    }
    if (tasksData?.data?.getTasks?.data) {
      const { data } = tasksData.data.getTasks;
      setRows(data);
      setLoading(false);
    }
  }, [tasksData]);

  const refresh = () => {
    tasksData?.refetch();
  };

  return (
    <PageLayout
      menuitem={menuitem}
      isRTL={isRTL}
      words={words}
      theme={theme}
      refresh={refresh}
      periodvalue={periodvalue}
      setPeriodvalue={setPeriodvalue}
      // bgcolor={colors.deepPurple[400]}
    >
      <Box
        style={{
          height: height - 50,
          overflow: 'auto',
          backgroundColor: '#fff',
          marginLeft: 5,
          marginRight: 5,
        }}
      >
        <Box
          display="flex"
          style={{
            position: 'absolute',
            zIndex: 111,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
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
            // color={colors.deepPurple[700]}
            // bgcolor={colors.deepPurple[50]}
          ></DateNavigatorReports>
          {rows?.length > 0 && (
            <Box style={{}}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setOpenGantt(true)}
              >
                {isRTL ? 'عرض المهمات' : 'Task View'}
              </Button>
            </Box>
          )}
        </Box>

        <Paper>
          <Grid
            rows={rows}
            columns={roles.isEditor() ? columns : columnsViewer}
            getRowId={getRowId}
          >
            <SortingState />
            <EditingState onCommitChanges={commitChanges} />
            <SearchState />

            <IntegratedSorting />
            <IntegratedFiltering />

            <VirtualTable
              height={height - 98}
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
                col.createdAt.name,
                col.department.name,
                col.project.name,
                col.evQty.name,
                col.toatlExpenses.name,
                // col.end.name,
                'progress',
                'totalinvoiced',
                'totalpaid',
                'due',
                'income',
              ]}
            />
            {roles.isEditor() && (
              <DataTypeProvider
                for={['title']}
                formatterComponent={(props: any) =>
                  nameLinkFormat({ ...props, setItem, setOpenItem })
                }
              ></DataTypeProvider>
            )}
            <DataTypeProvider
              for={['start', 'end', 'createdAt']}
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

            <Toolbar />
            <ColumnChooser />
            <SearchPanel
              inputComponent={(props: any) => {
                return <SearchTable isRTL={isRTL} {...props}></SearchTable>;
              }}
            />

            <PopupEditing addAction={addTask} editAction={editTask}>
              <PopupTask
                resourses={resourses}
                employees={employees}
                departments={departments}
                projects={projects}
                customers={customers}
                addCustomer={addCustomer}
                editCustomer={editCustomer}
                company={company}
                servicesproducts={services}
                theme={theme}
                refresh={refresh}
                startrange={start}
                endrange={end}
              ></PopupTask>
            </PopupEditing>
          </Grid>
          {loading && <Loading isRTL={isRTL} />}
          <PopupGantt
            open={openGantt}
            onClose={() => setOpenGantt(false)}
            tasks={rows}
            theme={theme}
            isRTL={isRTL}
          ></PopupGantt>
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
              tasks={rows}
              isNew={false}
              theme={theme}
              resourses={resourses}
              employees={employees}
              departments={departments}
              customers={customers}
              addCustomer={addCustomer}
              editCustomer={editCustomer}
              company={company}
              servicesproducts={services}
              refresh={refresh}
              startrange={start}
              endrange={end}
              addAction={addTask}
              editAction={editTask}
            ></PopupTaskView>
          )}
        </Paper>
      </Box>
    </PageLayout>
  );
}
