/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useContext, useEffect, useState } from 'react';
import {
  EditingState,
  SortingState,
  IntegratedSorting,
  DataTypeProvider,
  SearchState,
  IntegratedFiltering,
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
import { getRowId, roles } from '../../common';
import {
  avatarColorFormatter,
  nameManageLinkSimpleRes,
  nameResourseRest,
} from '../../Shared/colorFormat';
import { AlertLocal, SearchTable } from '../../components';
import { errorAlert, errorDeleteAlert } from '../../Shared/helpers';
import PageLayout from '../main/PageLayout';
import { getColumns } from '../../common/columns';
import PopupResoursesView from '../../pubups/PopupResoursesView';
import PopupResourses from '../../pubups/PopupResourses';
import useResourses from '../../hooks/useResourses';
import { Box, Paper, Typography } from '@material-ui/core';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { TableComponent } from '../../Shared/TableComponent';
import { ResourseContext } from '../../contexts/managment';
import { useLazyQuery } from '@apollo/client';
import { getResourses } from '../../graphql';
import AutoFieldLocal from '../../components/fields/AutoFieldLocal';
import useRetypes from '../../hooks/useRetypes';

export default function ManageResourses({
  isRTL,
  words,
  theme,
  menuitem,
  company,
  tempId,
}: any) {
  const [alrt, setAlrt] = useState({ show: false, msg: '', type: undefined });
  const [pageSizes] = useState([5, 8, 10, 20, 50, 0]);
  const [rows, setRows] = useState([]);
  const [rtypvalue, setRtypvalue] = useState<any>(null);

  const [item, setItem] = useState(null);
  const [openItem, setOpenItem] = useState(false);
  const col = getColumns({ isRTL, words });

  const { retypes } = useRetypes();

  const onCloseItem = () => {
    setOpenItem(false);
    setItem(null);
  };

  const {
    state: { hiddenColumnNames },
    dispatch,
  } = useContext(ResourseContext);
  const setHiddenColumnNames = (hiddenColumns: any) => {
    dispatch({ type: 'setHiddenColumnNames', payload: hiddenColumns });
  };

  const isCar = tempId === 9 || tempId === 4;

  const [columns] = useState(
    isCar
      ? [
          { name: 'avatar', title: ' ' },
          col.name,
          col.data,
          { name: 'plate', title: words.plate },
          { name: 'brand', title: words.brand },
          { name: 'model', title: words.model },
          col.licenseDate,
          { name: 'info', title: words.info },
          { name: 'purtime', title: words.purtime },
          { name: 'cost', title: words.cost },
          { name: 'insurance', title: words.insurance },
          col.carstatus,
          col.retype,
        ]
      : [
          { name: 'avatar', title: ' ' },
          col.name,
          col.data,
          { name: 'info', title: words.info },
          { name: 'plate', title: words.plate },
          col.carstatus,
          col.retype,
        ]
  );

  const [tableColumnExtensions]: any = useState([
    { columnName: 'avatar', width: 30 },
    { columnName: col.name.name, width: 300 },
    { columnName: col.data.name, width: 300 },
    { columnName: 'plate', width: 100 },
    { columnName: 'brand', width: 100 },
    { columnName: 'model', width: 100 },
    { columnName: col.licenseDate.name, width: 150 },
    { columnName: 'info', width: 250 },
    { columnName: 'purtime', width: 100 },
    { columnName: 'cost', width: 100 },
    { columnName: 'insurance', width: 100 },
    { columnName: col.carstatus.name, width: 100 },
    { columnName: col.retype.name, width: 150 },
  ]);

  const [columnsViewer] = useState([
    { name: isRTL ? 'nameAr' : 'name', title: words.name },
    { name: 'avatar', title: words.color },
  ]);
  const { width, height } = useWindowDimensions();

  const { addResourse, editResourse, removeResourse, refreshresourse } =
    useResourses();
  const [getemps, empData]: any = useLazyQuery(getResourses, {
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    getemps({});
  }, [rtypvalue]);

  useEffect(() => {
    if (empData?.data?.getResourses?.data) {
      const { data } = empData.data.getResourses;
      if (rtypvalue) {
        const fdata = data.filter((da: any) => da.retypeId === rtypvalue._id);
        setRows(fdata);
      } else {
        setRows(data);
      }
    }
  }, [empData, rtypvalue]);

  useEffect(() => {
    if (openItem) {
      if (rows && rows.length > 0) {
        const opened = rows.filter((ts: any) => ts._id === item._id)?.[0];
        setItem(opened);
      }
    }
  }, [rows]);
  const commitChanges = async ({ deleted }) => {
    if (deleted) {
      const _id = deleted[0];

      const res = await removeResourse({ variables: { _id } });
      if (res?.data?.deleteResourse?.ok === false) {
        if (res?.data?.deleteResourse?.error.includes('related')) {
          await errorDeleteAlert(setAlrt, isRTL);
        } else {
          await errorAlert(setAlrt, isRTL);
        }
      }
    }
  };
  const bgcolor = '#EFEBE988';

  return (
    <PageLayout
      menuitem={menuitem}
      isRTL={isRTL}
      words={words}
      theme={theme}
      refresh={refreshresourse}
      bgcolor={bgcolor}
    >
      <Box
        style={{
          height: height - 50,
          overflow: 'auto',
          backgroundColor: bgcolor,
        }}
      >
        <Box
          display="flex"
          style={{
            position: 'absolute',
            zIndex: 111,
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 7,
            left: isRTL ? undefined : 470,
            right: isRTL ? 470 : undefined,
            width: 220,
          }}
        >
          <AutoFieldLocal
            name="retype"
            title={words?.type}
            words={words}
            options={retypes.filter((d: any) => d.reType === 2)}
            value={rtypvalue}
            setSelectValue={setRtypvalue}
            isRTL={isRTL}
            fullWidth
            mb={0}
          ></AutoFieldLocal>
        </Box>
        <Paper
          elevation={5}
          style={{
            marginTop: 10,
            marginLeft: 40,
            marginRight: 40,
            marginBottom: 20,
            overflow: 'auto',
            width: width - 320,
            borderRadius: 10,
          }}
        >
          <Grid
            rows={rows}
            columns={roles.isEditor() ? columns : columnsViewer}
            getRowId={getRowId}
          >
            <SortingState />
            <EditingState onCommitChanges={commitChanges} />
            <SearchState />
            <PagingState defaultCurrentPage={0} defaultPageSize={8} />

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
                <Table.Row {...props} style={{ height: 80 }}></Table.Row>
              )}
              columnExtensions={tableColumnExtensions}
            />
            <TableColumnReordering
              defaultOrder={[
                'avatar',
                col.name.name,
                col.data.name,
                'plate',
                'brand',
                'model',
                col.licenseDate.name,
                'purtime',
                'cost',
                'insurance',
                col.carstatus.name,
                col.retype.name,
                'info',
              ]}
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
              defaultHiddenColumnNames={hiddenColumnNames}
              hiddenColumnNames={hiddenColumnNames}
              onHiddenColumnNamesChange={setHiddenColumnNames}
            />
            <DataTypeProvider
              for={['avatar']}
              formatterComponent={(props: any) =>
                avatarColorFormatter({
                  ...props,
                  height: 70,
                })
              }
            ></DataTypeProvider>
            {roles.isEditor() && (
              <DataTypeProvider
                for={[col.name.name]}
                formatterComponent={(props: any) =>
                  nameManageLinkSimpleRes({
                    ...props,
                    setItem,
                    setOpenItem,
                    isRTL,
                  })
                }
              ></DataTypeProvider>
            )}
            {roles.isEditor() && (
              <DataTypeProvider
                for={[col.data.name]}
                formatterComponent={nameResourseRest}
              ></DataTypeProvider>
            )}

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
              addAction={addResourse}
              editAction={editResourse}
            >
              <PopupResourses></PopupResourses>
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
        <PopupResoursesView
          open={openItem}
          onClose={onCloseItem}
          row={item}
          theme={theme}
          company={company}
        ></PopupResoursesView>
      </Box>
    </PageLayout>
  );
}
