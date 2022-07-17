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
import { getRowId } from '../../common';
import { PopupEmployee } from '../../pubups';
import {
  avatarColorFormatter,
  nameManageEmployeeRest,
  nameManageLinkEmployee,
} from '../../Shared/colorFormat';
import { AlertLocal, SearchTable } from '../../components';
import { errorAlert, errorDeleteAlert } from '../../Shared/helpers';
import PageLayout from '../main/PageLayout';
import { getColumns } from '../../common/columns';
import PopupEmployeeView from '../../pubups/PopupEmployeeView';
import useEmployees from '../../hooks/useEmployees';
import { Box, Paper, Typography } from '@material-ui/core';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { TableComponent } from '../../Shared/TableComponent';
import { roles } from '../../common';
import { EmployeeContext } from '../../contexts/managment';
import { useLazyQuery } from '@apollo/client';
import { getEmployees } from '../../graphql';
import AutoFieldLocal from '../../components/fields/AutoFieldLocal';
import useRetypes from '../../hooks/useRetypes';

export default function ManageEmployees({
  isRTL,
  words,
  theme,
  menuitem,
  company,
}: any) {
  const [alrt, setAlrt] = useState({ show: false, msg: '', type: undefined });
  const [pageSizes] = useState([5, 8, 10, 20, 50, 0]);
  const [rows, setRows] = useState([]);
  const [rtypvalue, setRtypvalue] = useState<any>(null);

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
  } = useContext(EmployeeContext);
  const setHiddenColumnNames = (hiddenColumns: any) => {
    dispatch({ type: 'setHiddenColumnNames', payload: hiddenColumns });
  };

  const [columns] = useState([
    { name: 'avatar', title: ' ' },
    col.name,
    col.data,
    { name: 'email', title: words.email },
    { name: 'info', title: words.info },
    { name: 'phone', title: words.phoneNumber },
    col.retype,
  ]);

  const [tableColumnExtensions]: any = useState([
    { columnName: 'avatar', width: 30 },
    { columnName: col.name.name, width: 300 },
    { columnName: col.data.name, width: 300 },
    { columnName: 'email', width: 200 },
    { columnName: 'info', width: 200 },
    { columnName: 'phone', width: 100 },
    { columnName: col.retype.name, width: 150 },
  ]);

  const [columnsViewer] = useState([
    { name: isRTL ? 'nameAr' : 'name', title: words.name },
    { name: 'avatar', title: words.color },
  ]);

  const { addEmployee, editEmployee, removeEmployee, refreshemployee } =
    useEmployees();

  const [getemps, empData]: any = useLazyQuery(getEmployees, {
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    getemps({});
  }, [rtypvalue]);

  useEffect(() => {
    if (empData?.data?.getEmployees?.data) {
      const { data } = empData.data.getEmployees;
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

      const res = await removeEmployee({ variables: { _id } });
      if (res?.data?.deleteEmployee?.ok === false) {
        if (res?.data?.deleteEmployee?.error.includes('related')) {
          await errorDeleteAlert(setAlrt, isRTL);
        } else {
          await errorAlert(setAlrt, isRTL);
        }
      }
    }
  };
  const bgcolor = '#E9F8FEaa';
  return (
    <PageLayout
      menuitem={menuitem}
      isRTL={isRTL}
      words={words}
      theme={theme}
      refresh={refreshemployee}
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
            title={words?.retype}
            words={words}
            options={retypes.filter((d: any) => d.reType === 1)}
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
                'email',
                'info',
                'phone',
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
                  nameManageLinkEmployee({
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
                formatterComponent={(props: any) =>
                  nameManageEmployeeRest({
                    ...props,
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
              addAction={addEmployee}
              editAction={editEmployee}
            >
              <PopupEmployee></PopupEmployee>
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
        <PopupEmployeeView
          open={openItem}
          onClose={onCloseItem}
          row={item}
          theme={theme}
          company={company}
        ></PopupEmployeeView>
      </Box>
    </PageLayout>
  );
}
