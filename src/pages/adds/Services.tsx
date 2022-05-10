/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useState } from 'react';
import {
  EditingState,
  SortingState,
  IntegratedSorting,
  DataTypeProvider,
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
import { useServices } from '../../hooks';
import { getRowId } from '../../common';
import { PopupService } from '../../pubups';
import { currencyFormatter } from '../../Shared/colorFormat';
import { AlertLocal, SearchTable } from '../../components';
import { errorAlert, errorDeleteAlert } from '../../Shared/helpers';
import { Box, Button } from '@material-ui/core';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { TableComponent } from '../../Shared/TableComponent';
import ImportBtn from '../../common/ImportBtn';
import PopupServiceImport from '../../pubups/PopupServiceImport';

export default function Services({ isRTL, words, theme }: any) {
  const [openImport, setOpenImport] = useState(false);
  const [type, setType] = useState(2);
  const [loading, setLoading] = useState(false);
  const [alrt, setAlrt] = useState({ show: false, msg: '', type: undefined });
  const [columns] = useState([
    { name: isRTL ? 'nameAr' : 'name', title: words.name },
    { name: 'price', title: words.price },
    { name: 'desc', title: words.description },
    { name: 'unit', title: words.unit },
  ]);

  const {
    services,
    expenseitems,
    addService,
    addMultiServices,
    editService,
    removeService,
  } = useServices();

  const { height } = useWindowDimensions();
  const commitChanges = async ({ deleted }) => {
    if (deleted) {
      const _id = deleted[0];
      setLoading(true);

      const res = await removeService({ variables: { _id } });
      if (res?.data?.deleteItem?.ok === false) {
        if (res?.data?.deleteItem?.error.includes('related')) {
          await errorDeleteAlert(setAlrt, isRTL);
        } else {
          await errorAlert(setAlrt, isRTL);
        }
      }
      setLoading(false);
    }
  };
  return (
    <Box
      style={{
        height: height - 50,
        overflow: 'auto',
        backgroundColor: '#fff',
        marginLeft: 5,
        marginRight: 5,
      }}
    >
      {loading && <Loading isRTL={isRTL}></Loading>}
      <ImportBtn
        open={() => setOpenImport(true)}
        isRTL={isRTL}
        theme={theme}
      ></ImportBtn>
      <Box
        display="flex"
        style={{
          position: 'absolute',
          top: 57,
          width: '60%',
          zIndex: 111,
          marginLeft: 40,
          marginRight: 40,
        }}
      >
        <Button
          color="primary"
          variant={type === 2 ? 'contained' : 'outlined'}
          onClick={() => {
            setType(2);
          }}
          style={{ marginLeft: 15, marginRight: 15, padding: 5, minWidth: 150 }}
        >
          {isRTL ? 'بنود الايرادات' : 'Income Items'}
        </Button>
        <Button
          color="primary"
          variant={type === 10 ? 'contained' : 'outlined'}
          onClick={() => {
            setType(10);
          }}
          style={{ marginLeft: 15, marginRight: 15, padding: 5, minWidth: 150 }}
        >
          {isRTL ? 'بنود المصروفات' : 'Expenses Items'}
        </Button>
      </Box>

      <Grid
        rows={type === 2 ? services : expenseitems}
        columns={columns}
        getRowId={getRowId}
      >
        <SortingState />
        <EditingState onCommitChanges={commitChanges} />
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
          for={['price']}
          formatterComponent={currencyFormatter}
        ></DataTypeProvider>

        <TableEditColumn
          showEditCommand
          showDeleteCommand
          showAddCommand
          commandComponent={Command}
        ></TableEditColumn>
        <Toolbar />
        <SearchPanel
          inputComponent={(props: any) => {
            return <SearchTable isRTL={isRTL} {...props}></SearchTable>;
          }}
        />
        <PopupEditing
          theme={theme}
          addAction={addService}
          editAction={editService}
        >
          <PopupService type={type}></PopupService>
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
      <PopupServiceImport
        open={openImport}
        onClose={() => setOpenImport(false)}
        addMultiItems={addMultiServices}
        isRTL={isRTL}
        theme={theme}
        words={words}
      ></PopupServiceImport>
    </Box>
  );
}
