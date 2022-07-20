/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useEffect, useState } from 'react';
import {
  SortingState,
  IntegratedSorting,
  DataTypeProvider,
  EditingState,
} from '@devexpress/dx-react-grid';
import {
  Grid,
  TableHeaderRow,
  Table,
  TableColumnReordering,
  TableColumnResizing,
  TableColumnVisibility,
} from '@devexpress/dx-react-grid-material-ui';
import { Loading } from '.';
import { getRowId } from '../common';
import { actionTimeFormatter, doneFormatter } from './colorFormat';

import { getColumns } from '../common/columns';

import { Box, Paper, Typography } from '@material-ui/core';
import { useLazyQuery, useMutation } from '@apollo/client';
import { getEvents, updateEvent } from '../graphql';
import DateNavigatorReports from '../components/filters/DateNavigatorReports';
import { useTemplate } from '../hooks';
import { TableComponent } from './TableComponent';

export default function AppointmentsOutBox(props: any) {
  const { isRTL, words, height, theme } = props;

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [start, setStart] = useState<any>(null);
  const [end, setEnd] = useState<any>(null);

  const [currentViewName, setCurrentViewName] = useState('Day');
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

  const col = getColumns({ isRTL, words });

  const { tempoptions } = useTemplate();
  const [columns] = useState(
    tempoptions?.noTsk
      ? [
          col.done,
          col.startDate,
          col.fromto,
          col.customer,
          col.employee,
          col.resourse,
        ]
      : [
          col.done,
          col.startDate,
          col.fromto,
          col.customer,
          col.employee,
          col.resourse,
        ]
  );

  const [tableColumnExtensions]: any = useState([
    { columnName: col.done.name, width: 80 },
    { columnName: col.startDate.name, width: 130 },
    { columnName: col.fromto.name, width: 130 },
    { columnName: col.customer.name, width: 130 },
    { columnName: col.resourse.name, width: 130 },
    { columnName: col.employee.name, width: 130 },
  ]);

  const [tableColumnVisibilityColumnExtensions] = useState([
    { columnName: 'time', togglingEnabled: false },
  ]);
  const [loadReminders, remindersData]: any = useLazyQuery(getEvents);

  const refresQuery = {
    refetchQueries: [
      {
        query: getEvents,
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
    };
    loadReminders({
      variables,
    });
  }, [start, end]);

  const [editEvent] = useMutation(updateEvent, refresQuery);

  useEffect(() => {
    if (remindersData?.loading) {
      setLoading(true);
    }
    if (remindersData?.data?.getEvents?.data) {
      const { data } = remindersData.data.getEvents;
      setRows(data);
      setLoading(false);
    }
  }, [remindersData]);
  const color = '#fefae066';
  return (
    <Paper
      elevation={1}
      style={{
        height,
        width: '100%',
        backgroundColor: color,
      }}
    >
      <Box
        display={'flex'}
        style={{
          alignItems: 'center',
          justifyContent: 'space-between',
          flex: 1,
          height: 50,
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
          views={[1, 7]}
          isRTL={isRTL}
          words={words}
          theme={theme}
          bcolor={color}
        ></DateNavigatorReports>
        <Box style={{ marginLeft: 20, marginRight: 20 }}>
          <Typography
            color="primary"
            style={{ fontSize: 18, fontWeight: 'bold' }}
          >
            {isRTL ? 'المواعيد' : 'Appointments'}
          </Typography>
        </Box>
      </Box>
      <Paper
        style={{
          overflow: 'auto',
          height: height - 50,
          width: '100%',
          backgroundColor: color,
        }}
      >
        <Grid rows={rows} columns={columns} getRowId={getRowId}>
          <SortingState />
          <EditingState onCommitChanges={() => null} />
          <IntegratedSorting />
          <Table
            messages={{
              noData: isRTL ? 'لا يوجد تذكيرات' : 'no data',
            }}
            tableComponent={TableComponent}
            rowComponent={(props: any) => (
              <Table.Row {...props} style={{ height: 40 }}></Table.Row>
            )}
            columnExtensions={tableColumnExtensions}
          />

          <TableColumnReordering
            defaultOrder={[
              col.sent.name,
              col.time.name,
              col.title.name,
              col.resourse.name,
              col.employee.name,
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
            defaultHiddenColumnNames={[col.amount.name]}
          />
          <DataTypeProvider
            for={['time']}
            formatterComponent={actionTimeFormatter}
          ></DataTypeProvider>
          <DataTypeProvider
            for={['done']}
            formatterComponent={(props: any) =>
              doneFormatter({ ...props, editEvent })
            }
          ></DataTypeProvider>
        </Grid>
      </Paper>
      {loading && <Loading isRTL={isRTL} />}
    </Paper>
  );
}
