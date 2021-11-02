/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react';
import PaymentOutlinedIcon from '@material-ui/icons/PaymentOutlined';
import AccountBalanceOutlinedIcon from '@material-ui/icons/AccountBalanceOutlined';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import AttachMoneyOutlinedIcon from '@material-ui/icons/AttachMoneyOutlined';
import ArrowDropDownOutlinedIcon from '@material-ui/icons/ArrowDropDownOutlined';
import EventOutlinedIcon from '@material-ui/icons/EventOutlined';
import AddBox from '@material-ui/icons/AddBox';
import SettingsIcon from '@material-ui/icons/Settings';
import HomeWorkOutlinedIcon from '@material-ui/icons/HomeWorkOutlined';
import ReceiptIcon from '@material-ui/icons/Receipt';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import PaymentIcon from '@material-ui/icons/Payment';
import PersonIcon from '@material-ui/icons/Person';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import AssessmentIcon from '@material-ui/icons/Assessment';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import WorkIcon from '@material-ui/icons/Work';
import GroupIcon from '@material-ui/icons/Group';
import Business from '@material-ui/icons/Business';
import Dashboard from '@material-ui/icons/Dashboard';
import DirectionsCarIcon from '@material-ui/icons/DirectionsCar';
import RoomIcon from '@material-ui/icons/Room';
import CloseIcon from '@material-ui/icons/Close';
import AccountTree from '@material-ui/icons/AccountTree';
import LanguageIcon from '@material-ui/icons/Language';

export default function MyIcon({ icon, color, size }: any) {
  const style = { color, fontSize: size ? size : undefined };
  switch (icon) {
    case 'home':
      return <HomeWorkOutlinedIcon style={style}></HomeWorkOutlinedIcon>;
    case 'calendar':
      return <CalendarTodayIcon style={style}></CalendarTodayIcon>;
    case 'sales':
      return <DescriptionOutlinedIcon style={style}></DescriptionOutlinedIcon>;
    case 'purchase':
      return <ShoppingCartIcon style={style}></ShoppingCartIcon>;
    case 'expenses':
      return <ReceiptIcon style={style}></ReceiptIcon>;
    case 'inventory':
      return <FormatListNumberedIcon style={style}></FormatListNumberedIcon>;
    case 'finance':
      return <PaymentIcon style={style}></PaymentIcon>;
    case 'add':
      return <AddBox style={style}></AddBox>;
    case 'user':
      return <PersonIcon style={style}></PersonIcon>;
    case 'business':
      return <Business style={style}></Business>;
    case 'group':
      return <GroupIcon style={style}></GroupIcon>;
    case 'options':
      return <SettingsIcon style={style}></SettingsIcon>;
    case 'cash':
      return <AttachMoneyOutlinedIcon style={style}></AttachMoneyOutlinedIcon>;
    case 'card':
      return <PaymentOutlinedIcon style={style}></PaymentOutlinedIcon>;
    case 'bank':
      return (
        <AccountBalanceOutlinedIcon style={style}></AccountBalanceOutlinedIcon>
      );
    case 'depart':
      return <Dashboard style={style}></Dashboard>;
    case 'partner':
      return (
        <AccountCircleOutlinedIcon style={style}></AccountCircleOutlinedIcon>
      );
    case 'discount':
      return (
        <ArrowDropDownOutlinedIcon style={style}></ArrowDropDownOutlinedIcon>
      );
    case 'event':
      return <EventOutlinedIcon style={style}></EventOutlinedIcon>;
    case 'report':
      return <AssessmentIcon style={style}></AssessmentIcon>;
    case 'account':
      return <AccountBalanceIcon style={style}></AccountBalanceIcon>;
    case 'logout':
      return <ExitToAppIcon style={style}></ExitToAppIcon>;
    case 'work':
      return <WorkIcon style={style}></WorkIcon>;
    case 'resourse':
      return <DirectionsCarIcon style={style}></DirectionsCarIcon>;
    case 'location':
      return <RoomIcon style={style}></RoomIcon>;
    case 'close':
      return <CloseIcon style={style}></CloseIcon>;
    case 'project':
      return <AccountTree style={style}></AccountTree>;
    case 'lang':
      return <LanguageIcon style={style}></LanguageIcon>;

    default:
      return <div></div>;
  }
}
