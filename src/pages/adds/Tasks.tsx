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
  PagingState,
  IntegratedPaging,
} from '@devexpress/dx-react-grid';
import {
  Grid,
  TableHeaderRow,
  TableEditColumn,
  Toolbar,
  SearchPanel,
  TableColumnVisibility,
  ColumnChooser,
  DragDropProvider,
  Table,
  TableColumnReordering,
  TableColumnResizing,
  PagingPanel,
} from '@devexpress/dx-react-grid-material-ui';
import { Command, Loading, PopupEditing } from '../../Shared';
import { getResourses } from '../../graphql';
import { useLazyQuery, useMutation } from '@apollo/client';
import {
  appointTaskFormatter,
  createdAtFormatter,
  daysdataFormatter,
  dueAmountFormatter,
  expensesFormatter,
  kaidsFormatter,
  purchaseFormatter,
  raseedFormatter,
  salesTaskFormatter,
  taskdataFormatter,
  taskTitleNameFormatter,
} from '../../Shared/colorFormat';
import PageLayout from '../main/PageLayout';
import { AlertLocal, SearchTable } from '../../components';
import { getColumns } from '../../common/columns';
import { Box, Typography } from '@material-ui/core';
import getTasks from '../../graphql/query/getTasks';
import PopupTaskFull from '../../pubups/PopupTaskFull';
import createTask from '../../graphql/mutation/createTask';
import updateTask from '../../graphql/mutation/updateTask';
import deleteTaskById from '../../graphql/mutation/deleteTaskById';
import { useCustomers } from '../../hooks';
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
import closeTask from '../../graphql/mutation/closeTask';
import { getTaskStatus } from '../../common/helpers';
import { ContractContext } from '../../contexts/managment';

export const getRowId = (row: { _id: any }) => row._id;

