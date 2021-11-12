/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  successAlert,
  dublicateAlert,
  errorAlert,
  getReturnItem,
  messageAlert,
  yup,
} from '../Shared';
import { GContextTypes } from '../types';
import { GlobalContext } from '../contexts';
import {
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  Typography,
} from '@material-ui/core';
import PopupLayout from '../pages/main/PopupLayout';
import { CalenderLocal, TextFieldLocal } from '../components';
import useGroups from '../hooks/useGroups';
import FilterSelectMulti from '../Shared/FilterSelectMulti';
import _ from 'lodash';

const PopupSendreq = ({
  open,
  onClose,
  row,
  isNew,
  setNewValue,
  addAction,
  editAction,
  theme,
}: any) => {
  const [saving, setSaving] = useState(false);
  const [active, setActive] = useState(false);
  const [runtime, setRuntime] = useState(new Date());
  const [alrt, setAlrt] = useState({ show: false, msg: '', type: undefined });
  const [groupvalue, setGroupvalue] = useState([]);
  const [body, setBody] = useState('');
  const [conqty, setConqty] = useState(0);
  const [smsqty, setSmsqty] = useState(0);

  const { register, handleSubmit, errors, reset } = useForm(yup.smsResolver);
  const {
    translate: { words, isRTL },
  }: GContextTypes = useContext(GlobalContext);
  const { groups } = useGroups();

  useEffect(() => {
    if (open === true && row && row?._id) {
      const grps = groups.filter((g: any) => row?.groups?.includes(g._id));
      setGroupvalue(grps);
      setActive(row.active);
      setRuntime(row.runtime);
    }
  }, [open]);

  useEffect(() => {
    const sum = _.sumBy(groupvalue, 'qty');
    setConqty(sum);
  }, [groupvalue]);

  useEffect(() => {
    const smss = Math.ceil(body.length / 70);
    setSmsqty(smss);
  }, [body]);

  const getIds = (list: any) =>
    list && list?.length > 0 ? list.map((sv: any) => sv._id) : undefined;

  const onSubmit = async (data: any) => {
    if (!runtime) {
      await messageAlert(
        setAlrt,
        isRTL ? 'يجب تحديد الوقت' : 'Send Time is required'
      );
      return;
    }
    if (!groupvalue || groupvalue.length === 0) {
      await messageAlert(
        setAlrt,
        isRTL ? 'يجب تحديد مجموعة ارسال' : 'Please add Contact List'
      );
      return;
    }
    if (body.length < 5) {
      await messageAlert(
        setAlrt,
        isRTL ? `نص الرسالة مطلوب` : `Message body required`
      );
      return;
    }

    setSaving(true);
    const { title } = data;

    const variables: any = {
      _id: row && row._id ? row._id : undefined,
      title,
      body,
      runtime,
      active,
      groups: getIds(groupvalue),
    };
    const mutate = isNew ? addAction : editAction;
    const mutateName = isNew ? 'createSendreq' : 'updateSendreq';
    apply(mutate, mutateName, variables);
  };

  const apply = async (mutate: any, mutateName: string, variables: any) => {
    try {
      const res = await mutate({ variables });
      const nitem = getReturnItem(res, mutateName);
      if (setNewValue && nitem) setNewValue(nitem, 'group');
      closeModal();
      await successAlert(setAlrt, isRTL);
      onClose();
    } catch (error) {
      onError(error);
    }
  };

  const onError = async (error: any) => {
    if (error.message.includes('duplicate')) {
      await dublicateAlert(setAlrt, isRTL);
    } else {
      await errorAlert(setAlrt, isRTL);
      reset();
      console.log(error);
    }
  };

  const closeModal = () => {
    onClose();
    reset();
    setSaving(false);
    setRuntime(null);
    setGroupvalue([]);
    setActive(false);
  };

  const onHandleSubmit = () => {
    handleSubmit(onSubmit)();
  };

  const title = isRTL
    ? isNew
      ? 'حملة ارسال جديدة'
      : 'تعديل حملة الارسال'
    : isNew
    ? 'New Campaign'
    : 'Edit Campaign';

  return (
    <PopupLayout
      isRTL={isRTL}
      open={open}
      onClose={closeModal}
      title={title}
      onSubmit={onHandleSubmit}
      theme={theme}
      alrt={alrt}
      saving={saving}
      // maxWidth="md"
    >
      <Grid container spacing={2}>
        <Grid item xs={1}></Grid>
        <Grid item xs={10}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextFieldLocal
                autoFocus
                required
                name="title"
                label={isRTL ? 'اسم الحملة' : 'Campaign Name'}
                register={register}
                errors={errors}
                row={row}
                fullWidth
                mb={0}
              />
            </Grid>
            <Grid item xs={12}>
              <Divider></Divider>
            </Grid>
            <Grid item xs={9}>
              <FilterSelectMulti
                options={groups}
                value={groupvalue}
                setValue={setGroupvalue}
                words={words}
                isRTL={isRTL}
                name="group"
                width={300}
              ></FilterSelectMulti>
            </Grid>
            <Grid item xs={3}>
              <Typography style={{ padding: 5, marginTop: 15 }}>
                {words.qty} : {conqty}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextFieldLocal
                required
                name="body"
                label={isRTL ? 'نص الرسالة' : 'Message'}
                value={body}
                onChange={(e: any) => setBody(e.target.value)}
                row={row}
                multiline
                rows={4}
                fullWidth
                maxLength={500}
                mb={0}
              />
              {`SMSs: (${smsqty})`}
            </Grid>
            <Grid item xs={6}>
              <CalenderLocal
                isRTL={isRTL}
                label={isRTL ? 'وقت الارسال' : 'Send Time'}
                value={runtime}
                onChange={(d: any) => setRuntime(d)}
                format="dd/MM/yyyy - hh:mm"
                time
              ></CalenderLocal>
            </Grid>
            <Grid item xs={6}></Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={active}
                    onChange={(e: any) => setActive(e.target.checked)}
                    name="checkedB"
                    color="primary"
                  />
                }
                label={isRTL ? 'تفعيل الحملة' : 'Activate'}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={1}></Grid>
      </Grid>
    </PopupLayout>
  );
};

export default PopupSendreq;