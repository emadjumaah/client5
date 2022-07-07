/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useContext, useEffect, useState } from 'react';
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
  PagingPanel,
  Table,
  TableColumnResizing,
  DragDropProvider,
  TableColumnReordering,
} from '@devexpress/dx-react-grid-material-ui';
import { Command, Loading, PopupEditing } from '../../Shared';
import { updateDocNumbers, getRowId, roles } from '../../common';
import {
  createEvent,
  deleteEventById,
  getEvents,
  updateEvent,
} from '../../graphql';
import { useLazyQuery, useMutation } from '@apollo/client';
import {
  createdAtFormatter,
  currencyFormatter,
  doneFormatter,
  eventStatusFormatter,
  fromToFormatter,
  locationFormatter,
  nameLinkFormat,
} from '../../Shared/colorFormat';
import PageLayout from '../main/PageLayout';
import { SearchTable } from '../../components';
import { getColumns } from '../../common/columns';
import PopupAppointment from '../../pubups/PopupAppointment';
import { EventsContext } from '../../contexts';
import DateNavigatorReports from '../../components/filters/DateNavigatorReports';
import {
  Box,
  Checkbox,
  fade,
  FormControlLabel,
  Paper,
  Typography,
} from '@material-ui/core';
import useTasks from '../../hooks/useTasks';
import { Getter } from '@devexpress/dx-react-core';
import { TableComponent } from '../../Shared/TableComponent';
import { useCustomers, useServices, useTemplate } from '../../hooks';
import PopupDepartmentView from '../../pubups/PopupDepartmentView';
import PopupEmployeeView from '../../pubups/PopupEmployeeView';
import PopupTaskView from '../../pubups/PopupTaskView';
import PopupCustomerView from '../../pubups/PopupCustomerView';
import useResoursesUp from '../../hooks/useResoursesUp';
import useEmployeesUp from '../../hooks/useEmployeesUp';
import useDepartmentsUp from '../../hooks/useDepartmentsUp';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import PopupResoursesView from '../../pubups/PopupResoursesView';

