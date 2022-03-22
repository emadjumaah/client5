/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-shadow */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useState } from 'react';
import {
  EditingState,
  SortingState,
  IntegratedSorting,
  SearchState,
  IntegratedFiltering,
  DataTypeProvider,
} from '@devexpress/dx-react-grid';
import {
  Grid,
  TableHeaderRow,
  TableEditColumn,
  VirtualTable,
  Toolbar,
  SearchPanel,
  TableColumnVisibility,
  ColumnChooser,
} from '@devexpress/dx-react-grid-material-ui';
import { Command, PopupEditing } from '../../Shared';
import { getRowId } from '../../common';
import { PopupContact } from '../../pubups';
import { AlertLocal, SearchTable } from '../../components';
import { errorAlert, errorDeleteAlert } from '../../Shared/helpers';
import PageLayout from '../main/PageLayout';
import { Box } from '@material-ui/core';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { TableComponent } from '../../Shared/TableComponent';
import ImportBtn from '../../common/ImportBtn';
import useContacts from '../../hooks/useContacts';
import PopupContactImport from '../../pubups/PopupContactImport';
import useGroups from '../../hooks/useGroups';
import { groupFormatter } from '../../Shared/colorFormat';
import ImportBtns from '../../common/ImportBtns';

export default function Contacts(props: any) {
  const { isRTL, words, menuitem, theme } = props;
  const [alrt, setAlrt] = useState({ show: false, msg: '', type: undefined });
  const [openImport, setOpenImport] = useState(false);
  const { height } = useWindowDimensions();
  const {
    contacts,
    refreshcontact,
    addContact,
    addMultiContacts,
    editContact,
    removeContact,
    syncCust,
    syncEmpl,
  } = useContacts();
  const { groups } = useGroups();
  const [columns] = useState([
    { name: isRTL ? 'nameAr' : 'name', title: words.name },
    { name: 'phone', title: words.phoneNumber },
    { name: 'groupIds', title: isRTL ? 'المجموعات' : 'Groups' },
    { name: 'email', title: words.email },
  ]);

  const commitChanges = async ({ deleted }) => {
    if (deleted) {
      const _id = deleted[0];
      const res = await removeContact({ variables: { _id } });
      if (res?.data?.deleteContact?.ok === false) {
        if (res?.data?.deleteContact?.error.includes('related')) {
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
      theme={theme}
      refresh={refreshcontact}
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
        <ImportBtn
          open={() => setOpenImport(true)}
          isRTL={isRTL}
          theme={theme}
        ></ImportBtn>
        <ImportBtns
          isRTL={isRTL}
          theme={theme}
          syncCust={syncCust}
          syncEmpl={syncEmpl}
        ></ImportBtns>

        <Grid rows={contacts} columns={columns} getRowId={getRowId}>
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
            tableComponent={TableComponent}
          />
          <TableHeaderRow showSortingControls />
          <DataTypeProvider
            for={['groupIds']}
            formatterComponent={(props) => groupFormatter(props, groups, isRTL)}
          ></DataTypeProvider>
          <TableColumnVisibility />
          <TableEditColumn
            showEditCommand
            showDeleteCommand
            showAddCommand
            commandComponent={Command}
          ></TableEditColumn>
          <Toolbar />
          <ColumnChooser />
          <SearchPanel
            inputComponent={(props: any) => {
              return <SearchTable isRTL={isRTL} {...props}></SearchTable>;
            }}
          />
          <PopupEditing
            theme={theme}
            addAction={addContact}
            editAction={editContact}
          >
            <PopupContact></PopupContact>
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
        <PopupContactImport
          open={openImport}
          onClose={() => setOpenImport(false)}
          addMultiItems={addMultiContacts}
          isRTL={isRTL}
          theme={theme}
          words={words}
        ></PopupContactImport>
      </Box>
    </PageLayout>
  );
}
