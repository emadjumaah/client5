/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react';
import {
  DateTimePicker,
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import ArrowForwardIosOutlinedIcon from '@material-ui/icons/ArrowForwardIosOutlined';
import ArrowBackIosOutlinedIcon from '@material-ui/icons/ArrowBackIosOutlined';
import enLocale from 'date-fns/locale/en-GB';

const CalenderLocal = ({
  isRTL,
  label,
  value,
  onChange,
  format = 'dd/MM/yyyy',
  time,
  width = 150,
  minDate,
  maxDate,
  ...rest
}: any) => {
  return (
    <MuiPickersUtilsProvider locale={enLocale} utils={DateFnsUtils} {...rest}>
      {!time && (
        <KeyboardDatePicker
          autoOk
          minDate={minDate}
          maxDate={maxDate}
          minDateMessage={isRTL ? 'التاريخ غير صالح' : 'Invalid Date'}
          maxDateMessage={isRTL ? 'التاريخ غير صالح' : 'Invalid Date'}
          variant="inline"
          format={format}
          margin="normal"
          id="date-picker-inline"
          label={label}
          value={value}
          onChange={onChange}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
          style={{ width }}
          rightArrowIcon={
            isRTL ? (
              <ArrowBackIosOutlinedIcon
                style={{ fontSize: 18 }}
              ></ArrowBackIosOutlinedIcon>
            ) : (
              <ArrowForwardIosOutlinedIcon
                style={{ fontSize: 18 }}
              ></ArrowForwardIosOutlinedIcon>
            )
          }
          leftArrowIcon={
            isRTL ? (
              <ArrowForwardIosOutlinedIcon
                style={{ fontSize: 18 }}
              ></ArrowForwardIosOutlinedIcon>
            ) : (
              <ArrowBackIosOutlinedIcon
                style={{ fontSize: 18 }}
              ></ArrowBackIosOutlinedIcon>
            )
          }
          {...rest}
        />
      )}
      {time && (
        <DateTimePicker
          autoOk
          variant="inline"
          minDate={minDate}
          maxDate={maxDate}
          minDateMessage={isRTL ? 'التاريخ غير صالح' : 'Invalid Date'}
          maxDateMessage={isRTL ? 'التاريخ غير صالح' : 'Invalid Date'}
          id="time-pickerstart"
          label={label}
          name="startDate"
          inputVariant="standard"
          format="dd/MM/yyyy hh:mm"
          value={value}
          onChange={onChange}
          style={{ width }}
          rightArrowIcon={
            isRTL ? (
              <ArrowBackIosOutlinedIcon
                style={{ fontSize: 18 }}
              ></ArrowBackIosOutlinedIcon>
            ) : (
              <ArrowForwardIosOutlinedIcon
                style={{ fontSize: 18 }}
              ></ArrowForwardIosOutlinedIcon>
            )
          }
          leftArrowIcon={
            isRTL ? (
              <ArrowForwardIosOutlinedIcon
                style={{ fontSize: 18 }}
              ></ArrowForwardIosOutlinedIcon>
            ) : (
              <ArrowBackIosOutlinedIcon
                style={{ fontSize: 18 }}
              ></ArrowBackIosOutlinedIcon>
            )
          }
          {...rest}
        />
      )}
    </MuiPickersUtilsProvider>
  );
};

export default CalenderLocal;
