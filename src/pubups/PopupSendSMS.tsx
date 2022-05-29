/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useContext, useEffect, useState } from 'react';
import { successAlert, messageAlert } from '../Shared';
import { GContextTypes } from '../types';
import { GlobalContext } from '../contexts';
import { Grid } from '@material-ui/core';
import PopupLayout from '../pages/main/PopupLayout';
import { TextFieldLocal } from '../components';
import { phoneRegExp } from '../constants/yupSchemas';

const PopupSendSMS = ({ open, onClose, row, addAction, theme }: any) => {
  const [saving, setSaving] = useState(false);
  const [mobile, setMobile] = useState('');
  const [msg, setMsg] = useState('');
  const [qty, setQty] = useState(0);
  const [alrt, setAlrt] = useState({ show: false, msg: '', type: undefined });
  const {
    translate: { words, isRTL },
  }: GContextTypes = useContext(GlobalContext);

  useEffect(() => {
    const smss = Math.ceil(msg.length / 70);
    setQty(smss);
  }, [msg]);

  const onSubmit = async () => {
    if (msg.length < 5) {
      await messageAlert(
        setAlrt,
        isRTL ? `نص الرسالة مطلوب` : `Message body required`
      );
      return;
    }
    const regex = new RegExp(phoneRegExp);
    if (!regex.test(mobile)) {
      await messageAlert(
        setAlrt,
        isRTL ? `رقم الجوال غير صحيح` : `Mobile number incurrect`
      );
      return;
    }
    setSaving(true);
    const variables: any = {
      mobiles: [mobile],
      msg,
      qty,
    };
    const mutate = addAction;
    apply(mutate, variables);
  };

  const apply = async (mutate: any, variables: any) => {
    try {
      await mutate({ variables });
      await successAlert(setAlrt, isRTL);
      closeModal();
    } catch (error) {
      console.log('error', error);
    }
  };

  const closeModal = () => {
    onClose();
    setSaving(false);
    setMobile('');
    setMsg('');
    setQty(0);
  };

  const title = isRTL ? 'رسالة جديدة' : 'New SMS';

  return (
    <PopupLayout
      isRTL={isRTL}
      open={open}
      onClose={closeModal}
      title={title}
      onSubmit={onSubmit}
      theme={theme}
      alrt={alrt}
      saving={saving}
      savetitle={isRTL ? 'ارسال' : 'Send'}
      // maxWidth="md"
    >
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextFieldLocal
            autoFocus
            required
            name="mobile"
            label={words.mobile}
            value={mobile}
            onChange={(e: any) => setMobile(e.target.value)}
            row={row}
            fullWidth
            mb={0}
          />
        </Grid>
        <Grid item xs={12}>
          <TextFieldLocal
            required
            name="body"
            multiline
            maxLength={210}
            rows={4}
            label={words.body}
            value={msg}
            onChange={(e: any) => setMsg(e.target.value)}
            row={row}
            fullWidth
            mb={0}
          />
          {isRTL ? `عدد الرسائل: ( ${qty} )` : `SMSs: ( ${qty} )`}
        </Grid>
      </Grid>
    </PopupLayout>
  );
};

export default PopupSendSMS;
