/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useEffect, useState } from 'react';
import {
  EditingState,
  SortingState,
  IntegratedSorting,
  SearchState,
  IntegratedFiltering,
  IntegratedPaging,
  PagingState,
  DataTypeProvider,
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
import { AlertLocal, SearchTable } from '../../components';
import { errorDeleteAlert } from '../../Shared/helpers';
import PageLayout from '../main/PageLayout';
import { getColumns } from '../../common/columns';
import useDepartmentsUp from '../../hooks/useDepartmentsUp';
import { Box, Paper, Typography } from '@material-ui/core';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { TableComponent } from '../../Shared/TableComponent';
import { roles } from '../../common';
import { getDepartments } from '../../graphql';
import { useLazyQuery } from '@apollo/client';
import FilterSelectSingle from '../../Shared/FilterSelectSingle';
import { departmentTypes } from '../../constants/datatypes';
import PopupResourseType from '../../pubups/PopupResourseType';
import { departmentTypeFormat } from '../../Shared/colorFormat';

export default function ResourseTypes({ isRTL, words, theme, menuitem }: any) {
  const [pageSizes] = useState([5, 6, 10, 20, 50, 0]);
  const [rows, setRows] = useState([]);
  const [depart, setDepart] = useState(null);

  const [alrt, setAlrt] = useState({ show: false, msg: '', type: undefined });
  const col = getColumns({ isRTL, words });

  const { width, height } = useWindowDimensions();

  const [columns] = useState([
    { name: 'avatar', title: ' ' },
    { name: isRTL ? 'nameAr' : 'name', title: words.name },
    { name: 'depType', title: words.type },
  ]);

  const [tableColumnExtensions]: any = useState([
    { columnName: 'avatar', width: 30 },
    { columnName: col.name.name, width: 250 },
    { columnName: 'depType', width: 250 },
  ]);

  const [tableColumnVisibilityColumnExtensions] = useState([
    { columnName: col.name.name, togglingEnabled: false },
  ]);
  const [columnsViewer] = useState([
    { name: isRTL ? 'nameAr' : 'name', title: words.name },
    { name: 'avatar', title: words.color },
  ]);

  const { addDepartment, editDepartment, removeDepartment, refreshdepartment } =
    useDepartmentsUp();

  const [getdepts, deptData]: any = useLazyQuery(getDepartments, {
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    getdepts({ variables: { isRTL, depType: depart ? depart.id : undefined } });
  }, [depart]);

  useEffect(() => {
    if (deptData?.data?.getDepartments?.data) {
      const { data } = deptData.data.getDepartments;
      const rdata = data.filter((d: any) => d.depType !== 1);
      setRows(rdata);
    }
  }, [deptData]);

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

  // const bgcolor = '#EFFAF1aa';
  const bgcolor = '#EFFAF100';

  return (
    <PageLayout
      menuitem={menuitem}
      isRTL={isRTL}
      words={words}
      theme={theme}
      refresh={refreshdepartment}
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
          }}
        >
          <FilterSelectSingle
            options={departmentTypes.filter((d: any) => d.id !== 1)}
            value={depart}
            setValue={setDepart}
            words={words}
            isRTL={isRTL}
            name="depType"
            width={220}
          ></FilterSelectSingle>
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
                <Table.Row {...props} style={{ height: 68 }}></Table.Row>
              )}
              columnExtensions={tableColumnExtensions}
            />
            <TableColumnReordering
              defaultOrder={['avatar', col.name.name, 'depType']}
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
              for={['depType']}
              formatterComponent={(props: any) =>
                departmentTypeFormat({ ...props, isRTL })
              }
            ></DataTypeProvider>
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
              <PopupResourseType></PopupResourseType>
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
      </Box>
    </PageLayout>
  );
}
