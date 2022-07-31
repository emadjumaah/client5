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
  IntegratedPaging,
  PagingState,
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
import { Command, errorAlert, PopupEditing } from '../../Shared';
import { getRowId } from '../../common';
import { PopupDeprtment } from '../../pubups';
import {
  avatarColorFormatter,
  nameManageLinkSimple,
} from '../../Shared/colorFormat';
import { AlertLocal, SearchTable } from '../../components';
import { errorDeleteAlert } from '../../Shared/helpers';
import PageLayout from '../main/PageLayout';
import { getColumns } from '../../common/columns';
import PopupDepartmentView from '../../pubups/PopupDepartmentView';
import useDepartments from '../../hooks/useDepartments';
import { Box, Paper, Typography } from '@material-ui/core';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { TableComponent } from '../../Shared/TableComponent';
import { roles } from '../../common';
import { DepartmentContext } from '../../contexts/managment';
import { getDepartments } from '../../graphql';
import { useLazyQuery } from '@apollo/client';
import AutoFieldLocal from '../../components/fields/AutoFieldLocal';
import useRetypes from '../../hooks/useRetypes';
// import FilterSelectSingle from '../../Shared/FilterSelectSingle';
// import { departmentTypes } from '../../constants/datatypes';

export default function ManageDepartments({
  isRTL,
  words,
  theme,
  menuitem,
  company,
}: any) {
  const [pageSizes] = useState([5, 8, 10, 20, 50, 0]);
  const [rows, setRows] = useState([]);
  const [rtypvalue, setRtypvalue] = useState<any>(null);

  const [alrt, setAlrt] = useState({ show: false, msg: '', type: undefined });
  const [item, setItem] = useState(null);
  const [openItem, setOpenItem] = useState(false);
  const col = getColumns({ isRTL, words });
  const { retypes } = useRetypes();

  const { width, height } = useWindowDimensions();
  const onCloseItem = () => {
    setOpenItem(false);
    setItem(null);
  };

  const {
    state: { hiddenColumnNames },
    dispatch,
  } = useContext(DepartmentContext);
  const setHiddenColumnNames = (hiddenColumns: any) => {
    dispatch({ type: 'setHiddenColumnNames', payload: hiddenColumns });
  };

  const [columns] = useState([
    { name: 'avatar', title: ' ' },
    col.name,
    col.desc,
    col.retype,
  ]);

  const [tableColumnExtensions]: any = useState([
    { columnName: 'avatar', width: 30 },
    { columnName: col.name.name, width: 300 },
    { columnName: col.desc.name, width: 350 },
    { columnName: col.retype.name, width: 150 },
  ]);

  const [columnsViewer] = useState([
    { name: isRTL ? 'nameAr' : 'name', title: words.name },
    { name: 'avatar', title: words.color },
  ]);

  const { addDepartment, editDepartment, removeDepartment, refreshdepartment } =
    useDepartments();

  const [getdepts, deptData]: any = useLazyQuery(getDepartments, {
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    getdepts({ variables: { isRTL, depType: 1 } });
  }, []);

  useEffect(() => {
    if (deptData?.data?.getDepartments?.data) {
      const { data } = deptData.data.getDepartments;
      if (rtypvalue) {
        const fdata = data.filter((da: any) => da.retypeId === rtypvalue._id);
        setRows(fdata);
      } else {
        setRows(data);
      }
    }
  }, [deptData, rtypvalue]);

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
      const res = await removeDepartment({ variables: { _id } });
      if (res?.data?.deleteDepartment?.ok === false) {
        if (res?.data?.deleteDepartment?.error.includes('related')) {
          await errorDeleteAlert(setAlrt, isRTL);
        } else {
          await errorAlert(setAlrt, isRTL);
        }
      }
    }
  };

  const bgcolor = '#EFFAF100';

  return (
    <PageLayout
      menuitem={menuitem}
      isRTL={isRTL}
      words={words}
      theme={theme}
      refresh={refreshdepartment}
      bgcolor={bgcolor}
      loading={deptData?.loading}
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
            title={words?.retype}
            words={words}
            options={retypes.filter((d: any) => d.reType === 3)}
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
                col.desc.name,
                col.retype.name,
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
                avatarColorFormatter({ ...props, height: 70 })
              }
            ></DataTypeProvider>
            {roles.isEditor() && (
              <DataTypeProvider
                for={[col.name.name]}
                formatterComponent={(props: any) =>
                  nameManageLinkSimple({
                    ...props,
                    setItem,
                    setOpenItem,
                    isRTL,
                  })
                }
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
              addAction={addDepartment}
              editAction={editDepartment}
            >
              <PopupDeprtment></PopupDeprtment>
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
        <PopupDepartmentView
          open={openItem}
          onClose={onCloseItem}
          row={item}
          theme={theme}
          company={company}
        ></PopupDepartmentView>
      </Box>
    </PageLayout>
  );
}
