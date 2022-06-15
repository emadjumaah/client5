/* eslint-disable react/jsx-pascal-case */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Box, fade, Paper, Typography } from '@material-ui/core';

import PopupLayout from '../pages/main/PopupLayout';
import {
  Grid,
  TableHeaderRow,
  VirtualTable,
} from '@devexpress/dx-react-grid-material-ui';
import { TableComponent } from '../Shared/ItemsTable';
import { useLazyQuery, useMutation } from '@apollo/client';
import getGroupContacts from '../graphql/query/getGroupContacts';
import {
  addGroupToContact,
  getContacts,
  getGroups,
  removeGroupFromContact,
} from '../graphql';
import { IntegratedSorting, SortingState } from '@devexpress/dx-react-grid';

import PopupGroupِAdd from './PopupGroupِAdd';

export const getRowId = (row: any) => row._id;

const PopupSendreqView = ({
  open,
  onClose,
  theme,
  isRTL,
  words,
  item,
}: any) => {
  const [openAdd, setOpenAdd] = useState(false);

  const [columns] = useState([
    { name: isRTL ? 'nameAr' : 'name', title: words.name },
    { name: 'phone', title: words.mobile },
  ]);
  const [data, setData] = useState([]);

  const [loadConts, contsData]: any = useLazyQuery(getGroupContacts, {
    fetchPolicy: 'cache-and-network',
  });

  const refresQuery = {
    refetchQueries: [
      {
        query: getGroupContacts,
        variables: { groupId: item?._id, isRTL },
      },
      {
        query: getContacts,
      },
      {
        query: getGroups,
      },
    ],
  };

  const [addGtoContact] = useMutation(addGroupToContact, refresQuery);
  const [removeGfromContact] = useMutation(removeGroupFromContact, refresQuery);

  useEffect(() => {
    if (item?._id) {
      loadConts({
        variables: { groupId: item._id, isRTL },
      });
    }
  }, [item]);

  useEffect(() => {
    if (contsData?.data?.getGroupContacts?.data) {
      const { data } = contsData.data.getGroupContacts;
      setData(data);
    }
  }, [contsData]);

  const onFormClose = () => {
    setData([]);
    onClose();
  };

  const title = isRTL ? item?.nameAr : item?.name;
  return (
    <PopupLayout
      isRTL={isRTL}
      open={open}
      onClose={onFormClose}
      title={title}
      onSubmit={() => null}
      onlyclose
      theme={theme}
      alrt={{}}
      maxWidth="md"
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
        >
          <div
            onClick={() => setOpenAdd(true)}
            style={{
              borderRadius: 10,
              cursor: 'pointer',
              height: 30,
              paddingLeft: 10,
              paddingRight: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: fade(theme.palette.secondary.light, 0.3),
              textDecorationLine: 'none',
              fontSize: 14,
              color: theme.palette.primary.main,
              fontWeight: 'bold',
            }}
          >
            {isRTL ? 'اضافة/حذف جهات اتصال' : 'Add/Remove Contacts'}
          </div>
          {data?.length > 0 && (
            <div style={{ fontSize: 14, fontWeight: 'bold' }}>
              {`${words.qty} ( ${data.length} )`}
            </div>
          )}
        </Box>

        <Paper style={{ height: 400, overflow: 'auto' }}>
          <Grid rows={data} columns={columns} getRowId={getRowId}>
            <SortingState />
            <IntegratedSorting />
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
          </Grid>
        </Paper>
        <PopupGroupِAdd
          open={openAdd}
          onClose={() => setOpenAdd(false)}
          isRTL={isRTL}
          theme={theme}
          words={words}
          addGtoContact={addGtoContact}
          removeGfromContact={removeGfromContact}
          item={item}
        ></PopupGroupِAdd>
      </Box>
    </PopupLayout>
  );
};
export default PopupSendreqView;
