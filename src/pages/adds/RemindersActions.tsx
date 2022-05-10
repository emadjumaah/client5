/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useContext, useEffect, useState } from 'react';
import {
  SortingState,
  IntegratedSorting,
  DataTypeProvider,
  SearchState,
  IntegratedFiltering,
} from '@devexpress/dx-react-grid';
import {
  Grid,
  TableHeaderRow,
  VirtualTable,
  SearchPanel,
  Toolbar,
} from '@devexpress/dx-react-grid-material-ui';
import { Loading } from '../../Shared';
import { getRowId } from '../../common';
import { useLazyQuery } from '@apollo/client';
import getRemindersActions from '../../graphql/query/getRemindersActions';

import {
  actionTimeFormatter,
  taskIdFormatter,
  userFormatter,
} from '../../Shared/colorFormat';
import PageLayout from '../main/PageLayout';
import { SearchTable } from '../../components';
import { EventsContext } from '../../contexts';
import DateNavigatorReports from '../../components/filters/DateNavigatorReports';
import { Box } from '@material-ui/core';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { TableComponent } from '../../Shared/TableComponent';
import { useUsers } from '../../hooks';
import useTasks from '../../hooks/useTasks';
import useEmployeesUp from '../../hooks/useEmployeesUp';
import useDepartmentsUp from '../../hooks/useDepartmentsUp';
import useResoursesUp from '../../hooks/useResoursesUp';
import { getColumns } from '../../common/columns';

export default function RemindersActions({ isRTL, words, menuitem, theme }) {
  const col = getColumns({ isRTL, words });

  const [columns] = useState([
    { name: 'sendtime', title: words.time },
    { name: 'body', title: words.body },
    col.resourse,
    col.employee,
    col.department,
    col.taskId,
    col.amount,
  ]);

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const { users } = useUsers();
  const [start, setStart] = useState<any>(null);
  const [end, setEnd] = useState<any>(null);
  const { height } = useWindowDimensions();
  const {
    state: { currentDate, currentViewName, endDate },
    dispatch,
  } = useContext(EventsContext);

  const { tasks } = useTasks();
  const { employees } = useEmployeesUp();
  const { departments } = useDepartmentsUp();
  const { resourses } = useResoursesUp();

  const currentViewNameChange = (e: any) => {
    dispatch({ type: 'setCurrentViewName', payload: e.target.value });
  };
  const currentDateChange = (curDate: any) => {
    dispatch({ type: 'setCurrentDate', payload: curDate });
  };

  const endDateChange = (curDate: any) => {
    dispatch({ type: 'setEndDate', payload: curDate });
  };

  const [loadActions, actionsData]: any = useLazyQuery(getRemindersActions);

  useEffect(() => {
    const variables = {
      start: start ? start.setHours(0, 0, 0, 0) : undefined,
      end: end ? end.setHours(23, 59, 59, 999) : undefined,
    };
    loadActions({
      variables,
    });
  }, [start, end]);

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
          marginLeft: 5,
          marginRight: 5,
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
        <Grid rows={rows} columns={columns} getRowId={getRowId}>
          <SortingState />
          <SearchState />
          <IntegratedSorting />
          <IntegratedFiltering />
          <VirtualTable
            height={height - 100}
            messages={{
              noData: isRTL ? 'لا يوجد بيانات' : 'no data',
            }}
            estimatedRowHeight={40}
            tableComponent={TableComponent}
          />
          <TableHeaderRow showSortingControls />
          <DataTypeProvider
            for={['sendtime']}
            formatterComponent={actionTimeFormatter}
          ></DataTypeProvider>
          <DataTypeProvider
            for={['user']}
            formatterComponent={(props: any) =>
              userFormatter({ ...props, users })
            }
          ></DataTypeProvider>
          <DataTypeProvider
            for={['taskId']}
            formatterComponent={(props: any) =>
              taskIdFormatter({ ...props, tasks })
            }
          ></DataTypeProvider>
          <Toolbar />
          <SearchPanel
            inputComponent={(props: any) => {
              return <SearchTable isRTL={isRTL} {...props}></SearchTable>;
            }}
          />
        </Grid>
        {loading && <Loading isRTL={isRTL} />}
      </Box>
    </PageLayout>
  );
}
