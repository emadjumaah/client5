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
import { getRowId } from '../common';
import { actionTimeFormatter, sentFormatter } from '../Shared/colorFormat';

import { getColumns } from '../common/columns';

import { Box, Button, Paper, Typography } from '@material-ui/core';
import { useLazyQuery, useMutation } from '@apollo/client';
import { createReminder, updateAction } from '../graphql';
import DateNavigatorReports from '../components/filters/DateNavigatorReports';
import { useTemplate } from '../hooks';
import getRemindersActions from '../graphql/query/getRemindersActions';
import { TableComponent } from '../Shared/TableComponent';
import PopupReminder from '../pubups/PopupReminder';

export default function RemindersOutBox(props: any) {
  const { isRTL, words, height, theme, resourses, employees, tasks } = props;

  const [rows, setRows] = useState([]);
  const [start, setStart] = useState<any>(null);
  const [end, setEnd] = useState<any>(null);
  const [open, setOpen] = useState(false);

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
          col.sent,
          col.time,
          { name: 'title', title: words?.description },
          col.employee,
        ]
      : [
          col.sent,
          col.time,
          { name: 'title', title: words?.description },
          col.resourse,
          col.employee,
        ]
  );

  const [tableColumnExtensions]: any = useState([
    { columnName: col.sent.name, width: 80 },
    { columnName: col.time.name, width: 150 },
    { columnName: col.title.name, width: 220 },
    { columnName: col.resourse.name, width: 150 },
    { columnName: col.employee.name, width: 150 },
  ]);

  const [tableColumnVisibilityColumnExtensions] = useState([
    { columnName: 'time', togglingEnabled: false },
  ]);

  const [loadReminders, remindersData]: any = useLazyQuery(
    getRemindersActions,
    {
      fetchPolicy: 'cache-and-network',
    }
  );

  const refresQuery = {
    refetchQueries: [
      {
        query: getRemindersActions,
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

  const [editRAction] = useMutation(updateAction, refresQuery);
  const [addReminder] = useMutation(createReminder, refresQuery);

  useEffect(() => {
    if (remindersData?.data?.getRemindersActions?.data) {
      const { data } = remindersData.data.getRemindersActions;
      const rdata = data.map((da: any) => {
        let resourseNameAr: any;
        let resourseName: any;

        let employeeNameAr: any;
        let employeeName: any;

        if (da?.resourseId) {
          const res = resourses.filter(
            (re: any) => re._id === da.resourseId
          )?.[0];
          resourseNameAr = res?.nameAr;
          resourseName = res?.name;
        }

        if (da?.employeeId) {
          const res = employees.filter(
            (re: any) => re._id === da.employeeId
          )?.[0];
          employeeNameAr = res?.nameAr;
          employeeName = res?.name;
        }

        return {
          ...da,
          resourseName,
          resourseNameAr,
          employeeNameAr,
          employeeName,
          time: da?.sendtime,
        };
      });
      setRows(rdata);
    }
  }, [remindersData]);
  const color = '#eff7fb';

  return (
    <Paper
      elevation={2}
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
            style={{ fontSize: 24, fontWeight: 'bold', color: '#555' }}
          >
            {isRTL ? 'المفكرة' : 'Reminder'}
          </Typography>
        </Box>
      </Box>
      <Paper
        elevation={0}
        style={{
          overflow: 'auto',
          height: height - 110,
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
            for={['sent']}
            formatterComponent={(props: any) =>
              sentFormatter({ ...props, editRAction })
            }
          ></DataTypeProvider>
        </Grid>
      </Paper>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpen(true)}
        style={{
          minWidth: 130,
          height: 36,
          margin: 10,
          marginTop: 15,
        }}
      >
        <Typography>{isRTL ? 'انشاء تذكير' : 'Add Reminder'}</Typography>
      </Button>
      <PopupReminder
        open={open}
        onClose={() => setOpen(false)}
        row={null}
        isNew={true}
        theme={theme}
        addAction={addReminder}
        editAction={() => null}
        tasks={tasks}
      ></PopupReminder>
    </Paper>
  );
}
