/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useEffect, useState } from 'react';
import {
  Grid,
  Table,
  TableEditColumn,
  TableHeaderRow,
  VirtualTable,
} from '@devexpress/dx-react-grid-material-ui';
import { Box, fade, Paper, Typography, withStyles } from '@material-ui/core';
import {
  DataTypeProvider,
  EditingState,
  IntegratedSorting,
  SortingState,
} from '@devexpress/dx-react-grid';
import { getColumns } from '../common/columns';
import {
  createdAtFormatter,
  currencyFormatter,
  doneFormatter,
  eventStatusFormatter,
  fromToFormatter,
  locationFormatter,
} from './colorFormat';
import { useLazyQuery, useMutation } from '@apollo/client';

import getObjectEvents from '../graphql/query/getObjectEvents';
import useTasks from '../hooks/useTasks';
import { useCustomers, useServices } from '../hooks';
import { updateDocNumbers } from '../common';
import { createEvent, deleteEventById, updateEvent } from '../graphql';
import { Getter } from '@devexpress/dx-react-core';
import PopupEditing from './PopupEditing';
import { Command } from './Command';
import PopupAppointmentCustomer from '../pubups/PopupAppointmentCustomer';
import useDepartments from '../hooks/useDepartments';
import useEmployees from '../hooks/useEmployees';
import useResourses from '../hooks/useResourses';
import getGereralCalculation from '../graphql/query/getGereralCalculation';
import { getProjects, getTasks } from '../graphql/query';
import RefetchBox from './RefetchBox';
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
  company,
  value,
  theme,
  id,
  name,
  width,
  height,
  start,
  end,
  tempoptions,
  mstart,
  mend,
}: any) {
  const col = getColumns({ isRTL, words });

  const [columns] = useState(
    tempoptions?.noTsk
      ? [
          { id: 4, ref: 'title', name: 'title', title: words.title },
          col.startDate,
          col.fromto,
          col.docNo,
          col.department,
          col.employee,
          col.done,
          col.amount,
        ]
      : [
          { id: 4, ref: 'title', name: 'title', title: words.title },
          col.startDate,
          col.fromto,
          col.docNo,
          col.contract,
          col.customer,
          col.resourse,
          col.department,
          col.employee,
          col.done,
          col.amount,
        ]
  );

  const { tasks } = useTasks();
  const [rows, setRows] = useState([]);

  const { departments } = useDepartments();
  const { employees } = useEmployees();
  const { resourses } = useResourses();
  const { customers } = useCustomers();
  const { services } = useServices();
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
        query: getGereralCalculation,
        variables: {
          [name]: id,
          start: start ? new Date(start).setHours(0, 0, 0, 0) : undefined,
          end: end ? new Date(end).setHours(23, 59, 59, 999) : undefined,
        },
      },
      name === 'contractId'
        ? {
            query: getTasks,
            variables: {
              contractId: id,
              start: mstart ? new Date(mstart).setHours(0, 0, 0, 0) : undefined,
              end: mend ? new Date(mend).setHours(23, 59, 59, 999) : undefined,
            },
          }
        : undefined,
      name === 'contractId' ? { query: getTasks } : undefined,
      name === 'projectId' ? { query: getProjects } : undefined,
    ].filter((x: any) => x),
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
    const rdata = updateDocNumbers(fevents);
    setRows(rdata);
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
  const refresh = () => eventsData?.refetch();
  const loading = eventsData.loading;
  return (
    <Box
      style={{
        height: height - 280,
        width: width - 300,
        margin: 10,
      }}
    >
      <Box
        style={{
          position: 'absolute',
          width: 50,
          height: 50,
          left: isRTL ? 220 : undefined,
          right: isRTL ? undefined : 220,
          zIndex: 111,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          top: 55,
        }}
      >
        <RefetchBox
          isRTL={isRTL}
          theme={theme}
          refresh={refresh}
          loading={loading}
        ></RefetchBox>
      </Box>
      <Paper
        style={{
          height: height - 290,
          width: width - 320,
        }}
      >
        {rows && (
          <Grid rows={rows} columns={columns} getRowId={getRowId}>
            <SortingState />
            <EditingState onCommitChanges={commitChanges} />
            <IntegratedSorting />
            <VirtualTable
              height={680}
              messages={{
                noData: isRTL ? '???? ???????? ????????????' : 'no data',
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
            <NumberTypeProvider for={['index']} />
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

            <TableEditColumn
              showEditCommand
              showDeleteCommand
              showAddCommand
              commandComponent={Command}
            ></TableEditColumn>

            <PopupEditing addAction={addEvent} editAction={editEvent}>
              <PopupAppointmentCustomer
                resourses={resourses}
                employees={employees}
                departments={departments}
                customers={customers}
                servicesproducts={services}
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
                    width: 100,
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
    </Box>
  );
}
