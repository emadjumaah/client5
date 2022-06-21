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
  PagingState,
  IntegratedPaging,
} from '@devexpress/dx-react-grid';
import {
  Grid,
  TableHeaderRow,
  TableEditColumn,
  Toolbar,
  SearchPanel,
  TableColumnVisibility,
  ColumnChooser,
  DragDropProvider,
  Table,
  TableColumnReordering,
  TableColumnResizing,
  PagingPanel,
} from '@devexpress/dx-react-grid-material-ui';
import { Command, PopupEditing } from '../../Shared';
import { getRowId } from '../../common';
import { PopupSendreq } from '../../pubups';
import { AlertLocal, SearchTable } from '../../components';
import { errorAlert, errorDeleteAlert } from '../../Shared/helpers';
import PageLayout from '../main/PageLayout';
import { Box, colors, Paper, Typography } from '@material-ui/core';
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

  const [tableColumnExtensions]: any = useState([
    { columnName: 'runtime', width: 100 },
    { columnName: 'title', width: 200 },
    { columnName: 'groups', width: 150 },
    { columnName: 'qty', width: 200 },
    { columnName: 'active', width: 200 },
  ]);

  const [tableColumnVisibilityColumnExtensions] = useState([
    { columnName: 'runtime', togglingEnabled: false },
    { columnName: 'title', togglingEnabled: false },
  ]);
  const [pageSizes] = useState([5, 10, 20, 50, 0]);
  const { width, height } = useWindowDimensions();

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
        }}
      >
        <Box
          display="flex"
          style={{
            position: 'absolute',
            zIndex: 111,
            left: 316,
            marginTop: 9,
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
        <Paper
          elevation={5}
          style={{
            margin: 40,
            marginTop: 80,
            overflow: 'auto',
            width: width - 330,
            // height: height - 200,
            borderRadius: 10,
          }}
        >
          <Grid rows={sendreqs} columns={columns} getRowId={getRowId}>
            <SortingState />
            <EditingState onCommitChanges={commitChanges} />
            <SearchState />
            <PagingState defaultCurrentPage={0} defaultPageSize={10} />
            <IntegratedSorting />
            <IntegratedFiltering />
            <IntegratedPaging />
            <DragDropProvider />
            <Table
              messages={{
                noData: isRTL ? 'لا يوجد بيانات' : 'no data',
              }}
              tableComponent={TableComponent}
              rowComponent={(props: any) => (
                <Table.Row {...props} style={{ height: 60 }}></Table.Row>
              )}
              columnExtensions={tableColumnExtensions}
            />

            <TableColumnReordering
              defaultOrder={['runtime', 'title', 'groups', 'qty', 'active']}
            />
            <TableColumnResizing defaultColumnWidths={tableColumnExtensions} />

            <TableHeaderRow
              showSortingControls
              titleComponent={({ children }) => {
                return (
                  <Typography style={{ fontSize: 14, fontWeight: 'bold' }}>
                    {children}
                  </Typography>
                );
              }}
            />
            <TableColumnVisibility
              columnExtensions={tableColumnVisibilityColumnExtensions}
              defaultHiddenColumnNames={[]}
            />
            <DataTypeProvider
              for={['nameAr', 'name']}
              formatterComponent={(props: any) =>
                nameLinkFormat({ ...props, setItem, setOpenItem, isRTL })
              }
            ></DataTypeProvider>
            <DataTypeProvider
              for={['groups']}
              formatterComponent={(props) =>
                groupFormatter(props, groups, isRTL)
              }
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
            <PagingPanel pageSizes={pageSizes} />
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
        </Paper>
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
