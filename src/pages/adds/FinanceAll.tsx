/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useContext, useEffect, useState } from "react";
import Paper from "@material-ui/core/Paper";
import {
  EditingState,
  SortingState,
  IntegratedSorting,
  DataTypeProvider,
  SearchState,
  IntegratedFiltering,
} from "@devexpress/dx-react-grid";
import {
  Grid,
  TableHeaderRow,
  TableEditColumn,
  VirtualTable,
  SearchPanel,
  Toolbar,
} from "@devexpress/dx-react-grid-material-ui";
import { Command, Loading, PopupEditing } from "../../Shared";
import { getRowId } from "../../common";
import { useLazyQuery, useMutation } from "@apollo/client";
import {
  createGeneralFinance,
  deleteGeneralFinance,
  getCustomers,
  getDepartments,
  getEmployees,
  getGeneralFinances,
  getLandingChartData,
  getLastNos,
  updateGeneralFinance,
} from "../../graphql";
import {
  accountFormatter,
  currencyFormatter,
  customerAccountFormatter,
  opTypeFormatter,
  samllFormatter,
  timeFormatter,
} from "../../Shared/colorFormat";
import useAccounts from "../../hooks/useAccounts";
import PageLayout from "../main/PageLayout";
import { SearchTable } from "../../components";
import { FinanceContext } from "../../contexts";
import DateNavigatorReports from "../../components/filters/DateNavigatorReports";
import PopupFinanceAll from "../../pubups/PopupFinanceAll";
import getTasks from "../../graphql/query/getTasks";

export default function FinanceAll({
  isRTL,
  words,
  menuitem,
  isEditor,
  theme,
}) {
  const [columns] = useState([
    { name: "time", title: words.time },
    { name: "docNo", title: words.no },
    { name: "desc", title: words.description },
    { name: "opType", title: words.type },
    { name: "amount", title: words.amount },
  ]);

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const [start, setStart] = useState<any>(null);
  const [end, setEnd] = useState<any>(null);

  const {
    state: { currentDate, currentViewName, endDate, sort },
    dispatch,
  } = useContext(FinanceContext);

  const currentViewNameChange = (e: any) => {
    dispatch({ type: "setCurrentViewName", payload: e.target.value });
  };
  const currentDateChange = (curDate: any) => {
    dispatch({ type: "setCurrentDate", payload: curDate });
  };

  const endDateChange = (curDate: any) => {
    dispatch({ type: "setEndDate", payload: curDate });
  };

  const [loadFinances, financeData]: any = useLazyQuery(getGeneralFinances, {
    fetchPolicy: "cache-and-network",
  });
  const { accounts } = useAccounts();
  const refresQuery = {
    refetchQueries: [
      {
        query: getGeneralFinances,
        variables: {
          start: start ? start.setHours(0, 0, 0, 0) : undefined,
          end: end ? end.setHours(23, 59, 59, 999) : undefined,
        },
      },
      {
        query: getLandingChartData,
      },
      {
        query: getLastNos,
      },
      {
        query: getTasks,
      },
      {
        query: getCustomers,
      },
      {
        query: getEmployees,
      },
      {
        query: getDepartments,
      },
    ],
  };

  useEffect(() => {
    const variables = {
      start: start ? start.setHours(0, 0, 0, 0) : undefined,
      end: end ? end.setHours(23, 59, 59, 999) : undefined,
    };
    loadFinances({
      variables,
    });
  }, [start, end]);

  const [addFinance] = useMutation(createGeneralFinance, refresQuery);
  const [editFinance] = useMutation(updateGeneralFinance, refresQuery);
  const [removeFinance] = useMutation(deleteGeneralFinance, refresQuery);

  const commitChanges = async ({ deleted }) => {
    if (deleted) {
      const _id = deleted[0];
      removeFinance({ variables: { _id } });
      setRows(rows.filter((row: any) => row._id !== _id));
    }
  };

  useEffect(() => {
    if (financeData?.loading) {
      setLoading(true);
    }
    if (financeData?.data?.getGeneralFinances?.data) {
      const { data } = financeData.data.getGeneralFinances;
      setRows(data);
      setLoading(false);
    }
  }, [financeData]);

  const refresh = () => {
    financeData?.refetch();
  };

  const setSortDispatch = (value: any) => {
    dispatch({ type: "setSort", payload: value });
  };

  return (
    <PageLayout
      menuitem={menuitem}
      isRTL={isRTL}
      words={words}
      isEditor={isEditor}
      theme={theme}
      refresh={refresh}
    >
      <Paper>
        <DateNavigatorReports
          setStart={setStart}
          setEnd={setEnd}
          currentDate={currentDate}
          currentDateChange={currentDateChange}
          currentViewName={currentViewName}
          currentViewNameChange={currentViewNameChange}
          endDate={endDate}
          endDateChange={endDateChange}
          views={[1, 7, 30, 365, 1000]}
          isRTL={isRTL}
          words={words}
          theme={theme}
        ></DateNavigatorReports>
        <Grid rows={rows} columns={columns} getRowId={getRowId}>
          <SortingState
            defaultSorting={sort}
            onSortingChange={(srt: any) => setSortDispatch(srt)}
          />
          <EditingState onCommitChanges={commitChanges} />
          <SearchState />
          <IntegratedSorting />
          <IntegratedFiltering />
          <VirtualTable
            height={window.innerHeight - 181}
            messages={{
              noData: isRTL ? "لا يوجد بيانات" : "no data",
            }}
            estimatedRowHeight={40}
          />
          <TableHeaderRow showSortingControls />
          <DataTypeProvider
            for={["time"]}
            formatterComponent={timeFormatter}
          ></DataTypeProvider>
          <DataTypeProvider
            for={["amount"]}
            formatterComponent={currencyFormatter}
          ></DataTypeProvider>
          <DataTypeProvider
            for={["opType"]}
            formatterComponent={opTypeFormatter}
          ></DataTypeProvider>
          <DataTypeProvider
            for={["docNo", "refNo"]}
            formatterComponent={samllFormatter}
          ></DataTypeProvider>
          <DataTypeProvider
            for={["creditAcc"]}
            formatterComponent={(props) =>
              customerAccountFormatter(props, accounts, isRTL)
            }
          ></DataTypeProvider>
          <DataTypeProvider
            for={["debitAcc"]}
            formatterComponent={(props) =>
              accountFormatter(props, accounts, isRTL)
            }
          ></DataTypeProvider>
          {isEditor && (
            <TableEditColumn
              showEditCommand
              showDeleteCommand
              showAddCommand
              commandComponent={Command}
            ></TableEditColumn>
          )}
          <Toolbar />
          <SearchPanel
            inputComponent={(props: any) => {
              return <SearchTable isRTL={isRTL} {...props}></SearchTable>;
            }}
          />

          <PopupEditing
            theme={theme}
            addAction={addFinance}
            editAction={editFinance}
          >
            <PopupFinanceAll></PopupFinanceAll>
          </PopupEditing>
        </Grid>
        {loading && <Loading isRTL={isRTL} />}
      </Paper>
    </PageLayout>
  );
}
