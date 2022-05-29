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
import { PopupSendreq } from '../../pubups';
import { AlertLocal, SearchTable } from '../../components';
import { errorAlert, errorDeleteAlert } from '../../Shared/helpers';
import PageLayout from '../main/PageLayout';
import { Box } from '@material-ui/core';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { TableComponent } from '../../Shared/TableComponent';
import useSendreqs from '../../hooks/useSendreqs';
import PopupSendreqView from '../../pubups/PopupSendreqView';
import {
  actionTimeFormatter,
  groupFormatter,
  isActiveFormatter,
  nameLinkFormat,
} from '../../Shared/colorFormat';
import useGroups from '../../hooks/useGroups';

export default function Sendreqs(props: any) {
  const { isRTL, words, menuitem, theme, company } = props;

  const [alrt, setAlrt] = useState({ show: false, msg: '', type: undefined });
  const [openItem, setOpenItem] = useState(false);
  const [item, setItem] = useState(null);

  const { height } = useWindowDimensions();
  const {
    sendreqs,
    refreshsendreqs,
    addSendreq,
    editSendreq,
    removeSendreq,
    // ooredoo,
  } = useSendreqs();
  const [columns] = useState([
    { name: 'runtime', title: isRTL ? 'وقت الارسال' : 'Send Time' },
    { name: 'title', title: words.name },
    { name: 'groups', title: isRTL ? 'قائمة الاتصال' : 'Contact List' },
    { name: 'qty', title: words.qty },
    { name: 'active', title: words.status },
  ]);
  const { groups } = useGroups();
  const smss = company?.smss ? company?.smss : 0;
  const apiKey = company?.apiKey;
  const commitChanges = async ({ deleted }) => {
    if (deleted) {
      const _id = deleted[0];
      const res = await removeSendreq({ variables: { _id } });
      if (res?.data?.deleteSendreq?.ok === false) {
        if (res?.data?.deleteSendreq?.error.includes('related')) {
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
      refresh={refreshsendreqs}
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
        <Grid rows={sendreqs} columns={columns} getRowId={getRowId}>
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
            for={['nameAr', 'name']}
            formatterComponent={(props: any) =>
              nameLinkFormat({ ...props, setItem, setOpenItem })
            }
          ></DataTypeProvider>
          <DataTypeProvider
            for={['groups']}
            formatterComponent={(props) => groupFormatter(props, groups, isRTL)}
          ></DataTypeProvider>
          <DataTypeProvider
            for={['runtime']}
            formatterComponent={actionTimeFormatter}
          ></DataTypeProvider>
          <DataTypeProvider
            for={['active']}
            formatterComponent={(props: any) =>
              isActiveFormatter({ ...props, editSendreq })
            }
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
            addAction={addSendreq}
            editAction={editSendreq}
          >
            <PopupSendreq smss={smss} apiKey={apiKey}></PopupSendreq>
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
        <PopupSendreqView
          open={openItem}
          onClose={() => {
            setOpenItem(false);
            setItem(null);
          }}
          isRTL={isRTL}
          theme={theme}
          words={words}
          item={item}
        ></PopupSendreqView>
      </Box>
    </PageLayout>
  );
}
