/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useContext, useEffect, useState } from 'react';
import {
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
  Toolbar,
  SearchPanel,
  DragDropProvider,
  Table,
  TableColumnReordering,
  TableColumnResizing,
  TableColumnVisibility,
  ColumnChooser,
  PagingPanel,
} from '@devexpress/dx-react-grid-material-ui';
import { Loading } from '../../Shared';
import { getRowId } from '../../common';
import { actionTimeFormatter, sentFormatter } from '../../Shared/colorFormat';

import { SearchTable } from '../../components';
import { getColumns } from '../../common/columns';

import { Box, Paper, Typography } from '@material-ui/core';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import PageLayout from '../main/PageLayout';
import { useLazyQuery, useMutation } from '@apollo/client';
import { getReminders, updateAction } from '../../graphql';
import DateNavigatorReports from '../../components/filters/DateNavigatorReports';
import ReminderContext from '../../contexts/reminder';
import useEmployeesUp from '../../hooks/useEmployeesUp';
import useDepartmentsUp from '../../hooks/useDepartmentsUp';
import useResoursesUp from '../../hooks/useResoursesUp';
import { useTemplate } from '../../hooks';
import getRemindersActions from '../../graphql/query/getRemindersActions';
import { TableComponent } from '../../Shared/TableComponent';

export default function ViewReminders(props: any) {
  const { isRTL, words, menuitem, theme } = props;

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [start, setStart] = useState<any>(null);
  const [end, setEnd] = useState<any>(null);

  const col = getColumns({ isRTL, words });

  const { tempoptions } = useTemplate();
  const [columns] = useState(
    tempoptions?.noTsk
      ? [col.time, col.title, col.employee, col.department, col.sent]
      : [
          col.time,
          col.title,
          col.resourse,
          col.employee,
          col.department,
          col.sent,
        ]
  );

  const [tableColumnExtensions]: any = useState([
    { columnName: col.time.name, width: 200 },
    { columnName: col.title.name, width: 250 },
    { columnName: col.resourse.name, width: 250 },
    { columnName: col.employee.name, width: 250 },
    { columnName: col.department.name, width: 250 },
    { columnName: col.sent.name, width: 120 },
  ]);

  const [tableColumnVisibilityColumnExtensions] = useState([
    { columnName: 'time', togglingEnabled: false },
  ]);
  const [pageSizes] = useState([5, 10, 15, 20, 50, 0]);

  const { width, height } = useWindowDimensions();
  const { employees } = useEmployeesUp();
  const { departments } = useDepartmentsUp();
  const { resourses } = useResoursesUp();

  const {
    state: { currentDate, currentViewName, endDate },
    dispatch,
  } = useContext(ReminderContext);

  const currentViewNameChange = (e: any) => {
    dispatch({ type: 'setCurrentViewName', payload: e.target.value });
  };
  const currentDateChange = (curDate: any) => {
    dispatch({ type: 'setCurrentDate', payload: curDate });
  };

  const endDateChange = (curDate: any) => {
    dispatch({ type: 'setEndDate', payload: curDate });
  };

  const [loadActions, actionsData]: any = useLazyQuery(getRemindersActions, {
    fetchPolicy: 'cache-and-network',
  });

  const refresQuery = {
    refetchQueries: [
      {
        query: getReminders,
        variables: {
          start: start ? start.setHours(0, 0, 0, 0) : undefined,
          end: end ? end.setHours(23, 59, 59, 999) : undefined,
        },
      },
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
    loadActions({
      variables,
    });
  }, [start, end]);

  const [editRAction] = useMutation(updateAction, refresQuery);

  useEffect(() => {
    if (actionsData?.loading) {
      setLoading(true);
    }
    if (actionsData?.data?.getRemindersActions?.data) {
      const { data } = actionsData.data.getRemindersActions;
      const rdata = data.map((da: any) => {
        let resourseNameAr: any;
        let resourseName: any;
        let departmentNameAr: any;
        let departmentName: any;
        let employeeNameAr: any;
        let employeeName: any;
        if (da?.resourseId) {
          const res = resourses.filter(
            (re: any) => re._id === da.resourseId
          )?.[0];
          resourseNameAr = res?.nameAr;
          resourseName = res?.name;
        }
        if (da?.departmentId) {
          const res = departments.filter(
            (re: any) => re._id === da.departmentId
          )?.[0];
          departmentNameAr = res?.nameAr;
          departmentName = res?.name;
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
          departmentNameAr,
          departmentName,
          employeeNameAr,
          employeeName,
          time: da?.sendtime,
        };
      });
      setRows(rdata);
      setLoading(false);
    }
  }, [actionsData]);

  const refresh = () => {
    actionsData?.refetch();
  };
  return (
    <PageLayout
      menuitem={menuitem}
      isRTL={isRTL}
      words={words}
      theme={theme}
      refresh={refresh}
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
            marginLeft: 40,
            marginRight: 40,
            marginTop: 60,
            overflow: 'auto',
            width: width - 330,
            // height: height - 200,
            borderRadius: 10,
          }}
        >
          <Grid rows={rows} columns={columns} getRowId={getRowId}>
            <SortingState />
            <SearchState />
            <PagingState defaultCurrentPage={0} defaultPageSize={15} />
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
                <Table.Row {...props} style={{ height: 40 }}></Table.Row>
              )}
              columnExtensions={tableColumnExtensions}
            />

            <TableColumnReordering
              defaultOrder={[
                col.time.name,
                col.title.name,
                col.resourse.name,
                col.employee.name,
                col.department.name,
                col.sent.name,
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
              defaultHiddenColumnNames={[]}
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

            <Toolbar />
            <ColumnChooser />
            <PagingPanel pageSizes={pageSizes} />

            <SearchPanel
              inputComponent={(props: any) => {
                return <SearchTable isRTL={isRTL} {...props}></SearchTable>;
              }}
            />
          </Grid>
        </Paper>

        {loading && <Loading isRTL={isRTL} />}
      </Box>
    </PageLayout>
  );
}
