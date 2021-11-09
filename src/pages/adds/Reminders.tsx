/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useState } from 'react';
import {
  SortingState,
  IntegratedSorting,
  DataTypeProvider,
  SearchState,
  IntegratedFiltering,
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
import { Command, PopupEditing } from '../../Shared';
import { getRowId } from '../../common';
import {
  actionTimeFormatter,
  isActiveFormatter,
} from '../../Shared/colorFormat';

import { AlertLocal, SearchTable } from '../../components';
import { getColumns } from '../../common/columns';

import { Box, useMediaQuery } from '@material-ui/core';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import PageLayout from '../main/PageLayout';
import useReminders from '../../hooks/useReminders';
import { errorAlert, errorDeleteAlert } from '../../Shared/helpers';
import PopupReminder from '../../pubups/PopupReminder';

export default function Reminders(props: any) {
  const { isRTL, words, menuitem, isEditor, theme } = props;
  const [alrt, setAlrt] = useState({ show: false, msg: '', type: undefined });

  const col = getColumns({ isRTL, words });
  const isMobile = useMediaQuery('(max-width:600px)');

  const [columns] = useState([
    col.runtime,
    col.title,
    { name: 'active', title: words.status },
  ]);

  const { height } = useWindowDimensions();

  const {
    reminders,
    addReminder,
    editReminder,
    removeReminder,
    refreshreminders,
  } = useReminders();

  const commitChanges = async ({ deleted }) => {
    if (deleted) {
      const _id = deleted[0];
      const res = await removeReminder({ variables: { _id } });
      if (res?.data?.deleteReminder?.ok === false) {
        if (res?.data?.deleteReminder?.error.includes('related')) {
          await errorDeleteAlert(setAlrt, isRTL);
        } else {
          await errorAlert(setAlrt, isRTL);
        }
      }
    }
  };

  return (
    <PageLayout
      menuitem={menuitem}
      isRTL={isRTL}
      words={words}
      isEditor={isEditor}
      theme={theme}
      refresh={refreshreminders}
    >
      <Box>
        <Grid rows={reminders} columns={columns} getRowId={getRowId}>
          <SortingState />
          {!isMobile && <SearchState />}
          <EditingState onCommitChanges={commitChanges} />

          <IntegratedSorting />
          {!isMobile && <IntegratedFiltering />}

          <VirtualTable
            height={height - 100}
            messages={{
              noData: isRTL ? 'لا يوجد بيانات' : 'no data',
            }}
            estimatedRowHeight={40}
          />

          <DataTypeProvider
            for={['runtime']}
            formatterComponent={actionTimeFormatter}
          ></DataTypeProvider>
          <DataTypeProvider
            for={['active']}
            formatterComponent={(props: any) =>
              isActiveFormatter({ ...props, editSendreq: editReminder })
            }
          ></DataTypeProvider>
          {isEditor && (
            <TableEditColumn
              showEditCommand
              showDeleteCommand
              showAddCommand
              commandComponent={Command}
            ></TableEditColumn>
          )}
          <TableHeaderRow showSortingControls />

          {!isMobile && <Toolbar />}
          {!isMobile && (
            <SearchPanel
              inputComponent={(props: any) => {
                return <SearchTable isRTL={isRTL} {...props}></SearchTable>;
              }}
            />
          )}
          <PopupEditing
            theme={theme}
            addAction={addReminder}
            editAction={editReminder}
          >
            <PopupReminder></PopupReminder>
          </PopupEditing>
        </Grid>
        {alrt.show && (
          <AlertLocal
            isRTL={isRTL}
            type={alrt?.type}
            msg={alrt?.msg}
            top
          ></AlertLocal>
        )}
      </Box>
    </PageLayout>
  );
}
