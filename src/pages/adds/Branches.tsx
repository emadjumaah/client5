/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import {
  DataTypeProvider,
  EditingState,
  IntegratedFiltering,
  IntegratedSorting,
  SearchState,
  SortingState,
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
import PopupBranch from '../../pubups/PopupBranch';
import { useBranches } from '../../hooks';
import {
  createdAtFormatter,
  currencyFormatter,
  logoFormatter,
  reqpackFormatter,
  templateFormatter,
} from '../../Shared/colorFormat';
import { SearchTable } from '../../components';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { Typography } from '@material-ui/core';

export const getRowId = (row: { _id: any }) => row._id;

export default function Branches({ isRTL, theme, words }: any) {
  const branchCol = [
    { name: 'logo', title: ' ' },
    { name: isRTL ? 'nameAr' : 'name', title: words.name },
    { name: 'template', title: words.template },
    { name: 'tel1', title: words.phoneNumber },
    { name: 'email', title: words.email },
  ];

  const [columns] = useState(branchCol);
  const { height } = useWindowDimensions();

  const commitChanges = async () => {
    //
  };

  const { branches, addBranch, editBranch } = useBranches();
  return (
    <Paper>
      <Grid rows={branches} columns={columns} getRowId={getRowId}>
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
          estimatedRowHeight={70}
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
          for={['packCost']}
          formatterComponent={currencyFormatter}
        ></DataTypeProvider>
        <DataTypeProvider
          for={['reqpack']}
          formatterComponent={reqpackFormatter}
        ></DataTypeProvider>
        <DataTypeProvider
          for={['logo']}
          formatterComponent={logoFormatter}
        ></DataTypeProvider>
        <DataTypeProvider
          for={['template']}
          formatterComponent={templateFormatter}
        ></DataTypeProvider>
        <DataTypeProvider
          for={['packStart', 'packEnd']}
          formatterComponent={createdAtFormatter}
        ></DataTypeProvider>

        <TableEditColumn
          showAddCommand
          showEditCommand
          commandComponent={Command}
        ></TableEditColumn>
        <Toolbar />
        <SearchPanel
          inputComponent={(props: any) => {
            return <SearchTable isRTL={isRTL} {...props}></SearchTable>;
          }}
        />
        <PopupEditing addAction={addBranch} editAction={editBranch}>
          <PopupBranch
            isRTL={isRTL}
            theme={theme}
            words={words}
            branches={branches}
          ></PopupBranch>
        </PopupEditing>
      </Grid>
    </Paper>
  );
}
