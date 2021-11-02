/* eslint-disable no-shadow */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import {
  EditingState,
  SortingState,
  IntegratedSorting,
  SearchState,
  IntegratedFiltering,
} from '@devexpress/dx-react-grid';
import {
  Grid,
  TableHeaderRow,
  TableEditColumn,
  VirtualTable,
  Toolbar,
  SearchPanel,
} from '@devexpress/dx-react-grid-material-ui';
import { Command, Loading, PopupEditing } from '../../Shared';
import { useSuppliers } from '../../hooks';
import { getRowId } from '../../common';
import { AlertLocal, SearchTable } from '../../components';
import { errorAlert, errorDeleteAlert } from '../../Shared/helpers';
import PopupSupplier from '../../pubups/PopupSupplier';
import useWindowDimensions from '../../hooks/useWindowDimensions';

export default function Suppliers(props: any) {
  const { isRTL, words, isEditor, theme } = props;
  const [loading, setLoading] = useState(false);
  const [alrt, setAlrt] = useState({ show: false, msg: '', type: undefined });

  const [columns] = useState([
    { name: isRTL ? 'nameAr' : 'name', title: words.name },
    { name: 'phone', title: words.phoneNumber },
    { name: 'email', title: words.email },
  ]);

  const { suppliers, addSupplier, editSupplier, removeSupplier } =
    useSuppliers();
  const { height } = useWindowDimensions();
  const commitChanges = async ({ deleted }) => {
    if (deleted) {
      const _id = deleted[0];
      setLoading(true);

      const res = await removeSupplier({ variables: { _id } });
      if (res?.data?.deleteSupplier?.ok === false) {
        if (res?.data?.deleteSupplier?.error.includes('related')) {
          await errorDeleteAlert(setAlrt, isRTL);
        } else {
          await errorAlert(setAlrt, isRTL);
        }
      }
      setLoading(false);
    }
  };

  return (
    <Paper>
      {loading && <Loading isRTL={isRTL}></Loading>}
      <Grid rows={suppliers} columns={columns} getRowId={getRowId}>
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
          estimatedRowHeight={40}
        />
        <TableHeaderRow showSortingControls />
        {isEditor && (
          <TableEditColumn
            showEditCommand
            showDeleteCommand
            showAddCommand
            commandComponent={Command}
          ></TableEditColumn>
        )}
        <Toolbar />
        <SearchPanel
          inputComponent={(props: any) => {
            return <SearchTable isRTL={isRTL} {...props}></SearchTable>;
          }}
        />
        <PopupEditing
          theme={theme}
          addAction={addSupplier}
          editAction={editSupplier}
        >
          <PopupSupplier></PopupSupplier>
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
    </Paper>
  );
}
