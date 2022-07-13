/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { dublicateAlert, errorAlert, messageAlert } from '../Shared';
import { GContextTypes } from '../types';
import { GlobalContext } from '../contexts';
import { Box, Paper, Typography } from '@material-ui/core';
import PopupLayout from '../pages/main/PopupLayout';
import { Grid } from '@material-ui/core';
import AutoFieldLocal from '../components/fields/AutoFieldLocal';
import { CalenderLocal, TextFieldLocal } from '../components';
import { weekdaysNNo } from '../constants/datatypes';
import { getDateDayWeek } from '../Shared/colorFormat';
import { useTemplate } from '../hooks';
import useDepartmentsUp from '../hooks/useDepartmentsUp';
import useEmployeesUp from '../hooks/useEmployeesUp';
import useResoursesUp from '../hooks/useResoursesUp';
import { SelectLocal } from '../pages/calendar/common/SelectLocal';
import {
  byweekdayOptions,
  intervalOptions,
  monthdaysOptions,
} from '../constants/rrule';
import RRule from 'rrule';
import { getReminderRruleData } from '../common/getRruleData';
import SelectMulti from '../Shared/SelectMulti';

export const indexTheList = (list: any) => {
  return list.map((item: any, index: any) => {
    return {
      ...item,
      index,
    };
  });
};

