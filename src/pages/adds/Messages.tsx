/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useContext, useEffect, useState } from 'react';
import {
  SortingState,
  IntegratedSorting,
  SearchState,
  IntegratedFiltering,
  DataTypeProvider,
  EditingState,
} from '@devexpress/dx-react-grid';
import {
  Grid,
  TableHeaderRow,
  VirtualTable,
  Toolbar,
  SearchPanel,
  TableEditColumn,
} from '@devexpress/dx-react-grid-material-ui';
import { getRowId } from '../../common';
import { SearchTable } from '../../components';
import PageLayout from '../main/PageLayout';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { useLazyQuery, useMutation } from '@apollo/client';
import { TableComponent } from '../../Shared/TableComponent';
import { EventsContext } from '../../contexts';
import { Box, colors, Typography } from '@material-ui/core';
import DateNavigatorReports from '../../components/filters/DateNavigatorReports';
import {
  mobilesFormatter,
  actionTimeFormatter,
  totalFormatter,
} from '../../Shared/colorFormat';
import { Command, PopupEditing } from '../../Shared';
import PopupSendSMS from '../../pubups/PopupSendSMS';
import createSingleSMS from '../../graphql/mutation/createSingleSMS';
import getMessages from '../../graphql/query/getMessages';
export default function Messages({
  isRTL,
  words,
  theme,
  menuitem,
  company,
  refreshcompany,
}: any) {
  const [rows, setRows] = useState([]);
  const [start, setStart] = useState<any>(null);
  const [end, setEnd] = useState<any>(null);

  const [columns] = useState([
    { name: 'createdAt', title: words.time, width: 100 },
    { name: 'phones', title: words.phoneNumber, width: 100 },
    { name: 'body', title: words.body },
    { name: 'qty', title: isRTL ? 'عدد الرسائل' : 'SMS Qty' },
    { name: 'total', title: words.total },
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
  const [loadMsgs, msgsData]: any = useLazyQuery(getMessages);

  const refresQuery = {
    refetchQueries: [
      {
        query: getMessages,
        variables: {
          start: start ? start.setHours(0, 0, 0, 0) : undefined,
          end: end ? end.setHours(23, 59, 59, 999) : undefined,
        },
      },
    ],
  };

  const [addSMS] = useMutation(createSingleSMS, refresQuery);

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
    if (msgsData?.data?.getMessages?.data) {
      const { data } = msgsData.data.getMessages;
      setRows(data);
    }
  }, [msgsData]);

  const commitChanges = async ({ deleted }) => {
    if (deleted) {
      console.log('deleted', deleted);
    }
  };

  const refresh = () => {
    msgsData?.refetch();
    refreshcompany();
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
            width: '70%',
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
          <Box
            display="flex"
            style={{
              flex: 1,
              justifyContent: 'flex-end',
            }}
          >
            <Typography
              style={{ fontWeight: 'bold', fontSize: 12 }}
              color="primary"
            >
              {isRTL ? 'الرسائل المتبقية' : 'SMS balance'}
              <span
                style={{
                  color: colors.blue[500],
                  paddingLeft: 10,
                  paddingRight: 10,
                  fontSize: 22,
                }}
              >
                {company?.smss?.toLocaleString()}
              </span>
            </Typography>
          </Box>
        </Box>

        <Grid rows={rows} columns={columns} getRowId={getRowId}>
          <SortingState />
          <SearchState />
          <EditingState onCommitChanges={commitChanges} />

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
            for={['createdAt']}
            formatterComponent={actionTimeFormatter}
          ></DataTypeProvider>
          <DataTypeProvider
            for={['phones']}
            formatterComponent={mobilesFormatter}
          ></DataTypeProvider>
          <DataTypeProvider
            for={['total']}
            formatterComponent={(props: any) => totalFormatter({ ...props })}
          ></DataTypeProvider>
          <TableHeaderRow showSortingControls />
          <TableEditColumn
            showAddCommand
            commandComponent={Command}
          ></TableEditColumn>
          <Toolbar />
          <SearchPanel
            inputComponent={(props: any) => {
              return <SearchTable isRTL={isRTL} {...props}></SearchTable>;
            }}
          />
          <PopupEditing theme={theme} addAction={addSMS}>
            <PopupSendSMS></PopupSendSMS>
          </PopupEditing>
        </Grid>
      </Box>
    </PageLayout>
  );
}
