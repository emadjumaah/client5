/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import ScheduleOutlinedIcon from '@material-ui/icons/ScheduleOutlined';
import CheckCircleOutlinedIcon from '@material-ui/icons/CheckCircleOutlined';
import PauseCircleOutlineIcon from '@material-ui/icons/PauseCircleOutline';
import BlockOutlinedIcon from '@material-ui/icons/BlockOutlined';

export const renderStatusIcon = (status: any, color = '#f5f5f5', size = 18) => {
  switch (status) {
    case 1:
      return (
        <RadioButtonUncheckedIcon
          style={{ fontSize: size, color }}
        ></RadioButtonUncheckedIcon>
      );
    case 2:
      // return <div></div>;
      return (
        <ScheduleOutlinedIcon
          style={{ fontSize: size, color }}
        ></ScheduleOutlinedIcon>
      );
    case 3:
      return (
        <PauseCircleOutlineIcon
          style={{ fontSize: size, color }}
        ></PauseCircleOutlineIcon>
      );
    case 4:
      return (
        <BlockOutlinedIcon
          style={{ fontSize: size, color }}
        ></BlockOutlinedIcon>
      );
    case 10:
      return (
        <CheckCircleOutlinedIcon
          style={{ fontSize: size, color }}
        ></CheckCircleOutlinedIcon>
      );

    default:
      return <div></div>;
  }
};
