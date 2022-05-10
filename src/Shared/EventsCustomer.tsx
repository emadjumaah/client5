/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useEffect, useState } from 'react';
import {
  Grid,
  Table,
  TableHeaderRow,
  TableEditColumn,
  VirtualTable,
} from '@devexpress/dx-react-grid-material-ui';
import { Box, fade, Paper, Typography, withStyles } from '@material-ui/core';
import {
  DataTypeProvider,
  EditingState,
  IntegratedSorting,
  SortingState,
} from '@devexpress/dx-react-grid';
import { Getter } from '@devexpress/dx-react-core';
import { getColumns } from '../common/columns';
import {
  createdAtFormatter,
  currencyFormatter,
  doneFormatter,
  eventStatusFormatter,
  fromToFormatter,
  locationFormatter,
  taskIdFormat,
} from './colorFormat';
import { useLazyQuery, useMutation } from '@apollo/client';
import {
  createEvent,
  deleteEventById,
  getCustomers,
  getDepartments,
  getEmployees,
  getProjects,
  getResourses,
  updateEvent,
} from '../graphql';
import { Command } from './Command';
import PopupEditing from './PopupEditing';
import getObjectEvents from '../graphql/query/getObjectEvents';
import getTasks from '../graphql/query/getTasks';
import PopupAppointmentCustomer from '../pubups/PopupAppointmentCustomer';
import useTasks from '../hooks/useTasks';
import React from 'react';
import DateNavigatorReports from '../components/filters/DateNavigatorReports';
export const getRowId = (row: any) => row._id;

const NumberTypeProvider = (props) => (
  <DataTypeProvider
    formatterComponent={({ value }) => (
      <Typography variant="subtitle2">{Number(value) + 1}</Typography>
    )}
    {...props}
  />
);

const styles = (theme) => ({
  tableStriped: {
    '& tbody tr:nth-of-type(odd)': {
      backgroundColor: fade(theme.palette.primary.main, 0.1),
    },
  },
});

const TableComponentBase = ({ classes, ...restProps }) => (
  <Table.Table {...restProps} className={classes.tableStriped} />
);

export const TableComponent = withStyles(styles, { name: 'TableComponent' })(
  TableComponentBase
);

export default function EventsCustomer({
  isRTL,
  words,
  resourses,
  employees,
  departments,
  customers,
  servicesproducts,
  theme,
  id,
  name,
  isNew,
  company,
  value,
}: any) {
  const col = getColumns({ isRTL, words });

  const [columns] = useState([
    { id: 4, ref: 'title', name: 'title', title: words.title },
    // col.location,
    col.startDate,
    col.fromto,
    col.docNo,
    col.taskId,
    col.resourse,
    col.department,
    col.employee,
    // col.status,
    col.done,
    col.amount,
  ]);
  const { tasks } = useTasks();
  const [rows, setRows] = useState([]);

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

  const refresQuery = {
    refetchQueries: [
      {
        query: getObjectEvents,
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

  const [getEvents, eventsData]: any = useLazyQuery(getObjectEvents, {
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    const variables = {
      [name]: id,
      start: start ? start.setHours(0, 0, 0, 0) : undefined,
      end: end ? end.setHours(23, 59, 59, 999) : undefined,
    };
    getEvents({ variables });
  }, [id, start, end]);

  useEffect(() => {
    const data = eventsData?.data?.['getObjectEvents']?.data;
    const events = data || [];
    const fevents = events.filter((ev: any) => ev.amount > 0);
    setRows(fevents);
  }, [eventsData]);

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
      {rows && (
        <Grid rows={rows} columns={columns} getRowId={getRowId}>
          <SortingState />
          <EditingState onCommitChanges={commitChanges} />
          <IntegratedSorting />

          <VirtualTable
            height={550}
            messages={{
              noData: isRTL ? 'لا يوجد بيانات' : 'no data',
            }}
            estimatedRowHeight={45}
            tableComponent={TableComponent}
          />
          <DataTypeProvider
            for={['startDate']}
            formatterComponent={createdAtFormatter}
          ></DataTypeProvider>
          <DataTypeProvider
            for={['fromto']}
            formatterComponent={fromToFormatter}
          ></DataTypeProvider>
          <DataTypeProvider
            for={['location']}
            formatterComponent={locationFormatter}
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
            for={['taskId']}
            formatterComponent={(props: any) =>
              taskIdFormat({
                ...props,
                tasks,
              })
            }
          ></DataTypeProvider>
          <NumberTypeProvider for={['index']} />
          <TableHeaderRow showSortingControls />

          {!isNew && (
            <TableEditColumn
              showEditCommand
              showDeleteCommand
              showAddCommand
              commandComponent={Command}
            ></TableEditColumn>
          )}

          <PopupEditing addAction={addEvent} editAction={editEvent}>
            <PopupAppointmentCustomer
              resourses={resourses}
              employees={employees}
              departments={departments}
              customers={customers}
              servicesproducts={servicesproducts}
              theme={theme}
              company={company}
              tasks={tasks}
              name={name}
              value={value}
            ></PopupAppointmentCustomer>
          </PopupEditing>

          <Getter
            name="tableColumns"
            computed={({ tableColumns }) => {
              const result = [
                {
                  key: 'editCommand',
                  type: TableEditColumn.COLUMN_TYPE,
                  width: isNew ? 20 : 100,
                },
                ...tableColumns.filter(
                  (c: any) => c.type !== TableEditColumn.COLUMN_TYPE
                ),
              ];
              return result;
            }}
          />
        </Grid>
      )}
    </Paper>
  );
}
