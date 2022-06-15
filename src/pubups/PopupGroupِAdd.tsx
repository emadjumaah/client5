/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { Box, Paper, Typography } from '@material-ui/core';

import PopupLayout from '../pages/main/PopupLayout';
import {
  Grid,
  SearchPanel,
  TableHeaderRow,
  Toolbar,
  VirtualTable,
} from '@devexpress/dx-react-grid-material-ui';
import { TableComponent } from '../Shared/ItemsTable';
import {
  DataTypeProvider,
  EditingState,
  IntegratedFiltering,
  IntegratedSorting,
  SearchState,
  SortingState,
} from '@devexpress/dx-react-grid';
import { SearchTable } from '../components';
import useContacts from '../hooks/useContacts';
import { addFormatter, groupFormatter } from '../Shared/colorFormat';
import useGroups from '../hooks/useGroups';

export const getRowId = (row: any) => row._id;

const PopupGroupِAdd = ({
  open,
  onClose,
  theme,
  isRTL,
  words,
  addGtoContact,
  removeGfromContact,
  item,
}: any) => {
  const [columns] = useState([
    { name: 'add', title: isRTL ? 'مضاف' : 'Added' },
    { name: 'name', title: words.name },
    { name: 'phone', title: words.phoneNumber },
    { name: 'groupIds', title: isRTL ? 'المجموعات' : 'Groups' },
  ]);
  const { groups } = useGroups();

  const onFormClose = () => {
    onClose();
  };

  const { contacts } = useContacts();

  const title = isRTL ? 'اضافة/حذف جهات اتصال' : 'Add/Remove Contacts';
  return (
    <PopupLayout
      isRTL={isRTL}
      open={open}
      onClose={onFormClose}
      title={title}
      onSubmit={() => null}
      canceltitle={isRTL ? 'اغلاق' : 'Close'}
      onlyclose
      theme={theme}
      alrt={{}}
      maxWidth="lg"
    >
      <Box>
        <Box
          display="flex"
          style={{
            flex: 1,
            backgroundColor: '#fff',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            margin: 10,
          }}
        ></Box>

        <Paper style={{ height: 450, overflow: 'auto' }}>
          <Grid rows={contacts} columns={columns} getRowId={getRowId}>
            <SortingState />
            <SearchState />
            <EditingState onCommitChanges={() => null} />

            <IntegratedSorting />
            <IntegratedFiltering />
            <VirtualTable
              tableComponent={TableComponent}
              height={400}
              messages={{
                noData: isRTL ? 'لا يوجد بيانات' : 'no data',
              }}
              estimatedRowHeight={40}
            />
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
            <DataTypeProvider
              for={['groupIds']}
              formatterComponent={(props) =>
                groupFormatter(props, groups, isRTL)
              }
            ></DataTypeProvider>
            <DataTypeProvider
              for={['add']}
              formatterComponent={(props: any) =>
                addFormatter({
                  ...props,
                  addGtoContact,
                  removeGfromContact,
                  groupId: item._id,
                })
              }
            ></DataTypeProvider>
            <Toolbar />
            <SearchPanel
              inputComponent={(props: any) => {
                return <SearchTable isRTL={isRTL} {...props}></SearchTable>;
              }}
            />
          </Grid>
        </Paper>
      </Box>
    </PopupLayout>
  );
};
export default PopupGroupِAdd;