const PopupReminder = ({
  open,
  onClose,
  row,
  isNew,
  theme,
  addAction,
  editAction,
  value,
  name,
  tasks,
}: any) => {
  const [saving, setSaving] = useState(false);

  const [runtime, setRuntime]: any = useState(new Date());
  const [startDate, setStartDate]: any = useState(new Date());
  const [endDate, setEndDate]: any = useState(new Date());

  const [departvalue, setDepartvalue] = useState<any>(
    name === 'departmentId' ? value : null
  );
  const [departError, setDepartError] = useState<any>(false);
  const departRef: any = React.useRef();

  const [emplvalue, setEmplvalue] = useState<any>(
    name === 'employeeId' ? value : null
  );
  const [emplError, setEmplError] = useState<any>(false);
  const emplRef: any = React.useRef();

  const [resovalue, setResovalue] = useState<any>(
    name === 'resourseId' ? value : null
  );

  const [taskvalue, setTaskvalue] = useState<any>(
    name === 'contractId' ? value : null
  );

  const [resoError, setResoError] = useState<any>(false);
  const resoRef: any = React.useRef();

  const [rrule, setRrule] = useState<any>(null);

  const [alrt, setAlrt] = useState({ show: false, msg: '', type: undefined });
  const [rtitle, setRtitle]: any = useState(null);

  const [freq, setFreq] = useState(RRule.DAILY);
  const [count, setCount] = useState(1);
  const [interval, setInterval] = useState(1);

  const [periodType, setPeriodType] = useState(1);

  const [weekdays, setWeekdays]: any = useState([]);
  const [byweekday, setByweekday] = useState([]);
  const [monthdays, setMonthdays] = useState([]);
  const [bymonthday, setBymonthday] = useState([]);
  const [isLastday, setIsLastday] = useState(false); // lastday of month

  const { departments } = useDepartmentsUp();
  const { employees } = useEmployeesUp();
  const { resourses } = useResoursesUp();
  const { tempwords, tempoptions } = useTemplate();

  const { register, handleSubmit } = useForm({});
  const {
    translate: { words, isRTL },
  }: GContextTypes = useContext(GlobalContext);

  const onChangeInterval = (e: any) => {
    const value = Number(e.target.value);
    setInterval(value);
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
    if (monthdays && monthdays.length > 0) {
      const bmd = monthdays.map((wd: any) => wd.value);
      setBymonthday(bmd);
    }
  }, [monthdays]);

  useEffect(() => {
    if (freq !== RRule.WEEKLY) {
      setWeekdays([]);
      setByweekday([]);
    }
  }, [freq]);

  useEffect(() => {
    const rdata = getReminderRruleData({
      freq,
      dtstart: startDate,
      until: undefined,
      interval,
      byweekday: weekdays?.length > 0 ? byweekday : undefined,
      bymonthday: monthdays?.length > 0 ? bymonthday : undefined,
      count,
    });
    setRrule(rdata);
  }, [
    isNew,
    startDate,
    freq,
    count,
    interval,
    freq,
    count,
    interval,
    weekdays,
    byweekday,
    monthdays,
    bymonthday,
  ]);

  const resetAllForms = () => {
    setRuntime(null);
    setRrule(null);
    setRtitle(null);
    setSaving(false);
    setCount(1);
    setInterval(1);
    setPeriodType(1);
    setFreq(RRule.DAILY);
    setBymonthday(null);
    setMonthdays([]);
    setDepartvalue(name === 'departmentId' ? value : null);
    setEmplvalue(name === 'employeeId' ? value : null);
    setResovalue(name === 'resourseId' ? value : null);
    setTaskvalue(name === 'contractId' ? value : null);
  };

  const onSubmit = async () => {
    if (!rtitle || rtitle.length < 3) {
      await messageAlert(
        setAlrt,
        isRTL ? 'يرجى اضافة البيان' : 'Please add title'
      );
      return;
    }
    setSaving(true);

    const variables: any = {
      _id: row && row._id ? row._id : undefined, // is it new or edit
      title: rtitle,
      startDate,
      endDate,
      runtime,
      rRule: rrule?.str,
      rruledata: rrule ? JSON.stringify(rrule) : undefined,
      departmentId: departvalue ? departvalue._id : undefined,
      employeeId: emplvalue ? emplvalue._id : undefined,
      resourseId: resovalue ? resovalue._id : undefined,
      contractId: taskvalue ? taskvalue._id : undefined,
      freq,
      count,
      interval,
    };
    const mutate = isNew ? addAction : editAction;
    apply(mutate, variables);
  };

  const apply = async (mutate: any, variables: any) => {
    try {
      await mutate({ variables });
      setSaving(false);
      onCloseForm();
    } catch (error) {
      onError(error);
      console.log('error popup', error);
    }
  };

  const onError = async (error: any) => {
    if (error.message.includes('duplicate')) {
      await dublicateAlert(setAlrt, isRTL);
    } else {
      await errorAlert(setAlrt, isRTL);
      console.log(error);
    }
  };
  const onCloseForm = () => {
    resetAllForms();
    onClose();
    setSaving(false);
  };

  const onHandleSubmit = () => {
    handleSubmit(onSubmit)();
  };

  const onChangePeriodType = (e: any) => {
    const value = e.target.value;
    setPeriodType(value);
    if (value === 1) {
      setFreq(RRule.DAILY);
      setInterval(value);
      setMonthdays([]);
      setBymonthday([]);
    } else if (value === 7) {
      setFreq(RRule.WEEKLY);
      setInterval(1);
      setMonthdays([]);
      setBymonthday([]);
    } else if (value === 30) {
      setFreq(RRule.DAILY);
      setInterval(value);
      setMonthdays([]);
      setBymonthday([]);
    } else if (value === 31) {
      setFreq(RRule.MONTHLY);
      setInterval(1);
      setMonthdays([]);
      setBymonthday([]);
    } else if (value === 11) {
      setFreq(1);
      setInterval(1);
      setMonthdays([{ id: 1, name: '1', nameAr: '1', value: 1 }]);
      setBymonthday([1]);
      setIsLastday(false);
    } else if (value === 33) {
      setFreq(1);
      setInterval(1);
      setMonthdays([{ id: 1, name: '1', nameAr: '1', value: 1 }]);
      setBymonthday([1]);
      setIsLastday(true);
    }
  };

  const date = row?.runtime ? new Date(row?.runtime) : new Date();
  const day = weekdaysNNo?.[date.getDay()];

  const title = isRTL
    ? isNew
      ? 'اضافة تذكير'
      : 'تعديل تذكير'
    : isNew
    ? 'New Reminder'
    : 'Edit Reminder';

  return (
    <PopupLayout
      isRTL={isRTL}
      open={open}
      onClose={onCloseForm}
      title={title}
      onSubmit={onHandleSubmit}
      theme={theme}
      alrt={alrt}
      mt={0}
      mb={20}
      maxWidth="md"
      saving={saving}
    >
      <>
        <Box display="flex">
          <Typography style={{ fontWeight: 'bold' }} variant="body2">
            {row?.docNo}
          </Typography>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <CalenderLocal
                      isRTL={isRTL}
                      label={words.time}
                      value={startDate}
                      onChange={(d: any) => {
                        setStartDate(d);
                        setRuntime(d);
                        setEndDate(d);
                      }}
                      format="dd/MM/yyyy - hh:mm"
                      time
                    ></CalenderLocal>
                  </Grid>
                  <Grid item xs={12}>
                    <TextFieldLocal
                      name="rtitle"
                      multiline
                      rows={3}
                      label={words.description}
                      value={rtitle}
                      onChange={(e: any) => setRtitle(e.target.value)}
                      row={row}
                      fullWidth
                      mb={0}
                    />
                  </Grid>

                  <Grid item xs={3}>
                    <SelectLocal
                      options={intervalOptions.filter(
                        (io: any) => io.id !== 100
                      )}
                      value={periodType}
                      onChange={onChangePeriodType}
                      isRTL={isRTL}
                      width={145}
                    ></SelectLocal>
                  </Grid>
                  {freq === RRule.WEEKLY && (
                    <Grid item xs={3} style={{ marginTop: 8 }}>
                      <SelectMulti
                        options={byweekdayOptions}
                        value={weekdays}
                        setValue={setWeekdays}
                        words={words}
                        isRTL={isRTL}
                        name="weekdays"
                        fullWidth
                        mb={0}
                      ></SelectMulti>
                    </Grid>
                  )}
                  {freq === RRule.MONTHLY && periodType === 31 && (
                    <Grid item xs={3} style={{ marginTop: 8 }}>
                      <SelectMulti
                        options={monthdaysOptions}
                        value={monthdays}
                        setValue={setMonthdays}
                        words={words}
                        isRTL={isRTL}
                        name="monthdays"
                        fullWidth
                        mb={0}
                      ></SelectMulti>
                    </Grid>
                  )}
                  <Grid item xs={3}>
                    <TextFieldLocal
                      required
                      name="count"
                      label={words.qty}
                      value={count}
                      onChange={onChangeCount}
                      type="number"
                      fullWidth
                      mb={0}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextFieldLocal
                      required
                      name="interval"
                      label={words.interval}
                      value={interval}
                      onChange={onChangeInterval}
                      type="number"
                      fullWidth
                      mb={0}
                    />
                  </Grid>
                  {!tempoptions?.noRes && (
                    <Grid item xs={6}>
                      <AutoFieldLocal
                        name="resourse"
                        title={tempwords?.resourse}
                        words={words}
                        options={resourses}
                        value={resovalue}
                        setSelectValue={setResovalue}
                        setSelectError={setResoError}
                        selectError={resoError}
                        refernce={resoRef}
                        register={register}
                        isRTL={isRTL}
                        fullWidth
                        day={day}
                        mb={0}
                        disabled={name === 'resourseId'}
                      ></AutoFieldLocal>
                    </Grid>
                  )}
                  {!tempoptions?.noEmp && (
                    <Grid item xs={6}>
                      <AutoFieldLocal
                        name="employee"
                        title={tempwords?.employee}
                        words={words}
                        options={employees}
                        disabled={name === 'employeeId'}
                        value={emplvalue}
                        setSelectValue={setEmplvalue}
                        setSelectError={setEmplError}
                        selectError={emplError}
                        refernce={emplRef}
                        register={register}
                        isRTL={isRTL}
                        fullWidth
                        day={day}
                        mb={0}
                      ></AutoFieldLocal>
                    </Grid>
                  )}
                  {!tempoptions?.noTsk && (
                    <Grid item xs={6}>
                      <AutoFieldLocal
                        name="task"
                        title={tempwords?.task}
                        words={words}
                        options={tasks}
                        value={taskvalue}
                        setSelectValue={setTaskvalue}
                        isRTL={isRTL}
                        fullWidth
                        disabled={name === 'contractId'}
                      ></AutoFieldLocal>
                    </Grid>
                  )}
                  <Grid item xs={6}>
                    <AutoFieldLocal
                      name="department"
                      title={tempwords?.department}
                      words={words}
                      options={departments.filter((d: any) => d.depType === 1)}
                      value={departvalue}
                      setSelectValue={setDepartvalue}
                      setSelectError={setDepartError}
                      selectError={departError}
                      refernce={departRef}
                      register={register}
                      isRTL={isRTL}
                      fullWidth
                      disabled={name === 'departmentId'}
                      mb={0}
                    ></AutoFieldLocal>
                  </Grid>
                  <Grid item xs={6}></Grid>
                </Grid>
              </Grid>
              <Grid item xs={4}>
                {rrule?.all && (
                  <Paper
                    elevation={2}
                    style={{
                      height: 300,
                      overflow: 'auto',
                      padding: 10,
                      marginTop: 20,
                    }}
                  >
                    <Box style={{ flexDirection: 'row' }}>
                      {rrule?.all?.map((al: any, index: any) => {
                        const al2 = new Date(al);
                        if (isLastday && al2.getDate() === 1) {
                          al2.setDate(al2.getDate() - 1);
                        }

                        return (
                          <Box
                            display="flex"
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              backgroundColor: '#f3f3f3',
                              margin: 5,
                              marginBottom: 10,
                              padding: 7,
                            }}
                          >
                            <Typography>
                              {getDateDayWeek(isLastday ? al2 : al, isRTL)}
                            </Typography>
                            <Typography>{index + 1}</Typography>
                          </Box>
                        );
                      })}
                    </Box>
                  </Paper>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </>
    </PopupLayout>
  );
};

export default PopupReminder;
