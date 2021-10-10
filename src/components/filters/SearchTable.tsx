/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { SearchPanel } from "@devexpress/dx-react-grid-material-ui";
import _ from "lodash";
import React from "react";

export default function SearchTable(props: any) {
  return (
    <SearchPanel.Input
      {...props}
      // onValueChange={_.debounce((e: any) => onValueChange(e.target.value), 300)}
      placeholder={props.isRTL ? "بحث" : "Search"}
      variant="outlined"
      key={"search"}
    ></SearchPanel.Input>
  );
}
