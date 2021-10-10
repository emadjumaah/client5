/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useEffect, useState } from "react";
import Paper from "@material-ui/core/Paper";
import {
  SortingState,
  IntegratedSorting,
  DataTypeProvider,
  SearchState,
  IntegratedFiltering,
} from "@devexpress/dx-react-grid";
import {
  Grid,
  TableHeaderRow,
  VirtualTable,
  Toolbar,
  SearchPanel,
} from "@devexpress/dx-react-grid-material-ui";
import { Loading } from "../../Shared";
import { getRowId } from "../../common";
import { getReminders } from "../../graphql";
import { useLazyQuery } from "@apollo/client";
import {
  createdAtFormatter,
  currencyFormatter,
  eventStatusFormatter,
} from "../../Shared/colorFormat";

import { SearchTable } from "../../components";
import { getColumns } from "../../common/columns";

import { useMediaQuery } from "@material-ui/core";

export default function Reminders({ isRTL, words }) {
  const col = getColumns({ isRTL, words });
  const isMobile = useMediaQuery("(max-width:600px)");

  const [columns] = useState([
    col.startDate,
    col.docNo,
    col.refNo,
    col.employee,
    col.service,
    col.department,
    col.customer,
    col.status,
    col.amount,
  ]);

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const [loadEvents, eventsData]: any = useLazyQuery(getReminders);

  useEffect(() => {
    loadEvents({});
  }, []);

  useEffect(() => {
    if (eventsData?.loading) {
      setLoading(true);
    }
    if (eventsData?.data?.getReminders?.data) {
      const { data } = eventsData.data.getReminders;
      setRows(data);
      setLoading(false);
    }
  }, [eventsData]);

  return (
    <Paper>
      <Grid rows={rows} columns={columns} getRowId={getRowId}>
        <SortingState />
        {!isMobile && <SearchState />}

        <IntegratedSorting />
        {!isMobile && <IntegratedFiltering />}

        <VirtualTable
          height={window.innerHeight - 133}
          messages={{
            noData: isRTL ? "لا يوجد بيانات" : "no data",
          }}
          estimatedRowHeight={40}
        />
        <TableHeaderRow showSortingControls />

        <DataTypeProvider
          for={["startDate"]}
          formatterComponent={createdAtFormatter}
        ></DataTypeProvider>
        <DataTypeProvider
          for={["status"]}
          formatterComponent={eventStatusFormatter}
        ></DataTypeProvider>
        <DataTypeProvider
          for={["amount"]}
          formatterComponent={currencyFormatter}
        ></DataTypeProvider>

        {!isMobile && <Toolbar />}
        {!isMobile && (
          <SearchPanel
            inputComponent={(props: any) => {
              return <SearchTable isRTL={isRTL} {...props}></SearchTable>;
            }}
          />
        )}
      </Grid>
      {loading && <Loading isRTL={isRTL} />}
    </Paper>
  );
}
