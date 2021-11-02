import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

export const loginClasses = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: 20,
  },
  avatar: {
    marginTop: theme.spacing(8),
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));
export const layoutClasses = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },

    toolbar: theme.mixins.toolbar,
    content: {
      flex: 1,
    },
  })
);

export const categoryClasses = makeStyles((_theme: Theme) =>
  createStyles({
    popup: {
      height: '45vh',
      width: '65vh',
    },
    margin: {
      margin: 8,
      height: 36,
      width: 100,
    },
  })
);

export const appointClasses = makeStyles((_theme: Theme) =>
  createStyles({
    popup: {
      width: '85vh',
      height: '80vh',
    },
    margin: {
      margin: 8,
      height: 36,
      width: 100,
    },
  })
);

export const cardClasses = makeStyles({
  root: {
    maxWidth: 400,
  },
  media: {
    height: 140,
  },
});

export const daySwitchClasses = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  })
);

export const invoiceClasses = makeStyles((theme: Theme) =>
  createStyles({
    popup: {
      height: '120vh',
      width: '140vh',
      'overflow-y': 'overlay',
    },
    root: {
      '& .MuiTextField-root': {
        margin: theme.spacing(1),
        width: '80ch',
      },
    },
    margin: {
      margin: 8,
      height: 36,
      width: 100,
    },
    smallFont: {
      fontSize: 12,
    },
  })
);
export const eventsFormClasses = makeStyles((theme: Theme) =>
  createStyles({
    popup: {
      height: '70vh',
      width: '80vh',
      'overflow-y': 'overlay',
    },
    root: {
      '& .MuiTextField-root': {
        margin: theme.spacing(1),
        width: '80ch',
      },
    },
    margin: {
      margin: 8,
      height: 36,
      width: 100,
    },
    smallFont: {
      fontSize: 12,
    },
  })
);

export const itemClasses = makeStyles((theme: Theme) =>
  createStyles({
    popup: {
      height: '20vh',
      width: '100vh',
      'overflow-y': 'overlay',
    },
    root: {
      '& .MuiTextField-root': {
        margin: theme.spacing(1),
        width: '80ch',
      },
    },
    margin: {
      margin: 8,
      height: 36,
      width: 100,
    },
    smallFont: {
      fontSize: 12,
    },
  })
);

export const departmentClasses = makeStyles((_theme: Theme) =>
  createStyles({
    popup: {
      height: '55vh',
      width: '75vh',
    },
    margin: {
      margin: 8,
      height: 36,
      width: 100,
    },
  })
);

export const employeeClasses = makeStyles((_theme: Theme) =>
  createStyles({
    popup: {
      height: '80vh',
      width: '65vh',
    },
    margin: {
      margin: 8,
      height: 36,
      width: 100,
    },
  })
);
export const financeClasses = makeStyles((_theme: Theme) =>
  createStyles({
    popup: {
      height: '75vh',
      width: '75vh',
    },
    margin: {
      margin: 8,
      height: 36,
      width: 100,
    },
  })
);
export const serviceClasses = makeStyles((_theme: Theme) =>
  createStyles({
    popup: {
      height: '80vh',
      width: '70vh',
    },
    margin: {
      margin: 8,
      height: 36,
      width: 100,
    },
  })
);
export const userClasses = makeStyles((_theme: Theme) =>
  createStyles({
    popup: {
      height: '80vh',
      width: '70vh',
    },
    margin: {
      margin: 8,
      height: 36,
      width: 100,
    },
  })
);

export const productClasses = makeStyles((_theme: Theme) =>
  createStyles({
    popup: {
      height: '70vh',
      width: '90vh',
    },
    margin: {
      marginTop: 18,
      height: 36,
      width: 100,
    },
    root: {
      width: '100%',
    },
  })
);
export const simpleOrderClasses = makeStyles((theme: Theme) =>
  createStyles({
    popupadd: {
      height: '65vh',
      width: '100vh',
      'overflow-y': 'overlay',
    },
    root: {
      '& .MuiTextField-root': {
        margin: theme.spacing(1),
        width: '80ch',
      },
    },
    margin: {
      margin: 8,
      height: 36,
      width: 100,
    },
  })
);
