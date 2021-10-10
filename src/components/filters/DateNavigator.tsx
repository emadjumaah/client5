/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  fade,
  Hidden,
  IconButton,
  Typography,
} from "@material-ui/core";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

import { DateViewSwitcher } from "../../pages/calendar/common/DateViewSwitcher";
import arLocale from "date-fns/locale/ar-SA";
import enLocale from "date-fns/locale/en-GB";
import ArrowForwardIosOutlinedIcon from "@material-ui/icons/ArrowForwardIosOutlined";
import ArrowBackIosOutlinedIcon from "@material-ui/icons/ArrowBackIosOutlined";
import { getStartEndEventView } from "../../common/time";
import moment from "moment";
export default function DateNavigator({
  isRTL,
  words,
  setStart,
  setEnd,
  theme,
  currentDate,
  currentViewName,
  currentViewNameChange,
  currentDateChange,
  views,
}: any) {
  const [timeFormat, setTimeFormat] = useState("MMMM, dd yyyy");
  const [open, setOpen]: any = useState(false);

  useEffect(() => {
    const { start, end, period }: any = getStartEndEventView({
      time: currentDate,
      view: currentViewName,
      isRTL,
    });
    setStart(start);
    setEnd(end);
    setTimeFormat(period);
  }, [currentDate, currentViewName]);

  const stepForward = () => {
    if (currentViewName === "Day") {
      const tomorrow = new Date(currentDate);
      tomorrow.setDate(tomorrow.getDate() + 1);
      currentDateChange(tomorrow);
    } else if (currentViewName === "3Days") {
      const next3days = new Date(currentDate);
      next3days.setDate(next3days.getDate() + 3);
      currentDateChange(next3days);
    } else if (currentViewName === "Week") {
      const nextweek = new Date(currentDate);
      nextweek.setDate(nextweek.getDate() + 7);
      currentDateChange(nextweek);
    } else if (currentViewName === "Month") {
      const nextmonth = new Date(currentDate);
      nextmonth.setMonth(nextmonth.getMonth() + 1);
      currentDateChange(nextmonth);
    } else if (currentViewName === "Year") {
      const nextyear = new Date(currentDate);
      nextyear.setFullYear(nextyear.getFullYear() + 1);
      currentDateChange(nextyear);
    }
  };
  const stepBackward = () => {
    if (currentViewName === "Day") {
      const yestarday = new Date(currentDate);
      yestarday.setDate(yestarday.getDate() - 1);
      currentDateChange(yestarday);
    } else if (currentViewName === "3Days") {
      const last3days = new Date(currentDate);
      last3days.setDate(last3days.getDate() - 3);
      currentDateChange(last3days);
    } else if (currentViewName === "Week") {
      const lastweek = new Date(currentDate);
      lastweek.setDate(lastweek.getDate() - 7);
      currentDateChange(lastweek);
    } else if (currentViewName === "Month") {
      const lastmonth = new Date(currentDate);
      lastmonth.setMonth(lastmonth.getMonth() - 1);
      currentDateChange(lastmonth);
    } else if (currentViewName === "Year") {
      const lastyear = new Date(currentDate);
      lastyear.setFullYear(lastyear.getFullYear() - 1);
      currentDateChange(lastyear);
    }
  };
  const disabled = moment(new Date()).isSame(currentDate, "day");

  return (
    <Box
      display="flex"
      style={{
        alignItems: "center",
        justifyContent: "flex-start",
        marginRight: 10,
        marginLeft: 10,
      }}
    >
      <Hidden xsDown implementation="css">
        <Button
          style={{
            marginTop: 2,
            height: 32,
            width: 32,
            padding: 0,
            margin: 0,
            marginLeft: 5,
            backgroundColor: fade(
              theme.palette.primary.dark,
              disabled ? 0.1 : 0.2
            ),
          }}
          size="small"
          disabled={disabled}
          onClick={() => currentDateChange(new Date())}
        >
          <Typography
            style={{
              fontWeight: "bold",
              fontSize: 13,
              color: disabled ? "#999" : theme.palette.primary.main,
            }}
          >
            {isRTL ? "الأن" : "Now"}
          </Typography>
        </Button>
      </Hidden>

      <Box display="flex">
        <DateViewSwitcher
          currentViewName={currentViewName}
          onChange={currentViewNameChange}
          currentDateChange={currentDateChange}
          isRTL={isRTL}
          words={words}
          views={views}
        />
      </Box>
      <Box
        display="flex"
        style={{
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <IconButton
          color="primary"
          style={{ marginTop: 4 }}
          onClick={isRTL ? stepForward : stepBackward}
        >
          {isRTL && (
            <ArrowForwardIosOutlinedIcon
              style={{ fontSize: 18, color: "#555" }}
            />
          )}
          {!isRTL && (
            <ArrowBackIosOutlinedIcon style={{ fontSize: 18, color: "#555" }} />
          )}
        </IconButton>
        <IconButton
          color="primary"
          style={{ marginTop: 4, marginLeft: 5 }}
          onClick={isRTL ? stepBackward : stepForward}
        >
          {isRTL && (
            <ArrowBackIosOutlinedIcon style={{ fontSize: 18, color: "#555" }} />
          )}
          {!isRTL && (
            <ArrowForwardIosOutlinedIcon
              style={{ fontSize: 18, color: "#555" }}
            />
          )}
        </IconButton>
        <Button
          style={{
            position: "relative",
            zIndex: 10,
            backgroundColor: "#fff",
            height: 40,
          }}
          onClick={() => setOpen(true)}
        >
          <Typography color="primary" variant="button">
            {timeFormat}
          </Typography>
        </Button>
        <MuiPickersUtilsProvider
          locale={isRTL ? arLocale : enLocale}
          utils={DateFnsUtils}
        >
          <DatePicker
            autoOk
            variant="inline"
            inputVariant="outlined"
            format="dd/MM/yyyy"
            margin="dense"
            id="date-picker-inline"
            value={currentDate}
            onChange={currentDateChange}
            open={open}
            onClose={() => setOpen(false)}
            rightArrowIcon={
              isRTL ? (
                <ArrowBackIosOutlinedIcon></ArrowBackIosOutlinedIcon>
              ) : (
                <ArrowForwardIosOutlinedIcon></ArrowForwardIosOutlinedIcon>
              )
            }
            leftArrowIcon={
              isRTL ? (
                <ArrowForwardIosOutlinedIcon></ArrowForwardIosOutlinedIcon>
              ) : (
                <ArrowBackIosOutlinedIcon></ArrowBackIosOutlinedIcon>
              )
            }
            style={{
              direction: "rtl",
              position: "relative",
              left: isRTL ? 60 : undefined,
              right: isRTL ? undefined : 60,
              bottom: 20,
              zIndex: -20,
              marginTop: 0,
              height: 0,
              padding: 0,
              margin: 0,
              width: 0,
            }}
          />
        </MuiPickersUtilsProvider>
      </Box>
    </Box>
  );
}
