/* eslint-disable react-hooks/exhaustive-deps */
import { useLazyQuery, useMutation } from '@apollo/client';
import { DataTypeProvider, EditingState } from '@devexpress/dx-react-grid';
import {
  Grid,
  Table,
  TableEditColumn,
  TableHeaderRow,
} from '@devexpress/dx-react-grid-material-ui';
import React from 'react';
import { useEffect, useState } from 'react';
import { getRowId } from '../common';
import { AlertLocal } from '../components';
import {
  createAction,
  deleteAction,
  getActions,
  updateAction,
} from '../graphql';
import PopupLayout from '../pages/main/PopupLayout';
import PopupAction from '../pubups/PopupAction';
import { actionTimeFormatter, actionTypeFormatter } from './colorFormat';
import { CommandAddSmall } from './CommandAddSmall';
import { errorAlert } from './helpers';
import Loading from './Loading';
import PopupEditing from './PopupEditing';

export default function ActionsView({
  open,
  onClose,
  event,
  words,
  isRTL,
  setActionslist,
  theme,
}: any) {
  const [loading, setLoading] = useState(false);

  const [alrt, setAlrt] = useState({ show: false, msg: '', type: undefined });

  const [rows, setRows] = useState([]);

  const [columns] = useState([
    { name: 'sendtime', title: words.time },
    { name: 'type', title: words.to },
  ]);

  const [loadActions, actionsData]: any = useLazyQuery(getActions, {
    variables: { eventId: event.id },
    fetchPolicy: 'cache-and-network',
  });

  const refresQuery = {
    refetchQueries: [
      {
        query: getActions,
        variables: {
          eventId: event.id,
        },
      },
    ],
  };

  const [addAction] = useMutation(createAction, refresQuery);
  const [editAction] = useMutation(updateAction, refresQuery);
  const [removeAction] = useMutation(deleteAction, refresQuery);

  useEffect(() => {
    loadActions({ variables: { eventId: event.id } });
  }, [event.id, loadActions]);

  useEffect(() => {
    if (actionsData?.data?.getActions?.data) {
      const { data } = actionsData.data.getActions;
      setRows(data);
      setActionslist(data);
    }
  }, [actionsData]);

  const commitChanges = async ({ deleted }) => {
    if (deleted) {
      const _id = deleted[0];
      setLoading(true);

      const res = await removeAction({ variables: { _id } });
      if (res?.data?.deleteAction?.ok === false) {
        await errorAlert(setAlrt, isRTL);
      }
      setLoading(false);
    }
  };
  const title = isRTL ? 'التبيهات' : 'Reminders';
  return (
    <PopupLayout
      isRTL={isRTL}
      open={open}
      onClose={onClose}
      title={title}
      onSubmit={() => null}
      theme={theme}
      alrt={alrt}
      onlyclose
    >
      <>
        {loading && <Loading isRTL={isRTL}></Loading>}
        <Grid rows={rows} columns={columns} getRowId={getRowId}>
          <EditingState onCommitChanges={commitChanges} />

          <Table messages={{ noData: '' }} />
          <TableHeaderRow />
          <TableEditColumn
            showEditCommand
            showDeleteCommand
            showAddCommand
            commandComponent={CommandAddSmall}
          ></TableEditColumn>
          <DataTypeProvider
            for={['sendtime']}
            formatterComponent={actionTimeFormatter}
          ></DataTypeProvider>
          <DataTypeProvider
            for={['type']}
            formatterComponent={actionTypeFormatter}
          ></DataTypeProvider>
          <PopupEditing
            theme={theme}
            addAction={addAction}
            editAction={editAction}
          >
            <PopupAction event={event}></PopupAction>
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
      </>
    </PopupLayout>
  );
}
