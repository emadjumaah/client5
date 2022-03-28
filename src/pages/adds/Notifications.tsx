/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useEffect, useState } from 'react';
import Paper from '@material-ui/core/Paper';
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
import { useLazyQuery, useMutation } from '@apollo/client';
import getNotifications from '../../graphql/query/getNotifications';
import { TableComponent } from '../../Shared/TableComponent';
import { eventFormatter } from '../../Shared/colorFormat';
import { Box, FormControlLabel, Switch, Tooltip } from '@material-ui/core';
import updatePushToken from '../../graphql/mutation/updatePushToken';
import { subscribePushToken } from '../../common/helpers';

export default function Notifications({
  isRTL,
  words,
  theme,
  menuitem,
  notify,
  dispatch,
  company,
}: any) {
  const [rows, setRows] = useState([]);

  const [columns] = useState([
    { name: 'body', title: words.body },

    // { name: 'read', title: words.status },
    { name: 'eventId', title: words.appointment },
  ]);

  const { height } = useWindowDimensions();
  const [loadMsgs, msgsData]: any = useLazyQuery(getNotifications);

  const [updatePush] = useMutation(updatePushToken);

  const handleNotification = async (e: any) => {
    const { checked } = e.target;
    dispatch({ type: 'setNotify', payload: checked });
    try {
      const pushToken = await subscribePushToken(company, checked);
      console.log('pushToken', pushToken);
      const variables = { pushToken, notify: checked };
      updatePush({ variables });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadMsgs();
  }, []);
  useEffect(() => {
    if (msgsData?.data?.getNotifications?.data) {
      const { data } = msgsData.data.getNotifications;
      setRows(data);
    }
  }, [msgsData]);

  return (
    <PageLayout
      menuitem={menuitem}
      isRTL={isRTL}
      words={words}
      theme={theme}
      refresh={() => null}
    >
      <Paper>
        <Box
          display="flex"
          style={{
            position: 'absolute',
            right: 280,
            top: 55,
            alignItems: 'center',
            justifyContent: 'start',
            zIndex: 110,
          }}
        >
          <FormControlLabel
            control={
              <Tooltip
                title={
                  isRTL
                    ? notify
                      ? 'ايقاف التبيهات'
                      : 'تفعيل التنبيهات'
                    : !notify
                    ? 'Activate Notifications'
                    : 'Stop Notifications'
                }
              >
                <Switch
                  checked={notify}
                  onChange={handleNotification}
                  name="checkedA"
                  inputProps={{ 'aria-label': 'secondary checkbox' }}
                />
              </Tooltip>
            }
            labelPlacement="end"
            label={
              isRTL
                ? notify
                  ? 'التبيهات فعالة'
                  : 'التنبيهات متوقفة'
                : !notify
                ? 'Notifications Activated'
                : 'Notifications Stoped'
            }
          />
        </Box>
        <Box pr={3} pl={3}>
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
              for={['eventId']}
              formatterComponent={(props: any) => eventFormatter({ ...props })}
            ></DataTypeProvider>
            <Toolbar />
            <SearchPanel
              inputComponent={(props: any) => {
                return <SearchTable isRTL={isRTL} {...props}></SearchTable>;
              }}
            />
          </Grid>
        </Box>
      </Paper>
    </PageLayout>
  );
}
