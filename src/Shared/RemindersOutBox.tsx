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
import { Loading } from '../Shared';
import { getRowId } from '../common';
import { actionTimeFormatter, sentFormatter } from '../Shared/colorFormat';

import { getColumns } from '../common/columns';

import { Box, Paper, Typography } from '@material-ui/core';
import { useLazyQuery, useMutation } from '@apollo/client';
import { updateAction } from '../graphql';
import DateNavigatorReports from '../components/filters/DateNavigatorReports';
import useEmployeesUp from '../hooks/useEmployeesUp';
import useResoursesUp from '../hooks/useResoursesUp';
import { useTemplate } from '../hooks';
import getRemindersActions from '../graphql/query/getRemindersActions';
import { TableComponent } from '../Shared/TableComponent';

export default function RemindersOutBox(props: any) {
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
    { columnName: col.time.name, width: 130 },
    { columnName: col.title.name, width: 220 },
    { columnName: col.resourse.name, width: 150 },
    { columnName: col.employee.name, width: 150 },
  ]);

  const [tableColumnVisibilityColumnExtensions] = useState([
    { columnName: 'time', togglingEnabled: false },
  ]);
  const { employees } = useEmployeesUp();
  const { resourses } = useResoursesUp();

  const [loadReminders, remindersData]: any = useLazyQuery(getRemindersActions);

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

  useEffect(() => {
    if (remindersData?.loading) {
      setLoading(true);
    }
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
      setLoading(false);
    }
  }, [remindersData]);

  return (
    <Box
      style={{
        height,
        width: '100%',
        backgroundColor: '#fff',
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
        ></DateNavigatorReports>
        <Box style={{ marginLeft: 20, marginRight: 20 }}>
          <Typography
            color="primary"
            style={{ fontSize: 18, fontWeight: 'bold' }}
          >
            {isRTL ? 'المفكرة' : 'Reminder'}
          </Typography>
        </Box>
      </Box>
      <Paper
        elevation={0}
        style={{
          overflow: 'auto',
          height: height - 50,
          width: '100%',
        }}
      >
        <Grid rows={rows} columns={columns} getRowId={getRowId}>
          <SortingState />
          <EditingState onCommitChanges={() => null} />
          <IntegratedSorting />
          <Table
            messages={{
              noData: isRTL ? 'لا يوجد بيانات' : 'no data',
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
      {loading && <Loading isRTL={isRTL} />}
    </Box>
  );
}
