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
  appointmentsFormatter,
  avataManageFormatter,
  expensesFormatter,
  kaidsFormatter,
  nameManageLinkFormat,
  salesFormatter,
} from '../../Shared/colorFormat';
import { AlertLocal, SearchTable } from '../../components';
import { errorAlert, errorDeleteAlert } from '../../Shared/helpers';
import PageLayout from '../main/PageLayout';
import { getColumns } from '../../common/columns';
import PopupResoursesView from '../../pubups/PopupResoursesView';
import PopupResourses from '../../pubups/PopupResourses';
import useResoursesUp from '../../hooks/useResoursesUp';
import { Box, Paper, Typography } from '@material-ui/core';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { TableComponent } from '../../Shared/TableComponent';
import { ResourseContext } from '../../contexts/managment';
import { useLazyQuery } from '@apollo/client';
import { getResourses } from '../../graphql';

export default function ManageResourses({
  isRTL,
  words,
  theme,
  menuitem,
  company,
}: any) {
  const [alrt, setAlrt] = useState({ show: false, msg: '', type: undefined });
  const [pageSizes] = useState([5, 10, 20, 50, 0]);
  const [rows, setRows] = useState([]);
  const [item, setItem] = useState(null);
  const [openItem, setOpenItem] = useState(false);
  const col = getColumns({ isRTL, words });

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
  const [columns] = useState([
    { name: 'avatar', title: ' ' },
    col.name,
    col.appointments,
    col.sales,
    col.expenses,
    col.kaids,
    { name: 'plate', title: words.plate },
    col.carstatus,
    col.department,
    { name: 'info', title: words.info },
  ]);

  const [tableColumnExtensions]: any = useState([
    { columnName: 'avatar', width: 30 },
    { columnName: col.name.name, width: 250 },
    { columnName: col.appointments.name, width: 250, align: 'center' },
    { columnName: col.sales.name, width: 240 },
    { columnName: col.expenses.name, width: 220 },
    { columnName: col.kaids.name, width: 220 },
    { columnName: 'plate', width: 100 },
    { columnName: col.carstatus.name, width: 100 },
    { columnName: col.department.name, width: 150 },
    { columnName: 'info', width: 250 },
  ]);

  const [columnsViewer] = useState([
    { name: isRTL ? 'nameAr' : 'name', title: words.name },
    { name: 'avatar', title: words.color },
  ]);
  const { width, height } = useWindowDimensions();

  const { addResourse, editResourse, removeResourse, refreshresourse } =
    useResoursesUp();
  const [getemps, empData]: any = useLazyQuery(getResourses, {
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    getemps({ isRTL, resType: 1 });
  }, []);

  useEffect(() => {
    if (empData?.data?.getResourses?.data) {
      const { data } = empData.data.getResourses;
      setRows(data);
    }
  }, [empData]);

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
            <PagingState defaultCurrentPage={0} defaultPageSize={6} />

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
                <Table.Row {...props} style={{ height: 120 }}></Table.Row>
              )}
              columnExtensions={tableColumnExtensions}
            />
            <TableColumnReordering
              defaultOrder={[
                'avatar',
                col.name.name,
                col.appointments.name,
                col.sales.name,
                col.expenses.name,
                col.kaids.name,
                'plate',
                col.carstatus.name,
                col.department.name,
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
                avataManageFormatter({
                  ...props,
                  setItem,
                  setOpenItem,
                  isRTL,
                })
              }
            ></DataTypeProvider>
            {roles.isEditor() && (
              <DataTypeProvider
                for={[col.name.name]}
                formatterComponent={(props: any) =>
                  nameManageLinkFormat({
                    ...props,
                    setItem,
                    setOpenItem,
                    isRTL,
                  })
                }
              ></DataTypeProvider>
            )}

            <DataTypeProvider
              for={[col.appointments.name]}
              formatterComponent={(props: any) =>
                appointmentsFormatter({ ...props, theme, isRTL })
              }
            ></DataTypeProvider>
            <DataTypeProvider
              for={[col.sales.name]}
              formatterComponent={(props: any) =>
                salesFormatter({ ...props, theme, isRTL })
              }
            ></DataTypeProvider>
            <DataTypeProvider
              for={[col.expenses.name]}
              formatterComponent={(props: any) =>
                expensesFormatter({ ...props, theme, isRTL })
              }
            ></DataTypeProvider>
            <DataTypeProvider
              for={[col.kaids.name]}
              formatterComponent={(props: any) =>
                kaidsFormatter({ ...props, theme, isRTL })
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
              addAction={addResourse}
              editAction={editResourse}
            >
              <PopupResourses resKind={2} resType={1}></PopupResourses>
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
