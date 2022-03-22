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
import getNotificationsList from '../../graphql/query/getNotificationsList';

import {
  actionTimeFormatter,
  isActiveViewFormatter,
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

export default function Actions({ isRTL, words, menuitem, theme }) {
  const [columns] = useState([
    { name: 'sendtime', title: words.time },
    { name: 'user', title: words.user },
    { name: 'body', title: words.body },
    { name: 'active', title: words.status },
    { name: 'sent', title: isRTL ? 'تم الارسال' : 'Sent' },
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
      setRows(data);
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
            for={['sent', 'active']}
            formatterComponent={isActiveViewFormatter}
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
        {loading && <Loading isRTL={isRTL} />}
      </Box>
    </PageLayout>
  );
}
