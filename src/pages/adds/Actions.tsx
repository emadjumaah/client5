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
import { getRowId } from '../../common';
import { useLazyQuery } from '@apollo/client';
import getNotificationsList from '../../graphql/query/getNotificationsList';

import { actionTimeFormatter, userFormatter } from '../../Shared/colorFormat';
import PageLayout from '../main/PageLayout';
import { SearchTable } from '../../components';
import { EventsContext } from '../../contexts';
import DateNavigatorReports from '../../components/filters/DateNavigatorReports';
import { Box, Typography } from '@material-ui/core';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { TableComponent } from '../../Shared/TableComponent';
import { useUsers } from '../../hooks';
import useEmployees from '../../hooks/useEmployees';
import useDepartments from '../../hooks/useDepartments';
import useResourses from '../../hooks/useResourses';
import { getColumns } from '../../common/columns';
import useTasks from '../../hooks/useTasks';

export default function Actions({ isRTL, words, menuitem, theme }) {
  const col = getColumns({ isRTL, words });

  const [columns] = useState([
    { name: 'sendtime', title: words.time },
    { name: 'body', title: words.body },
    col.resourse,
    col.employee,
    col.department,
    col.contract,
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

  const { employees } = useEmployees();
  const { departments } = useDepartments();
  const { resourses } = useResourses();
  const { tasks } = useTasks();

  const currentViewNameChange = (e: any) => {
    dispatch({ type: 'setCurrentViewName', payload: e.target.value });
  };
  const currentDateChange = (curDate: any) => {
    dispatch({ type: 'setCurrentDate', payload: curDate });
  };

  const endDateChange = (curDate: any) => {
    dispatch({ type: 'setEndDate', payload: curDate });
  };

  const [loadActions, actionsData]: any = useLazyQuery(getNotificationsList);

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
    if (actionsData?.data?.getNotificationsList?.data) {
      const { data } = actionsData.data.getNotificationsList;
      const rdata = data.map((da: any) => {
        let resourseNameAr: any;
        let resourseName: any;
        let departmentNameAr: any;
        let departmentName: any;
        let employeeNameAr: any;
        let employeeName: any;
        let contractNameAr: any;
        let contractName: any;
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
        if (da?.contractId) {
          const res = tasks.filter((re: any) => re._id === da.contractId)?.[0];
          contractNameAr = res?.nameAr;
          contractName = res?.name;
        }
        return {
          ...da,
          resourseName,
          resourseNameAr,
          departmentNameAr,
          departmentName,
          employeeNameAr,
          employeeName,
          contractNameAr,
          contractName,
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
      loading={loading}
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
          <Toolbar />
          <SearchPanel
            inputComponent={(props: any) => {
              return <SearchTable isRTL={isRTL} {...props}></SearchTable>;
            }}
          />
        </Grid>
      </Box>
    </PageLayout>
  );
}
