/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useState } from 'react';
import Paper from '@material-ui/core/Paper';
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
import { Command, PopupEditing } from '../../Shared';
import { getRowId } from '../../common';
import { PopupEmployee } from '../../pubups';
import {
  avatarPatternFormatter,
  colorFormatter,
  daysoffFormatter,
} from '../../Shared/colorFormat';
import { AlertLocal, SearchTable } from '../../components';
import { errorAlert, errorDeleteAlert } from '../../Shared/helpers';
import PageLayout from '../main/PageLayout';
import { getColumns } from '../../common/columns';
import useEmployees from '../../hooks/useEmployees';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { Typography } from '@material-ui/core';

export default function Employees({ isRTL, words, theme, menuitem }: any) {
  const col = getColumns({ isRTL, words });

  const [loading, setLoading] = useState(false);
  const [alrt, setAlrt] = useState({ show: false, msg: '', type: undefined });

  const [columns] = useState([
    { name: isRTL ? 'nameAr' : 'name', title: words.name },
    { name: 'avatar', title: words.color },
    { name: 'phone', title: words.phoneNumber },
    { name: 'email', title: words.email },
    col.department,
    { name: 'info', title: words.info },
    { name: 'daysoff', title: isRTL ? 'يوم العطلة' : 'Day Off' },
  ]);

  const {
    employees,
    addEmployee,
    editEmployee,
    removeEmployee,
    refreshemployee,
  } = useEmployees();
  const { height } = useWindowDimensions();
  const commitChanges = async ({ deleted }) => {
    if (deleted) {
      const _id = deleted[0];
      setLoading(true);

      const res = await removeEmployee({ variables: { _id } });
      if (res?.data?.deleteEmployee?.ok === false) {
        if (res?.data?.deleteEmployee?.error.includes('related')) {
          await errorDeleteAlert(setAlrt, isRTL);
        } else {
          await errorAlert(setAlrt, isRTL);
        }
      }
      setLoading(false);
    }
  };
  return (
    <PageLayout
      menuitem={menuitem}
      isRTL={isRTL}
      words={words}
      theme={theme}
      refresh={refreshemployee}
      loading={loading}
    >
      <Paper>
        <Grid rows={employees} columns={columns} getRowId={getRowId}>
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
            for={['avatar']}
            formatterComponent={avatarPatternFormatter}
          ></DataTypeProvider>
          <DataTypeProvider
            for={['color']}
            formatterComponent={colorFormatter}
          ></DataTypeProvider>
          <DataTypeProvider
            for={['daysoff']}
            formatterComponent={(props: any) =>
              daysoffFormatter({ ...props, isRTL })
            }
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
            addAction={addEmployee}
            editAction={editEmployee}
          >
            <PopupEmployee></PopupEmployee>
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
      </Paper>
    </PageLayout>
  );
}
