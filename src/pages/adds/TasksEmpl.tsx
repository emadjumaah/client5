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
import { Command, PopupEditing } from '../../Shared';
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
import { Box, Button, Typography } from '@material-ui/core';
import TasksContext from '../../contexts/tasks';
import getEmplTasks from '../../graphql/query/getEmplTasks';
import PopupTask from '../../pubups/PopupTask';
import createTask from '../../graphql/mutation/createTask';
import updateTask from '../../graphql/mutation/updateTask';
import deleteTaskById from '../../graphql/mutation/deleteTaskById';
import { useCustomers, useProducts } from '../../hooks';
import PopupGantt from '../../pubups/PopupGantt';
import { errorAlert, errorDeleteAlert } from '../../Shared/helpers';
import { TableComponent } from '../../Shared/TableComponent';
import DateNavigatorReports from '../../components/filters/DateNavigatorReports';
import PopupTaskView from '../../pubups/PopupTaskView';
import useDepartments from '../../hooks/useDepartments';
import useEmployees from '../../hooks/useEmployees';
import useResourses from '../../hooks/useResourses';
import useProjects from '../../hooks/useProjects';
import useWindowDimensions from '../../hooks/useWindowDimensions';

export const getRowId = (row: { _id: any }) => row._id;

export default function TasksEmpl({
  isRTL,
  words,
  menuitem,
  theme,
  company,
  servicesproducts,
}) {
  const [alrt, setAlrt] = useState({ show: false, msg: '', type: undefined });

  const col = getColumns({ isRTL, words });

  const [columns] = useState([
    col.title,
    col.createdAt,
    // col.docNo,
    col.start,
    col.end,
    col.customer,
    col.department,
    col.employee,
    col.evQty,
    col.progress,
    { name: 'amount', title: isRTL ? '????????????????' : 'Total' },
    col.totalinvoiced,
    col.totalpaid,
    {
      id: 40,
      ref: 'due',
      name: 'due',
      title: isRTL ? '??????????????' : 'Due Payment',
    },
    col.toatlExpenses,
    {
      id: 38,
      ref: 'income',
      name: 'income',
      title: isRTL ? '???????? ??????????????' : 'Total Income',
    },
  ]);

  const [rows, setRows] = useState([]);
  const [openGantt, setOpenGantt] = useState(false);
  const [start, setStart] = useState<any>(null);
  const [end, setEnd] = useState<any>(null);
  const [periodvalue, setPeriodvalue] = useState<any>(null);

  const [item, setItem] = useState(null);
  const [openItem, setOpenItem] = useState(false);
  const { departments } = useDepartments();
  const { employees } = useEmployees();
  const { resourses } = useResourses();
  const { projects } = useProjects();
  const { products } = useProducts();
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

  const [loadTasks, tasksData]: any = useLazyQuery(getEmplTasks);

  const refresQuery = {
    refetchQueries: [
      {
        query: getEmplTasks,
        variables: {
          start: start ? start.setHours(0, 0, 0, 0) : undefined,
          end: end ? end.setHours(23, 59, 59, 999) : undefined,
        },
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
    if (tasksData?.data?.getEmplTasks?.data) {
      const { data } = tasksData.data.getEmplTasks;
      setRows(data);
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
      loading={tasksData?.loading}
      // bgcolor={colors.deepPurple[400]}
    >
      <Paper>
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
          <Box style={{}}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpenGantt(true)}
            >
              {isRTL ? '?????? ??????????????' : 'Task View'}
            </Button>
          </Box>
        </Box>

        <Paper>
          <Grid rows={rows} columns={columns} getRowId={getRowId}>
            <SortingState />
            <EditingState onCommitChanges={commitChanges} />
            <SearchState />

            <IntegratedSorting />
            <IntegratedFiltering />

            <VirtualTable
              height={height - 100}
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
            <TableColumnVisibility
              columnExtensions={tableColumnVisibilityColumnExtensions}
              defaultHiddenColumnNames={[
                col.createdAt.name,
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
                nameLinkFormat({ ...props, setItem, setOpenItem, isRTL })
              }
            ></DataTypeProvider>
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
                customers={customers}
                projects={projects}
                addCustomer={addCustomer}
                editCustomer={editCustomer}
                company={company}
                theme={theme}
                refresh={refresh}
                startrange={start}
                endrange={end}
              ></PopupTask>
            </PopupEditing>
          </Grid>
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
              servicesproducts={servicesproducts}
              products={products}
              refresh={refresh}
              startrange={start}
              endrange={end}
              addAction={addTask}
              editAction={editTask}
            ></PopupTaskView>
          )}
        </Paper>
      </Paper>
    </PageLayout>
  );
}
