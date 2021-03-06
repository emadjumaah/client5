/* eslint-disable react/jsx-no-target-blank */
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
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Typography,
} from '@material-ui/core';
import PopupLayout from '../pages/main/PopupLayout';
import { CalenderLocal, TextFieldLocal } from '../components';
import useGroups from '../hooks/useGroups';
import FilterSelectMulti from '../Shared/FilterSelectMulti';
import _ from 'lodash';
import { getShortLink, getShortLinkInfo, isURL } from '../common/short';

const PopupSendreq = ({
  open,
  onClose,
  row,
  isNew,
  setNewValue,
  addAction,
  editAction,
  theme,
  smss,
  apiKey,
}: any) => {
  const [saving, setSaving] = useState(false);
  const [active, setActive] = useState(false);
  const [runtime, setRuntime] = useState(new Date());
  const [alrt, setAlrt] = useState({ show: false, msg: '', type: undefined });
  const [groupvalue, setGroupvalue] = useState([]);
  const [body, setBody] = useState('');
  const [conqty, setConqty] = useState(0);
  const [smsqty, setSmsqty] = useState(0);
  const [link, setLink] = useState(null);
  const [short, setShort] = useState(null);
  const [shortInfo, setShortInfo] = useState(null);

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
      setShort(row.link);
      setBody(row.body);
    }
  }, [open]);
  useEffect(() => {
    setShortLinkData();
  }, [short]);

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
        isRTL ? '?????? ?????????? ??????????' : 'Send Time is required'
      );
      return;
    }
    if (!groupvalue || groupvalue.length === 0) {
      await messageAlert(
        setAlrt,
        isRTL ? '?????? ?????????? ???????????? ??????????' : 'Please add Contact List'
      );
      return;
    }
    if (body.length < 5) {
      await messageAlert(
        setAlrt,
        isRTL ? `???? ?????????????? ??????????` : `Message body required`
      );
      return;
    }

    if (conqty * smsqty > smss) {
      await messageAlert(
        setAlrt,
        isRTL
          ? `?????? ???????? ?????? ?????? ???? ??????????????`
          : `You don't have enough SMS messages`
      );
      return;
    }

    setSaving(true);
    const { title } = data;

    const variables: any = {
      _id: row && row._id ? row._id : undefined,
      title,
      body,
      link: short,
      runtime,
      active,
      smsqty,
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
    setLink(null);
    setShort(null);
  };

  const onHandleSubmit = () => {
    handleSubmit(onSubmit)();
  };

  const setShortLink = async () => {
    const isurl = isURL(link);
    if (!isurl) {
      await messageAlert(setAlrt, isRTL ? `???????????? ?????? ????????` : `incorrect URL`);
      return;
    }
    const data = await getShortLink({ apiKey, link });
    setShort(data?.short);
  };
  const setShortLinkData = async () => {
    if (!short) {
      return;
    }
    const code = short.replace(/^https?:\/\//, '').split('/')[1];
    const data = await getShortLinkInfo({ apiKey, code });
    setShortInfo(data);
  };

  const title = isRTL
    ? isNew
      ? '???????? ?????????? ??????????'
      : '?????????? ???????? ??????????????'
    : isNew
    ? 'New Campaign'
    : 'Edit Campaign';
  const issms = smss && smss > 0 ? true : false;

  return (
    <PopupLayout
      isRTL={isRTL}
      open={open}
      onClose={closeModal}
      title={title}
      onSubmit={onHandleSubmit}
      theme={theme}
      alrt={alrt}
      onlyclose={!issms}
      saving={saving}
      maxWidth="md"
    >
      <div>
        {!issms && (
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <div style={{ width: 400 }}>
                <Typography variant="h6">
                  {isRTL ? '?????????????? ???????????? ?????? ????????????' : 'SMS Not Available'}
                </Typography>
                <Typography variant="subtitle1">
                  {isRTL
                    ? '???????? ?????????????? ???????? ???????????? ?????? ???????? ??????????'
                    : 'Please contact us for SMS message package'}
                </Typography>
                <div style={{ marginTop: 20 }}>
                  <a target="_blank" rel="Jadwal.io" href="https://jadwal.io/">
                    jadwal.io
                  </a>
                </div>
              </div>
            </Grid>
          </Grid>
        )}
        <div style={{ display: !issms ? 'none' : 'block' }}>
          <Grid container spacing={2}>
            <Grid item xs={1}></Grid>
            <Grid item xs={10}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextFieldLocal
                    autoFocus
                    required
                    name="title"
                    label={isRTL ? '?????? ????????????' : 'Campaign Name'}
                    register={register}
                    errors={errors}
                    row={row}
                    fullWidth
                    mb={0}
                  />
                </Grid>
                <Grid item xs={9}>
                  <FilterSelectMulti
                    options={groups}
                    value={groupvalue}
                    setValue={setGroupvalue}
                    words={words}
                    isRTL={isRTL}
                    name="group"
                    width={350}
                  ></FilterSelectMulti>
                </Grid>
                <Grid item xs={3}>
                  <Typography style={{ padding: 5, marginTop: 15 }}>
                    {words.qty} : {conqty}
                  </Typography>
                </Grid>
                {isNew && (
                  <>
                    <Grid item xs={12}>
                      <Typography>
                        {isRTL
                          ? '???????????? ???? ???????? ?????????? ???????? ?????????????? ????????????'
                          : 'Link Shorten here'}
                      </Typography>
                    </Grid>
                    <Grid item xs={7}>
                      <TextFieldLocal
                        autoFocus
                        required
                        name="link"
                        label={isRTL ? '????????????' : 'Link'}
                        value={link}
                        onChange={(e: any) => setLink(e.target.value)}
                        fullWidth
                        mb={0}
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <Button
                        style={{ marginTop: 9, width: '100%', height: 36 }}
                        variant="contained"
                        onClick={setShortLink}
                      >
                        {isRTL ? '???????????? ????????????' : 'Shot the link'}
                      </Button>
                    </Grid>
                    <Grid item xs={3}>
                      <TextFieldLocal
                        onChange={() => null}
                        name="short"
                        value={short}
                        fullWidth
                        mb={0}
                      />
                    </Grid>
                  </>
                )}
                <Grid item xs={12}>
                  <TextFieldLocal
                    required
                    name="body"
                    label={isRTL ? '???? ??????????????' : 'Message'}
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
                <Grid item xs={4}>
                  <CalenderLocal
                    isRTL={isRTL}
                    label={isRTL ? '?????? ??????????????' : 'Send Time'}
                    value={runtime}
                    onChange={(d: any) => setRuntime(d)}
                    format="dd/MM/yyyy - hh:mm"
                    time
                  ></CalenderLocal>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={active}
                        onChange={(e: any) => setActive(e.target.checked)}
                        name="checkedB"
                        color="primary"
                      />
                    }
                    label={isRTL ? '?????????? ????????????' : 'Activate'}
                  />
                </Grid>
                <Grid item xs={8}>
                  {short && (
                    <div
                      style={{
                        display: 'flex',
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                      }}
                    >
                      <Typography variant="h6">{short}</Typography>
                      <div
                        style={{
                          display: 'flex',
                          flex: 1,
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          width: 250,
                          marginBottom: 20,
                        }}
                      >
                        <div>
                          {isRTL ? '?????????? ??????????????' : 'Total'} {shortInfo?.count}
                        </div>
                        <div>
                          {isRTL ? '?????? ??????????' : 'Cities'}{' '}
                          {shortInfo?.citycount}
                        </div>
                      </div>
                      {shortInfo?.cities?.length > 0 &&
                        shortInfo?.cities.map((city: any) => {
                          return (
                            <div
                              style={{
                                display: 'flex',
                                flex: 1,
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                width: 250,
                                backgroundColor: '#eee',
                                paddingLeft: 10,
                                paddingRight: 10,
                              }}
                            >
                              <div style={{ margin: 10 }}>{city.name}</div>
                              <div>{city.qty}</div>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={1}></Grid>
          </Grid>
        </div>
      </div>
    </PopupLayout>
  );
};

export default PopupSendreq;
