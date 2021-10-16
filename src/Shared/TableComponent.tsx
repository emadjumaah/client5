import { VirtualTable } from '@devexpress/dx-react-grid-material-ui';
import { colors, fade, withStyles } from '@material-ui/core';
import React from 'react';

const styles = (theme: any) => ({
  tableStriped: {
    '& tbody tr:nth-of-type(odd)': {
      backgroundColor: fade(theme.palette.primary.main, 0.05),
    },
  },
});
const stylesBlue = () => ({
  tableStriped: {
    '& tbody tr:nth-of-type(odd)': {
      backgroundColor: fade(colors.blue[500], 0.13),
    },
  },
});
const stylesGreen = () => ({
  tableStriped: {
    '& tbody tr:nth-of-type(odd)': {
      backgroundColor: fade(colors.green[400], 0.1),
    },
  },
});
const stylesRed = () => ({
  tableStriped: {
    '& tbody tr:nth-of-type(odd)': {
      backgroundColor: fade(colors.red[400], 0.1),
    },
  },
});
const stylesOrange = () => ({
  tableStriped: {
    '& tbody tr:nth-of-type(odd)': {
      backgroundColor: fade(colors.orange[400], 0.1),
    },
  },
});
const stylesPurple = () => ({
  tableStriped: {
    '& tbody tr:nth-of-type(odd)': {
      backgroundColor: fade(colors.deepPurple[400], 0.1),
    },
  },
});
const stylesGrey = () => ({
  tableStriped: {
    '& tbody tr:nth-of-type(odd)': {
      backgroundColor: fade(colors.grey[400], 0.1),
    },
  },
});

const TableComponentBase = ({ classes, ...restProps }) => (
  <VirtualTable.Table {...restProps} className={classes.tableStriped} />
);
export const TableComponent = withStyles(styles, { name: 'TableComponent' })(
  TableComponentBase
);
export const TableComponentBlue = withStyles(stylesBlue, {
  name: 'TableComponent',
})(TableComponentBase);
export const TableComponentGreen = withStyles(stylesGreen, {
  name: 'TableComponent',
})(TableComponentBase);
export const TableComponentRed = withStyles(stylesRed, {
  name: 'TableComponent',
})(TableComponentBase);
export const TableComponentOrange = withStyles(stylesOrange, {
  name: 'TableComponent',
})(TableComponentBase);
export const TableComponentPurple = withStyles(stylesPurple, {
  name: 'TableComponent',
})(TableComponentBase);
export const TableComponentGrey = withStyles(stylesGrey, {
  name: 'TableComponent',
})(TableComponentBase);
