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
import { fade, Paper, Typography, withStyles } from '@material-ui/core';
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
import LoadingInline from './LoadingInline';
import PopupAppointmentCustomer from '../pubups/PopupAppointmentCustomer';
import useTasks from '../hooks/useTasks';
import React from 'react';
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
  isEditor,
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
  const [loading, setLoading] = useState(true);
  const col = getColumns({ isRTL, words });

  const [columns] = useState([
    { id: 4, ref: 'title', name: 'title', title: words.title },
    col.location,
    col.startDate,
    col.fromto,
    col.docNo,
    col.taskId,
    col.department,
    col.employee,
    col.status,
    col.done,
    col.amount,
  ]);
  const { tasks } = useTasks();
  const [rows, setRows] = useState([]);

  const refresQuery = {
    refetchQueries: [
      {
        query: getObjectEvents,
        variables: { [name]: id },
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
    const variables = { [name]: id };
    getEvents({ variables });
  }, [id]);

  useEffect(() => {
    const data = eventsData?.data?.['getObjectEvents']?.data;
    if (data) {
      setLoading(false);
    }
    const events = data || [];
    setRows(events);
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
      {loading && <LoadingInline></LoadingInline>}

      {rows && (
        <Grid rows={rows} columns={columns} getRowId={getRowId}>
          <SortingState />
          <EditingState onCommitChanges={commitChanges} />
          <IntegratedSorting />

          <VirtualTable
            height={600}
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

          {isEditor && !isNew && (
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
              isEditor={isEditor}
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