export default function Appointments({
  isRTL,
  words,
  menuitem,
  theme,
  company,
}) {
  const [due, setDue] = useState(false);
  const [pageSizes] = useState([5, 10, 20, 50, 0]);

  const col = getColumns({ isRTL, words });

  const { tempoptions } = useTemplate();
  const [columns] = useState(
    tempoptions?.noTsk
      ? [
          col.location,
          col.createdAt,
          col.startDate,
          col.fromto,
          col.docNo,
          col.customer,
          col.employee,
          col.department,
          col.status,
          col.done,
          col.amount,
          col.nots,
        ]
      : [
          col.location,
          col.createdAt,
          col.startDate,
          col.fromto,
          col.docNo,
          col.customer,
          col.resourse,
          col.contract,
          col.employee,
          col.department,
          col.status,
          col.done,
          col.amount,
          col.nots,
        ]
  );

  const [tableColumnExtensions]: any = useState([
    { columnName: 'location', width: 100 },
    { columnName: 'createdAt', width: 100 },
    { columnName: 'startDate', width: 100 },
    { columnName: 'fromto', width: 70 },
    { columnName: 'docNo', width: 120 },
    { columnName: col.customer.name, width: 200 },
    { columnName: col.contract.name, width: 200 },
    { columnName: col.resourse.name, width: 200 },
    { columnName: col.employee.name, width: 200 },
    { columnName: col.department.name, width: 200 },
    { columnName: 'status', width: 100 },
    { columnName: 'done', width: 100 },
    { columnName: 'amount', width: 120 },
    { columnName: 'nots', width: 50 },
  ]);

  const { width, height } = useWindowDimensions();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [start, setStart] = useState<any>(null);
  const [end, setEnd] = useState<any>(null);
  const [periodvalue, setPeriodvalue] = useState<any>(null);

  const [item, setItem] = useState(null);
  const [name, setName] = useState(null);
  const [openTaskItem, setOpenTaskItem] = useState(false);
  const [openCustomerItem, setOpenCustomerItem] = useState(false);
  const [openEmployeeItem, setOpenEmployeeItem] = useState(false);
  const [openResourseItem, setOpenResourseItem] = useState(false);
  const [openDepartmentItem, setOpenDepartmentItem] = useState(false);

  const { tasks } = useTasks();
  const { customers } = useCustomers();
  const { departments } = useDepartmentsUp();
  const { employees } = useEmployeesUp();
  const { resourses } = useResoursesUp();
  const { services } = useServices();

  const onCloseTaskItem = () => {
    setOpenTaskItem(false);
    setItem(null);
    setName(null);
  };

  const onCloseCustomerItem = () => {
    setOpenCustomerItem(false);
    setItem(null);
    setName(null);
  };
  const onCloseEmployeeItem = () => {
    setOpenEmployeeItem(false);
    setItem(null);
    setName(null);
  };
  const onCloseResourseItem = () => {
    setOpenResourseItem(false);
    setItem(null);
    setName(null);
  };
  const onCloseDepartmentItem = () => {
    setOpenDepartmentItem(false);
    setItem(null);
    setName(null);
  };

  const setTaskItem = (data: any) => {
    const cont = tasks.filter((co: any) => co._id === data.contractId)?.[0];
    if (cont) {
      setItem(cont);
      setName('contract');
    }
  };
  const setEmployeeItem = (data: any) => {
    const empl = employees.filter((em: any) => em._id === data.employeeId)?.[0];
    if (empl) {
      setItem(empl);
      setName('employee');
    }
  };
  const setResourseItem = (data: any) => {
    const empl = resourses.filter((em: any) => em._id === data.resourseId)?.[0];
    if (empl) {
      setItem(empl);
      setName('resourse');
    }
  };
  const setDepartmentItem = (data: any) => {
    const empl = departments.filter(
      (em: any) => em._id === data.departmentId
    )?.[0];
    if (empl) {
      setItem(empl);
      setName('department');
    }
  };
  const setCustomerItem = (data: any) => {
    const empl = customers.filter((em: any) => em._id === data.customerId)?.[0];
    if (empl) {
      setItem(empl);
      setName('customer');
    }
  };

  const {
    state: { currentDate, currentViewName, endDate },
    dispatch,
  } = useContext(EventsContext);

  const currentViewNameChange = (e: any) => {
    dispatch({ type: 'setCurrentViewName', payload: e.target.value });
  };
  const currentDateChange = (curDate: any) => {
    dispatch({ type: 'setCurrentDate', payload: curDate });
  };
  const endDateChange = (curDate: any) => {
    dispatch({ type: 'setEndDate', payload: curDate });
  };

  const [loadEvents, eventsData]: any = useLazyQuery(getEvents);
  const refresQuery = {
    refetchQueries: [
      {
        query: getEvents,
        variables: {
          start: start ? start.setHours(0, 0, 0, 0) : undefined,
          end: end ? end.setHours(23, 59, 59, 999) : undefined,
          due,
        },
      },
    ],
  };

  useEffect(() => {
    const variables = {
      start: start ? start.setHours(0, 0, 0, 0) : undefined,
      end: end ? end.setHours(23, 59, 59, 999) : undefined,
      due,
    };
    loadEvents({
      variables,
    });
  }, [start, end, due]);

  const [addEvent] = useMutation(createEvent, refresQuery);
  const [editEvent] = useMutation(updateEvent, refresQuery);
  const [removeEventById] = useMutation(deleteEventById, refresQuery);

  const commitChanges = async ({ deleted }) => {
    if (deleted) {
      const _id = deleted[0];
      removeEventById({ variables: { _id } });
      setRows(rows.filter((row: any) => row._id !== _id));
    }
  };

  useEffect(() => {
    if (eventsData?.loading) {
      setLoading(true);
    }
    if (eventsData?.data?.getEvents?.data) {
      const { data } = eventsData.data.getEvents;
      const rdata = updateDocNumbers(data);
      setRows(rdata);
      setLoading(false);
    }
  }, [eventsData]);

  useEffect(() => {
    if (name === 'department') {
      if (departments && departments.length > 0) {
        const opened = departments.filter(
          (ts: any) => ts._id === item._id
        )?.[0];
        setItem(opened);
      }
    }
    if (name === 'employee') {
      if (employees && employees.length > 0) {
        const opened = employees.filter((ts: any) => ts._id === item._id)?.[0];
        setItem(opened);
      }
    }
    if (name === 'resourse') {
      if (resourses && resourses.length > 0) {
        const opened = resourses.filter((ts: any) => ts._id === item._id)?.[0];
        setItem(opened);
      }
    }
    if (name === 'customer') {
      if (customers && customers.length > 0) {
        const opened = customers.filter((ts: any) => ts._id === item._id)?.[0];
        setItem(opened);
      }
    }
  }, [departments, employees, customers]);

  const refresh = () => {
    eventsData?.refetch();
  };

  const [tableColumnVisibilityColumnExtensions] = useState([
    { columnName: col.startDate.name, togglingEnabled: false },
    { columnName: col.fromto.name, togglingEnabled: false },
    { columnName: col.amount.name, togglingEnabled: false },
  ]);

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
            paddingTop: 5,
            paddingBottom: 5,
            paddingLeft: 60,
            paddingRight: 60,
            width: '100%',
            backgroundColor: '#fff',
          }}
        >
          <Box
            style={{
              opacity: due ? 0.5 : undefined,
              pointerEvents: due ? 'none' : undefined,
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
          <Box
            style={{
              padding: 0,
              margin: 0,
              backgroundColor: fade(theme.palette.secondary.light, 0.5),
              paddingRight: 10,
              marginLeft: 40,
              marginRight: 40,
              borderRadius: 5,
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  style={{ padding: 7 }}
                  checked={due}
                  onChange={() => setDue(!due)}
                  color="primary"
                />
              }
              label={
                <Typography
                  style={{ color: theme.palette.primary.main }}
                  variant="subtitle2"
                >
                  {isRTL ? 'المواعيد المتأخرة' : 'Due Appointments'}
                </Typography>
              }
              style={{ fontSize: 14 }}
            />
          </Box>
        </Box>
        <Paper
          elevation={5}
          style={{
            margin: 40,
            marginTop: 80,
            overflow: 'auto',
            width: width - 330,
            // height: height - 200,
            borderRadius: 10,
          }}
        >
          <Grid rows={rows} columns={columns} getRowId={getRowId}>
            <SortingState />
            <EditingState onCommitChanges={commitChanges} />
            <SearchState />
            <PagingState defaultCurrentPage={0} defaultPageSize={10} />
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
                <Table.Row {...props} style={{ height: 60 }}></Table.Row>
              )}
              columnExtensions={tableColumnExtensions}
            />
            <TableColumnReordering
              defaultOrder={[
                col.location.name,
                col.createdAt.name,
                col.startDate.name,
                col.fromto.name,
                col.docNo.name,
                col.customer.name,
                col.contract.name,
                col.resourse.name,
                col.employee.name,
                col.department.name,
                col.status.name,
                col.done.name,
                col.amount.name,
                col.nots.name,
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
              defaultHiddenColumnNames={[
                col.createdAt.name,
                col.status.name,
                col.fromto.name,
                col.location.name,
                col.nots.name,
              ]}
            />

            <DataTypeProvider
              for={['fromto']}
              formatterComponent={fromToFormatter}
            ></DataTypeProvider>
            <DataTypeProvider
              for={['location']}
              formatterComponent={locationFormatter}
            ></DataTypeProvider>
            <DataTypeProvider
              for={['startDate', 'createdAt']}
              formatterComponent={createdAtFormatter}
            ></DataTypeProvider>
            <DataTypeProvider
              for={['status']}
              formatterComponent={eventStatusFormatter}
            ></DataTypeProvider>
            <DataTypeProvider
              for={['amount']}
              formatterComponent={currencyFormatter}
            ></DataTypeProvider>
            <DataTypeProvider
              for={['done']}
              formatterComponent={(props: any) =>
                doneFormatter({ ...props, editEvent })
              }
            ></DataTypeProvider>
            {roles.isEditor() && (
              <DataTypeProvider
                for={['contractNameAr', 'contractName']}
                formatterComponent={(props: any) =>
                  nameLinkFormat({
                    ...props,
                    setItem: setTaskItem,
                    setOpenItem: setOpenTaskItem,
                  })
                }
              ></DataTypeProvider>
            )}
            {roles.isEditor() && (
              <DataTypeProvider
                for={['employeeNameAr', 'employeeName']}
                formatterComponent={(props: any) =>
                  nameLinkFormat({
                    ...props,
                    setItem: setEmployeeItem,
                    setOpenItem: setOpenEmployeeItem,
                  })
                }
              ></DataTypeProvider>
            )}
            {roles.isEditor() && (
              <DataTypeProvider
                for={['resourseNameAr', 'resourseName']}
                formatterComponent={(props: any) =>
                  nameLinkFormat({
                    ...props,
                    setItem: setResourseItem,
                    setOpenItem: setOpenResourseItem,
                  })
                }
              ></DataTypeProvider>
            )}
            {roles.isEditor() && (
              <DataTypeProvider
                for={['departmentNameAr', 'departmentName']}
                formatterComponent={(props: any) =>
                  nameLinkFormat({
                    ...props,
                    setItem: setDepartmentItem,
                    setOpenItem: setOpenDepartmentItem,
                  })
                }
              ></DataTypeProvider>
            )}
            {roles.isEditor() && (
              <DataTypeProvider
                for={['customerNameAr', 'customerName']}
                formatterComponent={(props: any) =>
                  nameLinkFormat({
                    ...props,
                    setItem: setCustomerItem,
                    setOpenItem: setOpenCustomerItem,
                  })
                }
              ></DataTypeProvider>
            )}

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

            <PopupEditing addAction={addEvent} editAction={editEvent}>
              <PopupAppointment
                employees={employees}
                resourses={resourses}
                departments={departments}
                company={company}
                servicesproducts={services}
                theme={theme}
                tasks={tasks}
              ></PopupAppointment>
            </PopupEditing>
            <Getter
              name="tableColumns"
              computed={({ tableColumns }) => {
                const result = [
                  {
                    key: 'editCommand',
                    type: TableEditColumn.COLUMN_TYPE,
                    width: 120,
                  },
                  ...tableColumns.filter(
                    (c: any) => c.type !== TableEditColumn.COLUMN_TYPE
                  ),
                ];
                return result;
              }}
            />
          </Grid>
        </Paper>
        {loading && <Loading isRTL={isRTL} />}
        <PopupDepartmentView
          open={openDepartmentItem}
          onClose={onCloseDepartmentItem}
          row={item}
          theme={theme}
          company={company}
        ></PopupDepartmentView>
        <PopupEmployeeView
          open={openEmployeeItem}
          onClose={onCloseEmployeeItem}
          row={item}
          theme={theme}
          company={company}
        ></PopupEmployeeView>
        <PopupResoursesView
          open={openResourseItem}
          onClose={onCloseResourseItem}
          row={item}
          theme={theme}
          company={company}
        ></PopupResoursesView>
        <PopupTaskView
          open={openTaskItem}
          onClose={onCloseTaskItem}
          item={item}
          tasks={tasks}
          isNew={false}
          theme={theme}
        ></PopupTaskView>
        <PopupCustomerView
          open={openCustomerItem}
          onClose={onCloseCustomerItem}
          row={item}
          theme={theme}
          company={company}
        ></PopupCustomerView>
      </Box>
    </PageLayout>
  );
}
