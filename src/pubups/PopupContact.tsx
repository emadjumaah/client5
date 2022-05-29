/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  successAlert,
  dublicateAlert,
  errorAlert,
  getReturnItem,
  yup,
} from '../Shared';
import { GContextTypes } from '../types';
import { GlobalContext } from '../contexts';
import { Grid } from '@material-ui/core';
import PopupLayout from '../pages/main/PopupLayout';
import { TextFieldLocal } from '../components';
import FilterSelectMulti from '../Shared/FilterSelectMulti';
import useGroups from '../hooks/useGroups';

const PopupContact = ({
  open,
  onClose,
  row,
  isNew,
  setNewValue,
  addAction,
  editAction,
  newtext,
  theme,
}: any) => {
  const [saving, setSaving] = useState(false);
  const [groupvalue, setGroupvalue] = useState([]);

  const [alrt, setAlrt] = useState({ show: false, msg: '', type: undefined });
  const { register, handleSubmit, errors, reset } = useForm(
    yup.contactResolver
  );
  const {
    translate: { words, isRTL },
  }: GContextTypes = useContext(GlobalContext);
  const { groups } = useGroups();

  useEffect(() => {
    if (open === true && row && row?._id) {
      const grps = groups.filter((g: any) => row?.groupIds?.includes(g._id));
      setGroupvalue(grps);
    }
  }, [open]);

  const getIds = (list: any) =>
    list && list?.length > 0 ? list.map((sv: any) => sv._id) : undefined;

  const onSubmit = async (data: any) => {
    setSaving(true);
    const name = data.name.trim();
    const address = data.address;
    const company = data.company;
    const notes = data.notes;
    const { phone, email } = data;
    const variables: any = {
      _id: row && row._id ? row._id : undefined, // is it new or edit
      name,
      phone,
      email,
      company,
      address,
      notes,
      groupIds: getIds(groupvalue),
    };
    const mutate = isNew ? addAction : editAction;
    const mutateName = isNew ? 'createContact' : 'updateContact';
    apply(mutate, mutateName, variables);
  };

  const apply = async (mutate: any, mutateName: string, variables: any) => {
    try {
      const res = await mutate({ variables });
      const nitem = getReturnItem(res, mutateName);
      if (setNewValue && nitem) setNewValue(nitem, 'contact');
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
    setGroupvalue([]);
    setSaving(false);
  };

  const onHandleSubmit = () => {
    handleSubmit(onSubmit)();
  };

  const title = isRTL
    ? isNew
      ? 'جهة اتصال جديدة'
      : 'تعديل جهة اتصال'
    : isNew
    ? 'New Contact'
    : 'Edit Contact';

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
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <TextFieldLocal
                required
                name="name"
                label={words.name}
                register={register}
                errors={errors}
                row={row}
                fullWidth
                mb={0}
              />
            </Grid>
            <Grid item xs={6}>
              <TextFieldLocal
                required
                name="phone"
                label={words.phoneNumber}
                register={register}
                errors={errors}
                row={row}
                newtext={newtext}
                fullWidth
                mb={0}
              />
            </Grid>
            <Grid item xs={6}>
              <TextFieldLocal
                name="email"
                label={words.email}
                register={register}
                errors={errors}
                row={row}
                fullWidth
                mb={0}
              />
            </Grid>
            <div style={{ marginRight: -5, paddingTop: 3, marginBottom: -5 }}>
              <FilterSelectMulti
                options={groups}
                value={groupvalue}
                setValue={setGroupvalue}
                words={words}
                isRTL={isRTL}
                name="group"
                width={350}
              ></FilterSelectMulti>
            </div>

            <Grid item xs={12}>
              <TextFieldLocal
                name="company"
                label={words.companyName}
                register={register}
                errors={errors}
                row={row}
                fullWidth
                mb={0}
              />
            </Grid>
            <Grid item xs={12}>
              <TextFieldLocal
                name="address"
                label={words.theaddress}
                register={register}
                errors={errors}
                row={row}
                fullWidth
                multiline
                rowsMax={2}
                rows={2}
                mb={0}
              />
            </Grid>
            <Grid item xs={12}>
              <TextFieldLocal
                name="notes"
                label={words.notes}
                register={register}
                errors={errors}
                row={row}
                fullWidth
                multiline
                rowsMax={4}
                rows={4}
                mb={0}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={1}></Grid>
      </Grid>
    </PopupLayout>
  );
};

export default PopupContact;
