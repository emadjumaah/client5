/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useState } from 'react';
import {
  EditingState,
  DataTypeProvider,
  SortingState,
  IntegratedSorting,
  IntegratedFiltering,
  SearchState,
} from '@devexpress/dx-react-grid';
import {
  Grid,
  TableHeaderRow,
  TableEditColumn,
  VirtualTable,
  Toolbar,
  SearchPanel,
} from '@devexpress/dx-react-grid-material-ui';
import { PopupEditing, Command, errorAlert, Loading } from '../../Shared';
import { PopupAccount } from '../../pubups';
import useAccounts from '../../hooks/useAccounts';
import { useBranches, useEmployees } from '../../hooks';
import { AlertLocal, SearchTable } from '../../components';
import { errorAccountAlert, errorDeleteAlert } from '../../Shared/helpers';
import { Box, Typography } from '@material-ui/core';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { TableComponent } from '../../Shared/TableComponent';
import { useMutation } from '@apollo/client';
import { getAccounts, getEmployees } from '../../graphql';
import { createNewEmployeeAccount } from '../../graphql/mutation';

export const getRowId = (row: { _id: any }) => row._id;

export default function Accounts({ isRTL, accounts }: any) {
  const [loading, setLoading] = useState(false);
  const [alrt, setAlrt] = useState({ show: false, msg: '', type: undefined });
  const { height } = useWindowDimensions();
  const [columns] = useState([
    { name: isRTL ? 'nameAr' : 'name', title: isRTL ? 'اسم الحساب' : 'Name' },
    { name: 'code', title: isRTL ? 'رقم الحساب' : 'Code' },
    {
      name: isRTL ? 'parentAr' : 'parent',
      title: isRTL ? 'الحساب الرئيسي' : 'Main Account',
    },
    {
      name: isRTL ? 'employeeNameAr' : 'employeeName',
      title: isRTL ? 'الموظف' : 'Employee',
    },
  ]);
  const { addAccount, editAccount, removeAccount } = useAccounts();
  const { branches } = useBranches();
  const { employees } = useEmployees();

  const [addNewEmployeeAccount] = useMutation(createNewEmployeeAccount, {
    refetchQueries: [{ query: getAccounts }, { query: getEmployees }],
  });

  const commitChanges = async ({ deleted }) => {
    if (deleted) {
      const _id = deleted[0];
      setLoading(true);
      const account = accounts.filter((acc: any) => acc._id === _id)?.[0];
      if (account && account?.canedit) {
        const res = await removeAccount({ variables: { _id } });
        if (res?.data?.deleteAccount?.ok === false) {
          if (res?.data?.deleteAccount?.error.includes('related')) {
            await errorDeleteAlert(setAlrt, isRTL);
          } else {
            await errorAlert(setAlrt, isRTL);
          }
        }
      } else {
        await errorAccountAlert(setAlrt, isRTL);
      }
      setLoading(false);
    }
  };

  const branchFormatter = ({ value }) => {
    const branch = branches.filter((br: any) => br.basename === value)[0];
    const name = isRTL ? 'nameAr' : 'name';
    return <div>{branch ? branch[name] : ''}</div>;
  };

  const emplusers = accounts.filter((fu: any) => fu?.employeeId);
  const emplIds = emplusers.map((eu: any) => eu?.employeeId);
  const emplnoaccount =
    emplIds && emplIds?.length > 0
      ? employees?.filter((emp: any) => !emplIds.includes(emp?._id))
      : employees;

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
      <Grid rows={accounts} columns={columns} getRowId={getRowId}>
        <SortingState
          defaultSorting={[
            { columnName: 'branch', direction: 'asc' },
            { columnName: 'code', direction: 'asc' },
          ]}
        />
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
          tableComponent={TableComponent}
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
          for={['branch']}
          formatterComponent={branchFormatter}
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

        <PopupEditing addAction={addAccount} editAction={editAccount}>
          <PopupAccount
            accounts={accounts}
            emplnoaccount={emplnoaccount}
            addNewEmployeeAccount={addNewEmployeeAccount}
          ></PopupAccount>
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
    </Box>
  );
}
