import { Toolbar } from "@devexpress/dx-react-scheduler-material-ui";
import { LinearProgress, withStyles } from "@material-ui/core";
import React from "react";

const styles: any = {
  toolbarRoot: {
    position: "relative",
  },
  progress: {
    position: "absolute",
    width: "100%",
    bottom: 0,
    left: 0,
  },
};

const ToolbarWithLoading = withStyles(styles, { name: "Toolbar" })(
  ({ children, classes, ...restProps }: any) => (
    <div className={classes.toolbarRoot}>
      <Toolbar.Root {...restProps}>{children}</Toolbar.Root>
      <LinearProgress className={classes.progress} />
    </div>
  ),
);

export default ToolbarWithLoading;
