/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useEffect, useState } from 'react';
import Paper from '@material-ui/core/Paper';
import {
  SortingState,
  IntegratedSorting,
  SearchState,
  IntegratedFiltering,
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
import getNotifications from '../../graphql/query/getNotifications';
import { TableComponent } from '../../Shared/TableComponent';

export default function Notifications({
  isRTL,
  words,
  isEditor,
  theme,
  menuitem,
}: any) {
  const [rows, setRows] = useState([]);

  const [columns] = useState([
    { name: 'title', title: words.title },
    { name: 'body', title: words.body },
    { name: 'read', title: words.status },
  ]);

  const { height } = useWindowDimensions();
  const [loadMsgs, msgsData]: any = useLazyQuery(getNotifications);

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
      isEditor={isEditor}
      theme={theme}
      refresh={() => null}
    >
      <Paper>
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
          <Toolbar />
          <SearchPanel
            inputComponent={(props: any) => {
              return <SearchTable isRTL={isRTL} {...props}></SearchTable>;
            }}
          />
        </Grid>
      </Paper>
    </PageLayout>
  );
}