export default function Tasks({ isRTL, words, menuitem, theme, company }) {
  const [alrt, setAlrt] = useState({ show: false, msg: '', type: undefined });
  const [pageSizes] = useState([5, 6, 10, 20, 50, 0]);

  const col = getColumns({ isRTL, words });

  const [columns] = useState([
    col.name,
    col.taskdata,
    col.daysdata,
    col.appointments,
    col.sales,
    col.purchase,
    col.expenses,
    col.kaids,
    col.title,
    col.createdAt,
    col.type,
    col.status,
    col.start,
    col.end,
    col.project,
    col.resourse,
    col.customer,
    col.department,
    col.employee,
    { name: 'amount', title: isRTL ? 'الاجمالي' : 'Total' },
  ]);

  const [tableColumnExtensions]: any = useState([
    { columnName: col.name.name, width: 250 },
    { columnName: col.taskdata.name, width: 250 },
    { columnName: col.daysdata.name, width: 280 },
    { columnName: col.appointments.name, width: 280 },
    { columnName: col.sales.name, width: 280 },
    { columnName: col.purchase.name, width: 280 },
    { columnName: col.expenses.name, width: 200 },
    { columnName: col.kaids.name, width: 230 },
    { columnName: col.title.name, width: 200 },
    { columnName: col.createdAt.name, width: 150 },
    { columnName: col.type.name, width: 100 },
    { columnName: col.status.name, width: 100 },
    { columnName: col.start.name, width: 120 },
    { columnName: col.end.name, width: 120 },
    { columnName: col.project.name, width: 200 },
    { columnName: col.resourse.name, width: 200 },
    { columnName: col.customer.name, width: 200 },
    { columnName: col.department.name, width: 200 },
    { columnName: col.employee.name, width: 200 },
    { columnName: 'amount', width: 150 },
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
  const [start, setStart] = useState<any>(null);
  const [end, setEnd] = useState<any>(null);
  const [periodvalue, setPeriodvalue] = useState<any>(null);

  const [item, setItem] = useState(null);
  const [openItem, setOpenItem] = useState(false);
  const { departments } = useDepartmentsUp();
  const { employees } = useEmployeesUp();
  const { resourses } = useResoursesUp();
  const { projects } = useProjects();
  const { height, width } = useWindowDimensions();

  const onCloseItem = () => {
    setOpenItem(false);
    setItem(null);
  };
  const {
    state: { currentDate, currentViewName, endDate, hiddenColumnNames },
    dispatch,
  } = useContext(ContractContext);

  const currentViewNameChange = (e: any) => {
    dispatch({ type: 'setCurrentViewName', payload: e.target.value });
  };
  const currentDateChange = (curDate: any) => {
    dispatch({ type: 'setCurrentDate', payload: curDate });
  };
  const endDateChange = (curDate: any) => {
    dispatch({ type: 'setEndDate', payload: curDate });
  };
  const setHiddenColumnNames = (hiddenColumns: any) => {
    dispatch({ type: 'setHiddenColumnNames', payload: hiddenColumns });
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
      { query: getTasks },
      { query: getResourses, variables: { isRTL, resType: 1 } },
    ],
  };

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
  const [stopTask] = useMutation(closeTask, refresQuery);
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
      const taskswithstatus = getTaskStatus(data, isRTL);
      setRows(taskswithstatus);
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
    >
      <Box
        style={{
          height: height - 50,
          overflow: 'auto',
          backgroundColor: '#fff',
        }}
      >
        <Box
          display="flex"
          style={{
            position: 'absolute',
            zIndex: 111,
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 8,
            marginRight: 45,
            marginLeft: 45,
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
          ></DateNavigatorReports>
        </Box>

        <Paper
          elevation={5}
          style={{
            marginTop: 10,
            marginLeft: 40,
            marginRight: 40,
            marginBottom: 20,
            overflow: 'auto',
            width: width - 320,
            borderRadius: 10,
          }}
        >
          <Grid
            rows={rows}
            columns={roles.isEditor() ? columns : columnsViewer}
            getRowId={getRowId}
          >
            <SortingState />
            <EditingState onCommitChanges={commitChanges} />
            <SearchState />
            <PagingState defaultCurrentPage={0} defaultPageSize={6} />

            <IntegratedSorting />
            <IntegratedFiltering />
            <IntegratedPaging />
            <DragDropProvider />
            <Table
              messages={{
                noData: isRTL ? 'لا يوجد بيانات' : 'no data',
              }}
              tableComponent={TableComponent}
              rowComponent={(props: any) => (
                <Table.Row {...props} style={{ height: 120 }}></Table.Row>
              )}
              columnExtensions={tableColumnExtensions}
            />
            <TableColumnReordering
              defaultOrder={[
                col.name.name,
                col.taskdata.name,
                col.daysdata.name,
                col.appointments.name,
                col.sales.name,
                col.purchase.name,
                col.expenses.name,
                col.kaids.name,
                col.title.name,
                col.createdAt.name,
                col.type.name,
                col.status.name,
                col.start.name,
                col.end.name,
                col.project.name,
                col.resourse.name,
                col.customer.name,
                col.department.name,
                col.employee.name,
                'amount',
              ]}
            />

            <TableColumnResizing defaultColumnWidths={tableColumnExtensions} />
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
              defaultHiddenColumnNames={hiddenColumnNames}
              hiddenColumnNames={hiddenColumnNames}
              onHiddenColumnNamesChange={setHiddenColumnNames}
            />
            <DataTypeProvider
              for={['start', 'end', 'createdAt']}
              formatterComponent={createdAtFormatter}
            ></DataTypeProvider>
            <DataTypeProvider
              for={['due']}
              formatterComponent={dueAmountFormatter}
            ></DataTypeProvider>
            {roles.isEditor() && (
              <DataTypeProvider
                for={[col.name.name]}
                formatterComponent={(props: any) =>
                  taskTitleNameFormatter({
                    ...props,
                    setItem,
                    setOpenItem,
                    isRTL,
                  })
                }
              ></DataTypeProvider>
            )}
            <DataTypeProvider
              for={[col.taskdata.name]}
              formatterComponent={(props: any) =>
                taskdataFormatter({ ...props, theme, isRTL })
              }
            ></DataTypeProvider>
            <DataTypeProvider
              for={[col.daysdata.name]}
              formatterComponent={(props: any) =>
                daysdataFormatter({ ...props, theme, isRTL })
              }
            ></DataTypeProvider>
            <DataTypeProvider
              for={[col.appointments.name]}
              formatterComponent={(props: any) =>
                appointTaskFormatter({ ...props, theme, isRTL })
              }
            ></DataTypeProvider>
            <DataTypeProvider
              for={[col.sales.name]}
              formatterComponent={(props: any) =>
                salesTaskFormatter({ ...props, theme, isRTL })
              }
            ></DataTypeProvider>
            <DataTypeProvider
              for={[col.purchase.name]}
              formatterComponent={(props: any) =>
                purchaseFormatter({ ...props, theme, isRTL })
              }
            ></DataTypeProvider>
            <DataTypeProvider
              for={[col.expenses.name]}
              formatterComponent={(props: any) =>
                expensesFormatter({ ...props, theme, isRTL })
              }
            ></DataTypeProvider>
            <DataTypeProvider
              for={[col.kaids.name]}
              formatterComponent={(props: any) =>
                kaidsFormatter({ ...props, theme, isRTL })
              }
            ></DataTypeProvider>
            <DataTypeProvider
              for={['amount']}
              formatterComponent={raseedFormatter}
            ></DataTypeProvider>
            <TableEditColumn
              showEditCommand
              showDeleteCommand
              showAddCommand
              commandComponent={Command}
            ></TableEditColumn>

            <Toolbar />
            <ColumnChooser />
            <PagingPanel pageSizes={pageSizes} />

            <SearchPanel
              inputComponent={(props: any) => {
                return <SearchTable isRTL={isRTL} {...props}></SearchTable>;
              }}
            />

            <PopupEditing addAction={addTask} editAction={editTask}>
              <PopupTaskFull
                resourses={resourses}
                employees={employees}
                departments={departments}
                projects={projects}
                customers={customers}
                addCustomer={addCustomer}
                editCustomer={editCustomer}
                company={company}
                theme={theme}
                refresh={refresh}
                startrange={start}
                endrange={end}
              ></PopupTaskFull>
            </PopupEditing>
          </Grid>
          {loading && <Loading isRTL={isRTL} />}
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
              company={company}
              stopTask={stopTask}
              mstart={start}
              mend={end}
            ></PopupTaskView>
          )}
        </Paper>
      </Box>
    </PageLayout>
  );
}
