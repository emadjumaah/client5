/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useEffect, useState } from 'react';

import PopupLayout from '../pages/main/PopupLayout';
import { Grid } from '@material-ui/core';
import getRruleData from '../common/getRruleData';
import { SelectLocal } from '../pages/calendar/common/SelectLocal';
import RRule from 'rrule';
import { CalenderLocal, TextFieldLocal } from '../components';
import SelectMulti from '../Shared/SelectMulti';
import { byweekdayOptions, freqOptions } from '../constants/rrule';
import React from 'react';

const PopupAddMultiEvents = ({
  open,
  onClose,
  onSubmit,
  theme,
  isRTL,
  words,
  start,
}: any) => {
  const [saving, setSaving] = useState(false);
  const [freq, setFreq] = useState(RRule.DAILY);
  const [weekdays, setWeekdays] = useState([]);
  const [byweekday, setByweekday] = useState([]);
  const [dtstart, setDtstart] = useState(start ? start : new Date());
  const [until, setUntil] = useState(null);
  const [interval, setInterval] = useState(1);
  const [count, setCount] = useState(1);

  const [alrt] = useState({ show: false, msg: '', type: undefined });

  const onChangeFreq = (e: any) => {
    setFreq(e.target.value);
  };

  const onChangeInterval = (e: any) => {
    const value = Number(e.target.value);
    value < 1 ? setInterval(1) : setInterval(value);
  };
  const onChangeCount = (e: any) => {
    const value = Number(e.target.value);
    const count = value < 1 ? 1 : value > 365 ? 365 : value;
    setCount(count);
  };

  useEffect(() => {
    if (weekdays && weekdays.length > 0) {
      const bwd = weekdays.map((wd: any) => wd.value);
      setByweekday(bwd);
    }
  }, [weekdays]);
  useEffect(() => {
    if (freq !== RRule.WEEKLY) {
      setWeekdays([]);
      setByweekday([]);
    }
  }, [freq]);

  const submit = () => {
    setSaving(true);
    const rdata = getRruleData({
      freq,
      byweekday: byweekday.length > 0 ? byweekday : undefined,
      dtstart,
      until,
      interval,
      count,
    });
    onSubmit(rdata);
    setSaving(false);
    onFormClose();
  };

  const title = isRTL ? 'انشاء مواعيد متعددة' : 'Add Multi Appointments';

  const onFormClose = () => {
    setFreq(RRule.DAILY);
    setDtstart(new Date());
    setUntil(null);
    setInterval(1);
    setCount(1);
    setWeekdays([]);
    setByweekday([]);
    onClose();
    setSaving(false);
  };
  return (
    <PopupLayout
      isRTL={isRTL}
      open={open}
      onClose={onFormClose}
      title={title}
      onSubmit={submit}
      theme={theme}
      alrt={alrt}
      fullwidth
      maxWidth="md"
      saving={saving}
    >
      <Grid container spacing={2}>
        <Grid item xs={1}></Grid>
        <Grid item xs={9}>
          <Grid item xs={6}>
            <CalenderLocal
              isRTL={isRTL}
              label={words.start}
              value={dtstart}
              onChange={(date: any) => setDtstart(date)}
            ></CalenderLocal>
          </Grid>
          <SelectLocal
            options={freqOptions}
            value={freq}
            onChange={onChangeFreq}
            isRTL={isRTL}
          ></SelectLocal>
          {freq === RRule.WEEKLY && (
            <SelectMulti
              options={byweekdayOptions}
              value={weekdays}
              setValue={setWeekdays}
              words={words}
              isRTL={isRTL}
              name="weekdays"
              width={240}
            ></SelectMulti>
          )}
          <Grid item xs={6}>
            <TextFieldLocal
              required
              name="count"
              label={words.qty}
              value={count}
              onChange={onChangeCount}
              type="number"
              width={240}
            />
          </Grid>

          <Grid item xs={6}>
            <TextFieldLocal
              required
              name="interval"
              label={words.interval}
              value={interval}
              onChange={onChangeInterval}
              type="number"
              width={240}
            />
          </Grid>
          <Grid item xs={6}>
            <CalenderLocal
              isRTL={isRTL}
              label={words.end}
              value={until}
              onChange={(date: any) => setUntil(date)}
            ></CalenderLocal>
          </Grid>
        </Grid>

        <Grid item xs={2}></Grid>
      </Grid>
    </PopupLayout>
  );
};

export default PopupAddMultiEvents;
