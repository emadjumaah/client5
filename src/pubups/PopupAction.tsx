/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useContext, useEffect, useState } from 'react';
import { GContextTypes } from '../types';
import { GlobalContext } from '../contexts';
import PopupLayout from '../pages/main/PopupLayout';
import { Box, Button, Grid } from '@material-ui/core';
import { TextFieldLocal } from '../components';
import { SelectLocal } from '../pages/calendar/common/SelectLocal';
import { timeRelationOptions, timeUnitOptions } from '../constants/rrule';
import { getSendTime } from '../common/helpers';
import { getDateDayTimeFormat } from '../Shared/colorFormat';
import React from 'react';
import { phoneRegExp } from '../constants/yupSchemas';
import { messageAlert } from '../Shared';

const PopupAction = ({
  open,
  onClose,
  row,
  type,
  isNew,
  addAction,
  editAction,
  theme,
  event,
  customer,
  isReminder,
}: any) => {
  const [localtype, setLocatype] = useState(type);
  const [alrt, setAlrt] = useState({ show: false, msg: '', type: undefined });
  const [timeunit, setTimeunit] = useState('minute');
  const [timerelate, setTimerelate] = useState('bstart');
  const [qty, setQty] = useState(isReminder ? 0 : 30);
  const [body, setBody] = useState('');
  const [smsqty, setSmsqty] = useState(0);
  const [address, setAddreess] = useState('');
  const [sendtime, setSendtime] = useState(null);

  const {
    translate: { words, isRTL },
    store: { user },
  }: GContextTypes = useContext(GlobalContext);

  useEffect(() => {
    if (row) {
      setBody(row.body);
      setAddreess(row.address);
      setTimeunit(row.timeunit);
      setQty(row.qty);
      setTimerelate(row.timerelate);
      setSendtime(row.sendtime);
      setLocatype(row.type);
    } else {
      setLocatype(type);
    }
  }, [open]);

  useEffect(() => {
    if (localtype === 1) {
      const smss = Math.ceil(body.length / 70);
      setSmsqty(smss);
    }
  }, [body]);

  useEffect(() => {
    const { startDate, endDate } = event;
    const sendtime = getSendTime({
      startDate,
      endDate,
      timeunit,
      timerelate,
      qty,
    });
    setSendtime(sendtime);
  }, [timeunit, timerelate, qty, open]);

  const onSubmit = async () => {
    if (body.length < 5) {
      await messageAlert(
        setAlrt,
        isRTL ? `نص الرسالة مطلوب` : `Message body required`
      );
      return;
    }
    if (localtype === 1) {
      const regex = new RegExp(phoneRegExp);
      if (!regex.test(address)) {
        await messageAlert(
          setAlrt,
          isRTL ? `رقم الجوال غير صحيح` : `Mobile number incurrect`
        );
        return;
      }
    }
    const variables: any = {
      index: isNew ? undefined : row?.index,
      branch: user.branch,
      type: localtype,
      phone: localtype === 1 ? address : undefined,
      // email: type === 2 ? address : undefined,
      user: localtype === 3 ? user._id : undefined,
      sendtime,
      body,
      smsqty,
      timeunit,
      timerelate,
      qty,
      address,
      userId: user._id,
    };

    isNew ? addAction(variables) : editAction(variables);
    onCloseForem();
  };

  const onHandleSubmit = () => {
    onSubmit();
  };

  const reset = () => {
    setTimeunit('minute');
    setTimerelate('bstart');
    setQty(30);
    setBody('');
    setAddreess('');
    setSendtime(null);
    setSmsqty(0);
  };

  const onCloseForem = () => {
    reset();
    onClose();
  };

  const title = isRTL
    ? isNew
      ? 'اضافة تنبيه'
      : 'تعديل تنبيه'
    : isNew
    ? 'New Action'
    : 'Edit Action';
  const addresstitle =
    localtype === 1
      ? words.mobile
      : localtype === 2
      ? words.email
      : words.notification;

  return (
    <PopupLayout
      isRTL={isRTL}
      open={open}
      onClose={onCloseForem}
      title={title}
      onSubmit={onHandleSubmit}
      theme={theme}
      alrt={alrt}
    >
      <Grid container spacing={2}>
        <Grid item xs={1}></Grid>
        <Grid item xs={9}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextFieldLocal
                required
                name="body"
                multiline
                maxLength={210}
                rows={4}
                label={words.body}
                value={body}
                onChange={(e: any) => setBody(e.target.value)}
                row={row}
                fullWidth
                mb={0}
              />
              {localtype === 1 && `SMSs: (${smsqty})`}
            </Grid>
            <Grid item xs={7}>
              {localtype !== 3 && (
                <TextFieldLocal
                  name="address"
                  label={addresstitle}
                  value={address}
                  onChange={(e: any) => setAddreess(e.target.value)}
                  fullWidth
                  mb={0}
                />
              )}
            </Grid>
            <Grid item xs={5}>
              {localtype !== 3 && customer && (
                <Button
                  style={{ margin: 10 }}
                  variant="outlined"
                  color="secondary"
                  onClick={() => setAddreess(customer?.phone)}
                >
                  {isRTL ? 'استخدم رقم العميل' : 'Use Customer Number'}
                </Button>
              )}
            </Grid>
            <Grid item xs={12}>
              {!isReminder && (
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <SelectLocal
                      options={timeRelationOptions}
                      value={timerelate}
                      onChange={(e: any) => setTimerelate(e.target.value)}
                      isRTL={isRTL}
                      width={128}
                    ></SelectLocal>
                  </Grid>
                  <Grid item xs={4}>
                    <TextFieldLocal
                      required
                      name="qty"
                      label={words.qty}
                      value={qty}
                      onChange={(e: any) => setQty(Number(e.target.value))}
                      type="number"
                      width={128}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <SelectLocal
                      options={timeUnitOptions}
                      value={timeunit}
                      onChange={(e: any) => setTimeunit(e.target.value)}
                      isRTL={isRTL}
                      width={128}
                    ></SelectLocal>
                  </Grid>
                </Grid>
              )}
              <Grid container spacing={2}>
                {!isReminder && (
                  <Grid item xs={12}>
                    <Box
                      display="flex"
                      style={{
                        flex: 1,
                        direction: 'ltr',
                        fontSize: 16,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {getDateDayTimeFormat(sendtime, isRTL)}
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={2}></Grid>
      </Grid>
    </PopupLayout>
  );
};

export default PopupAction;
