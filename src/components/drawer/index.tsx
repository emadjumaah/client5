/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react';
import {
  makeStyles,
  createStyles,
  Theme,
  useTheme,
} from '@material-ui/core/styles';
import { useNavigate } from 'react-router-dom';
import { client } from '../../graphql';

import {
  AppBar,
  Box,
  Drawer,
  FormControlLabel,
  Hidden,
  IconButton,
  Switch,
  Toolbar,
  Tooltip,
  Typography,
} from '@material-ui/core';
import clsx from 'clsx';
import MenuIcon from '@material-ui/icons/Menu';
import Menu from './Menu';
import { drawerWidth } from '../../constants';
import { UserBox } from '../../Shared';
// import MainVav from '../../Shared/MainVav';
import { subscribePushToken } from '../../common/helpers';
import { useMutation } from '@apollo/client';
import updatePushToken from '../../graphql/mutation/updatePushToken';

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
      [theme.breakpoints.down('md')]: {
        width: drawerWidth,
      },
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
      fontSize: '1.3em',
      paddingTop: 12,
      paddingBottom: 12,
      '&:hover': {
        backgroundColor: theme.palette.primary.light,
      },
    },
    child2: {
      padding: 7,
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
  const navigate = useNavigate();

  const classes = drawerClasses();
  const {
    menuitem,
    setMenuitem,
    menu,
    isRTL,
    user,
    network,
    logout,
    mmenu,
    // setMmenu,
    notify,
    dispatch,
    company,
  } = props;
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const [updatePush] = useMutation(updatePushToken);

  const handleNotification = async (e: any) => {
    const { checked } = e.target;
    dispatch({ type: 'setNotify', payload: checked });
    try {
      const pushToken = await subscribePushToken(company, checked);
      console.log('pushToken', pushToken);
      const variables = { pushToken, notify: checked };
      updatePush({ variables });
    } catch (error) {
      console.log(error);
    }
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
                logout={logout}
                client={client}
                navigate={navigate}
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
              navigate={navigate}
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
              navigate={navigate}
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
              navigate={navigate}
            ></Menu>
            {mmenu === 3 && (
              <Box
                display="flex"
                style={{
                  flex: 1,
                  minHeight: 100,
                  paddingLeft: 20,
                  paddingRight: 20,
                  alignItems: 'center',
                  justifyContent: 'start',
                }}
              >
                <FormControlLabel
                  control={
                    <Tooltip
                      title={
                        isRTL
                          ? notify
                            ? 'ايقاف التبيهات'
                            : 'تفعيل التنبيهات'
                          : !notify
                          ? 'Activate Notifications'
                          : 'Stop Notifications'
                      }
                    >
                      <Switch
                        checked={notify}
                        onChange={handleNotification}
                        name="checkedA"
                        inputProps={{ 'aria-label': 'secondary checkbox' }}
                      />
                    </Tooltip>
                  }
                  style={{ color: '#eee' }}
                  labelPlacement="end"
                  label={
                    isRTL
                      ? notify
                        ? 'التبيهات فعالة'
                        : 'التنبيهات متوقفة'
                      : !notify
                      ? 'Notifications Activated'
                      : 'Notifications Stoped'
                  }
                />
              </Box>
            )}
            {mmenu === 2 && (
              <Box
                style={{
                  flex: 1,
                  minHeight: 100,
                  paddingLeft: 20,
                  paddingRight: 20,
                }}
              >
                <Box
                  display="flex"
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 10,
                  }}
                >
                  <Typography style={{ color: '#eee' }} variant="subtitle1">
                    {isRTL ? 'عدد الرسائل SMS' : 'SMS Messages'}
                  </Typography>
                  <Typography style={{ color: '#eee' }} variant="subtitle1">
                    {company?.smss}
                  </Typography>
                </Box>
                <Box
                  display="flex"
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Typography style={{ color: '#eee' }} variant="subtitle1">
                    {isRTL ? 'عدد الرسائل Email' : 'Emails'}
                  </Typography>
                  <Typography style={{ color: '#eee' }} variant="subtitle1">
                    {company?.emails}
                  </Typography>
                </Box>
              </Box>
            )}
            {/* <MainVav
              setMmenu={setMmenu}
              theme={theme}
              isRTL={isRTL}
              user={user}
            ></MainVav> */}
          </Drawer>
        </Hidden>
      </nav>
    </>
  );
}

export default AppDrawer;
