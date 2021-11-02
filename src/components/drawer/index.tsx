/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react';
import {
  makeStyles,
  createStyles,
  Theme,
  useTheme,
} from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import { client } from '../../graphql';

import {
  AppBar,
  Box,
  Drawer,
  Hidden,
  IconButton,
  Toolbar,
} from '@material-ui/core';
import clsx from 'clsx';
import MenuIcon from '@material-ui/icons/Menu';
import Menu from './Menu';
import { drawerWidth } from '../../constants';
import { UserBox } from '../../Shared';

const drawerClasses = makeStyles((theme: Theme) =>
  createStyles({
    txtrtl: {
      textAlign: 'start',
      '& span, & svg': {
        fontSize: '1rem',
        // fontWeight: "500",
      },
      color: '#fff',
    },
    txtltr: {
      textAlign: 'start',
      '& span, & svg': {
        fontSize: '1rem',
        // fontWeight: "bold",
      },
      color: '#fff',
    },
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
      width: drawerWidth,
      backgroundColor: theme.palette.primary.main,
    },
    drawerContainer: {
      overflow: 'auto',
    },
    drawer: {
      [theme.breakpoints.up('sm')]: {
        width: drawerWidth,
        flexShrink: 0,
      },
      backgroundColor: theme.palette.primary.main,
    },
    child: {
      fontSize: '1.5em',
      paddingTop: 15,
      paddingBottom: 15,
      '&:hover': {
        backgroundColor: theme.palette.primary.light,
      },
    },
    child2: {
      padding: 10,
      paddingLeft: 55,
      backgroundColor: theme.palette.primary.main,
      '&:hover': {
        backgroundColor: theme.palette.primary.light,
      },
    },
    hide: {
      display: 'none',
    },
    icon: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      backgroundColor: '#21d19f',
    },
    appBar: {
      [theme.breakpoints.up('sm')]: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
      },
    },
    menuButton: {
      marginRight: theme.spacing(2),
      [theme.breakpoints.up('sm')]: {
        display: 'none',
      },
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },

    '@global': {
      '*::-webkit-scrollbar': {
        width: '0.4em',
      },
      '*::-webkit-scrollbar-track': {
        '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.3)',
      },
      '*::-webkit-scrollbar-thumb': {
        backgroundColor: 'rgba(0,0,0,.3)',
        // outline: "1px solid #333",
      },
    },
  })
);

function AppDrawer(props: any): any {
  const { window } = props;
  const history = useHistory();

  const classes = drawerClasses();
  const { menuitem, setMenuitem, menu, isRTL, user, network, logout } = props;
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <>
      <Hidden smUp implementation="js">
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              className={classes.menuButton}
            >
              <MenuIcon />
            </IconButton>
            <Box style={{ flex: 1 }}>
              <UserBox
                mobile
                isRTL={isRTL}
                theme={theme}
                user={user}
                network={network}
              ></UserBox>
            </Box>
          </Toolbar>
        </AppBar>
      </Hidden>

      <nav className={clsx(classes.drawer)} aria-label="mailbox folders">
        <Hidden smUp implementation="js">
          <Drawer
            container={container}
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            <Menu
              menu={menu}
              menuitem={menuitem}
              setMenuitem={setMenuitem}
              classes={classes}
              isRTL={isRTL}
              theme={theme}
              user={user}
              setMobileOpen={setMobileOpen}
              logout={logout}
              client={client}
              history={history}
            ></Menu>
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="js">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            <UserBox
              isRTL={isRTL}
              theme={theme}
              user={user}
              network={network}
              logout={logout}
              client={client}
              history={history}
            ></UserBox>
            <Menu
              menu={menu}
              menuitem={menuitem}
              setMenuitem={setMenuitem}
              classes={classes}
              isRTL={isRTL}
              theme={theme}
              user={user}
              logout={logout}
              client={client}
              history={history}
            ></Menu>
          </Drawer>
        </Hidden>
      </nav>
    </>
  );
}

export default AppDrawer;
