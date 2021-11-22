/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useContext, useEffect, useState } from 'react';
import {
  SortingState,
  IntegratedSorting,
  SearchState,
  IntegratedFiltering,
  DataTypeProvider,
} from '@devexpress/dx-react-grid';
import {
  Grid,
  TableHeaderRow,
  VirtualTable,
  Toolbar,
  SearchPanel,
} from '@devexpress/dx-react-grid-material-ui';
import { getRowId } from '../../common';
import { SearchTable } from '../../components';
import PageLayout from '../main/PageLayout';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { useLazyQuery } from '@apollo/client';
import getMessagesList from '../../graphql/query/getMessagesList';
import { TableComponent } from '../../Shared/TableComponent';
import { EventsContext } from '../../contexts';
import { Box } from '@material-ui/core';
import DateNavigatorReports from '../../components/filters/DateNavigatorReports';
import {
  actionTimeFormatter,
  isActiveViewFormatter,
} from '../../Shared/colorFormat';

export default function Messages({
  isRTL,
  words,
  isEditor,
  theme,
  menuitem,
}: any) {
  const [rows, setRows] = useState([]);
  const [start, setStart] = useState<any>(null);
  const [end, setEnd] = useState<any>(null);

  const [columns] = useState([
    { name: 'sendtime', title: words.time },
    { name: 'phone', title: words.phoneNumber },
    { name: 'body', title: words.body },
    { name: 'smsqty', title: words.qty },
    { name: 'active', title: words.status },
    { name: 'sent', title: isRTL ? 'تم الارسال' : 'Sent' },
  ]);

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

  const { height } = useWindowDimensions();
  const [loadMsgs, msgsData]: any = useLazyQuery(getMessagesList);

  useEffect(() => {
    const variables = {
      start: start ? start.setHours(0, 0, 0, 0) : undefined,
      end: end ? end.setHours(23, 59, 59, 999) : undefined,
    };
    loadMsgs({
      variables,
    });
  }, [start, end]);
  useEffect(() => {
    if (msgsData?.data?.getMessagesList?.data) {
      const { data } = msgsData.data.getMessagesList;
      setRows(data);
    }
  }, [msgsData]);

  return (
    <PageLayout
      menuitem={menuitem}
      isRTL={isRTL}
      words={words}
      isEditor={isEditor}
      theme={theme}
      refresh={() => null}
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
            estimatedRowHeight={45}
            tableComponent={TableComponent}
          />
          <DataTypeProvider
            for={['sendtime']}
            formatterComponent={actionTimeFormatter}
          ></DataTypeProvider>
          <DataTypeProvider
            for={['sent', 'active']}
            formatterComponent={isActiveViewFormatter}
          ></DataTypeProvider>

          <TableHeaderRow showSortingControls />
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
