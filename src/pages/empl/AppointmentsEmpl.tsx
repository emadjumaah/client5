/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useContext, useEffect, useState } from 'react';
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
import { getRowId } from '../../common';
import { createEvent, deleteEventById, updateEvent } from '../../graphql';
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
  colors,
  FormControlLabel,
  Typography,
} from '@material-ui/core';
import useTasks from '../../hooks/useTasks';
import { Getter } from '@devexpress/dx-react-core';
import { TableComponent } from '../../Shared/TableComponent';
import {
  useCustomers,
  useDepartments,
  useEmployees,
  useProducts,
} from '../../hooks';
import PopupDepartmentView from '../../pubups/PopupDepartmentView';
import PopupEmployeeView from '../../pubups/PopupEmployeeView';
import PopupTaskView from '../../pubups/PopupTaskView';
import PopupCustomerView from '../../pubups/PopupCustomerView';
import React from 'react';
import getEmplEvents from '../../graphql/query/getEmplEvents';
import useResourses from '../../hooks/useResourses';
import useWindowDimensions from '../../hooks/useWindowDimensions';

export default function AppointmentsEmpl({
  isRTL,
  words,
  menuitem,
  theme,
  company,
  servicesproducts,
  user,
}) {
  const [due, setDue] = useState(false);
  const col = getColumns({ isRTL, words });

  const [columns] = useState([
    { id: 4, ref: 'title', name: 'title', title: words.title },
    col.location,
    col.createdAt,
    col.startDate,
    col.fromto,
    col.customer,
    col.docNo,
    col.contract,
    col.employee,
    col.department,
    col.status,
    col.done,
    col.amount,
  ]);

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
  const [openDepartmentItem, setOpenDepartmentItem] = useState(false);
  const { height } = useWindowDimensions();
  const { products } = useProducts();
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
  const onCloseDepartmentItem = () => {
    setOpenDepartmentItem(false);
    setItem(null);
    setName(null);
  };

  const setEmployeeItem = (data: any) => {
    const empl = employees.filter((em: any) => em._id === data.employeeId)?.[0];
    if (empl) {
      setItem(empl);
      setName('employee');
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

  const { tasks } = useTasks();
  const { customers } = useCustomers();
  const { departments, addDepartment, editDepartment } = useDepartments();
  const { employees, addEmployee, editEmployee } = useEmployees();
  const { resourses } = useResourses();

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

  const [loadEvents, eventsData]: any = useLazyQuery(getEmplEvents);

  const refresQuery = {
    refetchQueries: [
      {
        query: getEmplEvents,
        variables: {
          start: start ? start.setHours(0, 0, 0, 0) : undefined,
          end: end ? end.setHours(23, 59, 59, 999) : undefined,
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
    if (eventsData?.data?.getEmplEvents?.data) {
      const { data } = eventsData.data.getEmplEvents;
      setRows(data);
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
    if (name === 'customer') {
      console.log('customer', item);

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
      loading={loading}
      // bgcolor={colors.blue[500]}
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
              // color={colors.blue[700]}
              // bgcolor={colors.blue[50]}
            ></DateNavigatorReports>
          </Box>
          <Box
            style={{
              padding: 0,
              margin: 0,
              backgroundColor: colors.blue[50],
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
                  style={{ color: colors.blue[700] }}
                  variant="subtitle2"
                >
                  {isRTL ? '???????????????? ????????????????' : 'Due Appointments'}
                </Typography>
              }
              style={{ fontSize: 14 }}
            />
          </Box>
        </Box>
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
            estimatedRowHeight={45}
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
              col.status.name,
              col.docNo.name,
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
          <DataTypeProvider
            for={['contractNameAr', 'contractName']}
            formatterComponent={(props: any) =>
              nameLinkFormat({
                ...props,
                setItem,
                setOpenItem: setOpenTaskItem,
              })
            }
          ></DataTypeProvider>
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

          <PopupEditing addAction={addEvent} editAction={editEvent}>
            <PopupAppointment
              resourses={resourses}
              employees={employees}
              departments={departments}
              company={company}
              servicesproducts={servicesproducts}
              theme={theme}
              tasks={tasks.filter(
                (ts: any) => ts.employeeId === user?.employeeId
              )}
            ></PopupAppointment>
          </PopupEditing>
          <Getter
            name="tableColumns"
            computed={({ tableColumns }) => {
              const result = [
                {
                  key: 'editCommand',
                  type: TableEditColumn.COLUMN_TYPE,
                  width: 110,
                },
                ...tableColumns.filter(
                  (c: any) => c.type !== TableEditColumn.COLUMN_TYPE
                ),
              ];
              return result;
            }}
          />
        </Grid>
        <PopupDepartmentView
          open={openDepartmentItem}
          onClose={onCloseDepartmentItem}
          row={item}
          isNew={false}
          addAction={addDepartment}
          editAction={editDepartment}
          theme={theme}
          departments={departments}
          company={company}
          employees={employees}
          resourses={resourses}
          servicesproducts={servicesproducts}
          products={products}
          customers={customers}
          tasks={tasks}
        ></PopupDepartmentView>
        <PopupEmployeeView
          open={openEmployeeItem}
          onClose={onCloseEmployeeItem}
          row={item}
          isNew={false}
          addAction={addEmployee}
          editAction={editEmployee}
          theme={theme}
          departments={departments}
          company={company}
          employees={employees}
          resourses={resourses}
          servicesproducts={servicesproducts}
          products={products}
          customers={customers}
          tasks={tasks}
        ></PopupEmployeeView>
        <PopupTaskView
          open={openTaskItem}
          onClose={onCloseTaskItem}
          item={item}
          tasks={tasks}
          isNew={false}
          theme={theme}
          company={company}
        ></PopupTaskView>
        <PopupCustomerView
          open={openCustomerItem}
          onClose={onCloseCustomerItem}
          row={item}
          theme={theme}
          company={company}
        ></PopupCustomerView>
      </Paper>
    </PageLayout>
  );
}
